import prisma from "../../lib/prisma.js";

/**
 * Super Admin - Get pending deliveries for their region
 */
export async function getPendingDeliveriesForSuperAdmin(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    if (!admin || admin.role !== "super") {
      return res.status(403).json({ msg: "Access denied. Super Admin role required." });
    }

    const deliveries = await prisma.fuelDelivery.findMany({
      where: {
        region: admin.region,
        status: "PENDING"
      },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json(deliveries);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

/**
 * Super Admin - Confirm delivery
 */
export async function confirmDeliveryBySuperAdmin(req, res) {
  try {
    const { deliveryId } = req.params;
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });

    const delivery = await prisma.fuelDelivery.findUnique({ where: { id: deliveryId } });
    if (!delivery) return res.status(404).json({ msg: "Delivery not found." });

    if (delivery.region !== admin.region) {
      return res.status(403).json({ msg: "You can only confirm deliveries for your region." });
    }

    const superAdminSignedPath = req.file ? req.file.path : null;

    const updated = await prisma.fuelDelivery.update({
      where: { id: deliveryId },
      data: {
        status: "SUPERADMIN_ACCEPTED",
        superAdminId: admin.id,
        superAdminSignedPath
      }
    });

    res.status(200).json({ msg: "Delivery confirmed by Super Admin.", delivery: updated });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

/**
 * Owner - Get deliveries targeting them (after Super Admin confirmation)
 */
export async function getDeliveriesForOwner(req, res) {
  try {
    const owner = req.admin;
    if (!owner) {
      return res.status(403).json({ msg: "Access denied. Owner role required." });
    }

    // Match by customer/destination names (companyName or name)
    const deliveries = await prisma.fuelDelivery.findMany({
      where: {
        status: "SUPERADMIN_ACCEPTED",
        OR: [
          { ownerId: owner.id },
          { customer: owner.stationName || "" },
          { destination: owner.stationName || "" }
        ]
      },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json(deliveries);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

/**
 * Owner - Accept delivery and update stock
 */
export async function acceptDeliveryByOwner(req, res) {
  try {
    const { deliveryId } = req.params;
    const owner = req.admin;

    const delivery = await prisma.fuelDelivery.findUnique({ where: { id: deliveryId } });
    if (!delivery) return res.status(404).json({ msg: "Delivery not found." });

    if (delivery.status !== "SUPERADMIN_ACCEPTED") {
      return res.status(400).json({ msg: "Delivery must be confirmed by Super Admin first." });
    }

    // Logic: If owner accepts, it adds to stock.
    // The user said: "it will be added in the fuelstock of the superadmin section"
    // I will find/create a FuelStock entry for this station (named after destination or owner's company)
    
    const { stationName, city, woreda, region } = owner;
    
    // Use a transaction to ensure atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update delivery status
      const ownerSignedPath = req.file ? req.file.path : null;
      const updatedDelivery = await tx.fuelDelivery.update({
        where: { id: deliveryId },
        data: {
          status: "OWNER_ACCEPTED",
          ownerId: owner.id,
          isConfirmed: true,
          ownerSignedPath
        }
      });

      // 2. Find or create fuel stock for this station
      let stock = await tx.fuelStock.findFirst({
        where: {
          stationName,
          woreda,
          city,
          region,
          gasType: delivery.fuelType
        }
      });

      if (stock) {
        stock = await tx.fuelStock.update({
          where: { id: stock.id },
          data: {
            litersReceived: { increment: delivery.volume },
            date: new Date(),
            region // Ensure region is set
          }
        });
      } else {
        stock = await tx.fuelStock.create({
          data: {
            stationName,
            woreda,
            city,
            region,
            gasType: delivery.fuelType,
            litersReceived: delivery.volume,
            date: new Date()
          }
        });
      }

      // 3. Create fuel received record
      await tx.fuelReceived.create({
        data: {
          stationId: stock.id,
          stationName,
          city,
          region,
          gasType: delivery.fuelType,
          liters: delivery.volume,
          date: new Date()
        }
      });

      return updatedDelivery;
    });

    res.status(200).json({ 
      msg: "Delivery accepted. Fuel stock updated.", 
      delivery: result 
    });
  } catch (err) {
    console.error("Accept Delivery Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}
