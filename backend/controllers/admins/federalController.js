import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

// Helper for temporary password
function generateTempPassword(length = 10) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Federal - Create a regional Super Admin
 */
export async function createRegionalSuperAdmin(req, res) {
  try {
    const { name, email, region } = req.body;
    const documentPath = req.file ? req.file.path : null;

    if (!name || !email || !region) {
      return res.status(400).json({ msg: "Name, email, and region are required." });
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ msg: "Admin with this email already exists." });
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const superAdmin = await prisma.admin.create({
      data: { 
        name, 
        email, 
        password: hashedPassword, 
        role: "super", 
        region,
        documentPath,
        mustChangePassword: true 
      },
    });

    res.status(201).json({
      msg: `Regional Super Admin for ${region} created successfully.`,
      tempPassword,
      superAdmin: { id: superAdmin.id, name: superAdmin.name, email: superAdmin.email, region }
    });
  } catch (err) {
    console.error("Create Regional Super Admin Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

/**
 * Federal - Register and Approve an Owner
 */
export async function createOwner(req, res) {
  try {
    const { name, email, region, stationIds, zone, woreda, city, stationName } = req.body;
    
    // Extract file paths from req.files
    const legalDocPath = req.files?.legalDoc?.[0]?.path || null;
    const fuelLicensePath = req.files?.fuelLicense?.[0]?.path || null;
    const constructionDocPath = req.files?.constructionDoc?.[0]?.path || null;
    const safetyCertPath = req.files?.safetyCert?.[0]?.path || null;
    const envClearancePath = req.files?.envClearance?.[0]?.path || null;
    const pumpCalibrationPath = req.files?.pumpCalibration?.[0]?.path || null;

    if (!name || !email || !region) {
      console.warn("createOwner 400: Missing required fields", { name: !!name, email: !!email, region: !!region });
      return res.status(400).json({ msg: "Name, email, and region are required." });
    }


    let parsedStationIds = [];
    if (stationIds) {
      if (typeof stationIds === 'string') {
        try {
          parsedStationIds = JSON.parse(stationIds);
        } catch (e) {
          parsedStationIds = stationIds.split(',').map(s => s.trim());
        }
      } else if (Array.isArray(stationIds)) {
        parsedStationIds = stationIds;
      }
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    const existingStationByEmail = await prisma.fuelStation.findUnique({ where: { email } });
    
    if (existing || existingStationByEmail) {
      console.warn("createOwner 400: Email already exists", email);
      return res.status(400).json({ msg: "Email already exists." });
    }

    if (stationName) {
      const existingStationByName = await prisma.fuelStation.findUnique({ where: { stationName } });
      if (existingStationByName) {
        console.warn("createOwner 400: Station name already exists", stationName);
        return res.status(400).json({ msg: "Station name already exists." });
      }
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const owner = await prisma.fuelStation.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "stationOwner",
        region,
        zone,
        woreda,
        city,
        stationName,
        mustChangePassword: true,
        isApproved: true,
        legalDocPath,
        fuelLicensePath,
        constructionDocPath,
        safetyCertPath,
        envClearancePath,
        pumpCalibrationPath
      }
    });

    // Automatically create stocks if stationName, zone, and woreda are provided
    if (stationName && zone && woreda) {
      // Create Benzene Stock
      await prisma.fuelStock.create({
        data: {
          stationName,
          city: city || woreda,
          region,
          gasType: "benzene",
          litersReceived: 0
        }
      });
      
      // Create Diesel Stock
      await prisma.fuelStock.create({
        data: {
          stationName,
          city: city || woreda,
          region,
          gasType: "diesel",
          litersReceived: 0
        }
      });
    }

    res.status(201).json({
      msg: "Owner created and approved successfully under Fuel Station table.",
      tempPassword,
      owner: { id: owner.id, name: owner.name, stationName, region }
    });
  } catch (err) {
    console.error("Create Owner Error:", err);
    if (err.code === 'P2002') {
      const target = err.meta?.target || [];
      return res.status(400).json({ 
        msg: `Unique constraint failed: ${target.join(', ')} already exists.` 
      });
    }
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}


/**
 * Federal - Add Fuel Delivery
 */
export async function addFuelDelivery(req, res) {
  try {
    const { date, customer, destination, citter, fdcNo, volume, region, fuelType, ownerId } = req.body;
    const federalLetterPath = req.file ? req.file.path : null;

    if (!date || !customer || !destination || !citter || !fdcNo || !volume || !region || !fuelType) {
      return res.status(400).json({ msg: "All fields are required for fuel delivery." });
    }

    const delivery = await prisma.fuelDelivery.create({
      data: {
        date,
        customer,
        destination,
        citter,
        fdcNo,
        volume: parseFloat(volume),
        region,
        fuelType,
        status: "PENDING",
        federalLetterPath,
        ownerId: ownerId || null
      }
    });

    res.status(201).json({ msg: "Fuel delivery added successfully.", delivery });
  } catch (err) {
    console.error("Add Fuel Delivery Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

/**
 * Federal - Get all Fuel Deliveries
 */
export async function getAllFuelDeliveries(req, res) {
  try {
    const deliveries = await prisma.fuelDelivery.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json(deliveries);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

/**
 * Federal - Get all Super Admins and Owners
 */
export async function getFederalAdmins(req, res) {
  try {
    const [admins, stations] = await Promise.all([
      prisma.admin.findMany({
        where: { role: "super" },
        select: {
          id: true, name: true, email: true, role: true, region: true,
          isBlocked: true, isApproved: true, createdAt: true,
        }
      }),
      prisma.fuelStation.findMany({
        select: {
          id: true, name: true, email: true, role: true, region: true,
          zone: true, woreda: true, city: true, stationName: true,
          isBlocked: true, isApproved: true, createdAt: true,
        }
      })
    ]);

    // Combine and sort by createdAt
    const combined = [...admins, ...stations].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json(combined);
  } catch (err) {
    console.error("Get Federal Admins Error:", err);
    res.status(500).json({ msg: "Failed to fetch administrative records", error: err.message });
  }
}

/**
 * Federal - Get Dashboard Stats
 */
export async function getFederalDashboardStats(req, res) {
  try {
    const superAdminsCount = await prisma.admin.count({ where: { role: "super" } });
    const stationOwnersCount = await prisma.fuelStation.count({ where: { isApproved: true } });
    
    const totalDeliveries = await prisma.fuelDelivery.count();

    const recentDeliveries = await prisma.fuelDelivery.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json({
      superAdmins: superAdminsCount,
      verifiedOwners: stationOwnersCount,
      totalDeliveries,
      recentDeliveries
    });
  } catch (err) {
    console.error("Get Dashboard Stats Error:", err);
    res.status(500).json({ msg: "Failed to fetch dashboard stats", error: err.message });
  }
}
