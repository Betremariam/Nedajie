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
    const { name, email, companyName, region, stationIds } = req.body;
    const documentPath = req.file ? req.file.path : null;

    if (!name || !email || !companyName || !region) {
      return res.status(400).json({ msg: "Name, email, companyName, and region are required." });
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
    if (existing) {
      return res.status(400).json({ msg: "Email already exists." });
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const owner = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "stationOwner",
        companyName,
        region,
        stationIds: parsedStationIds,
        documentPath,
        mustChangePassword: true,
        isApproved: true // Federal approved them directly
      }
    });

    res.status(201).json({
      msg: "Owner created and approved successfully.",
      tempPassword,
      owner: { id: owner.id, name: owner.name, companyName, region }
    });
  } catch (err) {
    console.error("Create Owner Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

/**
 * Federal - Add Fuel Delivery
 */
export async function addFuelDelivery(req, res) {
  try {
    const { date, customer, destination, citter, fdcNo, volume, region, fuelType } = req.body;

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
        status: "PENDING"
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
    const admins = await prisma.admin.findMany({
      where: {
        role: { in: ["super", "stationOwner"] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        region: true,
        companyName: true,
        stationIds: true,
        isBlocked: true,
        isApproved: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json(admins);
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
    const stationOwnersCount = await prisma.admin.count({ where: { role: "stationOwner", isApproved: true } });
    
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
