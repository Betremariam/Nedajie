import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import moment from "moment";
import ExcelJS from "exceljs";
import path from "path";

export async function getAllFuelTransactions(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    
    const where = (admin && admin.role === "super" && admin.region) 
      ? { region: admin.region } 
      : {};
    
    const transactions = await prisma.fuelTransaction.findMany({
      where,
      include: {
        vehicle: {
          select: {
            ownerName: true,
            phone: true,
            carPlate: true,
            vehicleType: true,
          },
        },
        farmer: {
          select: {
            fullName: true,
          },
        },
        millHouseOwner: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getAllFuelStocks(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    
    const where = (admin && admin.role === "super" && admin.region) 
      ? { region: admin.region } 
      : {};
    
    const stocks = await prisma.fuelStock.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(stocks);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function addFuelStock(req, res) {
  try {
    const { stationName, city, gasType, litersReceived } = req.body;
    const newStock = await prisma.fuelStock.create({
      data: {
        stationName,
        city,
        gasType,
        litersReceived,
      },
    });
    res.status(201).json({ msg: "Fuel stock added", stock: newStock });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function updateFuelDispensed(req, res) {
  try {
    const { stockId } = req.params;
    const { litersDispensed } = req.body;

    const stock = await prisma.fuelStock.findUnique({
      where: { id: stockId },
    });
    if (!stock) return res.status(404).json({ msg: "Fuel stock not found" });

    const updatedStock = await prisma.fuelStock.update({
      where: { id: stockId },
      data: {
        litersDispensed: stock.litersDispensed + litersDispensed,
      },
    });

    res.status(200).json({ msg: "Fuel dispensed updated", stock: updatedStock });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function refillFuelStock(req, res) {
  try {
    const { stockId } = req.params;
    const { additionalLiters } = req.body;

    const stock = await prisma.fuelStock.findUnique({
      where: { id: stockId },
    });
    if (!stock) return res.status(404).json({ msg: "Fuel stock not found" });

    // Use a transaction to ensure both updates happen or none
    const [updatedStock, newRecord] = await prisma.$transaction([
      prisma.fuelStock.update({
        where: { id: stockId },
        data: {
          litersReceived: stock.litersReceived + additionalLiters,
        },
      }),
      prisma.fuelReceived.create({
        data: {
          stationId: stock.id,
          stationName: stock.stationName,
          city: stock.city,
          gasType: stock.gasType,
          liters: additionalLiters,
        },
      }),
    ]);

    res.status(200).json({
      msg: "Fuel stock refilled",
      stock: updatedStock,
      record: newRecord,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getFarmerDetails(req, res) {
  const { id } = req.params;

  try {
    const farmer = await prisma.farmer.findUnique({
      where: { id },
    });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const last15Days = moment().subtract(15, "days").startOf("day").toDate();

    const recentTx = await prisma.fuelTransaction.findFirst({
      where: {
        farmerId: id,
        date: { gte: last15Days },
      },
    });

    const isEligible = !recentTx;

    res.status(200).json({
      farmer: {
        id: farmer.id,
        name: farmer.fullName,
        phoneNumber: farmer.phoneNumber,
        kebele: farmer.kebele,
        woreda: farmer.woreda,
      },
      isEligible,
    });
  } catch (error) {
    console.error("Error getting farmer details:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getAllFarmers(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    const where = (admin && admin.role === "super" && admin.region) ? { region: admin.region } : {};

    const farmers = await prisma.farmer.findMany({
      where,
      include: {
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(farmers);
  } catch (error) {
    console.error("Error fetching farmers:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getVehicleDetails(req, res) {
  const { id } = req.params;

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const today = moment().startOf("day").toDate();
    const transaction = await prisma.fuelTransaction.findFirst({
      where: {
        vehicleId: id,
        createdAt: { gte: today },
      },
    });

    const alreadyReceivedFuelToday = !!transaction;

    res.status(200).json({
      vehicle: {
        id: vehicle.id,
        ownerName: vehicle.ownerName,
        vehicleType: vehicle.vehicleType,
        fullCapacity: vehicle.fullCapacity
      },
      alreadyReceivedFuelToday,
    });
  } catch (error) {
    console.error("Error getting vehicle details:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getAllVehicles(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    const where = (admin && admin.role === "super" && admin.region) ? { region: admin.region } : {};

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Super Admin - Create new admin (approver or registerer)
 */
// Helper: generate a random alphanumeric temp password
function generateTempPassword(length = 10) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createAdmin(req, res) {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ msg: "Name, email, and role are required." });
    }

    const allowedRoles = ["approver", "register", "federal", "super"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ msg: `Invalid role. Must be one of: ${allowedRoles.join(", ")}` });
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ msg: "Admin with this email already exists." });
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const { region, companyName } = req.body;

    await prisma.admin.create({
      data: { 
        name, 
        email, 
        password: hashedPassword, 
        role, 
        mustChangePassword: true,
        region,
        companyName
      },
    });

    res.status(201).json({
      msg: `New ${role} admin created successfully.`,
      tempPassword,
    });
  } catch (err) {
    console.error("Create Admin Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

/**
 * Super Admin - View all admins
 */
export async function getAllAdmins(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    const where = (admin && admin.role === "super" && admin.region) ? { region: admin.region } : {};

    const admins = await prisma.admin.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        region: true,
        companyName: true,
        stationIds: true,
        isBlocked: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch admins", error: err.message });
  }
}

export async function blockAdmin(req, res) {
  try {
    const { adminId } = req.params;
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const updated = await prisma.admin.update({
      where: { id: adminId },
      data: { isBlocked: !admin.isBlocked },
    });

    res.status(200).json({
      msg: updated.isBlocked ? "Admin has been blocked." : "Admin has been unblocked.",
      isBlocked: updated.isBlocked,
    });
  } catch (err) {
    res.status(500).json({ msg: "Error toggling block status", error: err.message });
  }
}

/**
 * Super Admin - Delete an admin by ID
 */
export async function deleteAdmin(req, res) {
  try {
    const { adminId } = req.params;
    await prisma.admin.delete({
      where: { id: adminId },
    });
    res.status(200).json({ msg: "Admin deleted successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting admin", error: err.message });
  }
}

export async function createStationOwner(req, res) {
  try {
    const { name, email, stationIds } = req.body;

    if (!stationIds || !Array.isArray(stationIds) || stationIds.length === 0) {
      return res.status(400).json({ msg: "At least one stationId is required" });
    }

    const stations = await prisma.fuelStock.findMany({
      where: { id: { in: stationIds } },
    });
    if (stations.length !== stationIds.length) {
      return res.status(404).json({ msg: "One or more stations not found" });
    }

    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ msg: "Email already used" });

    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 10);

    const owner = await prisma.admin.create({
      data: { name, email, password: hashed, role: "stationOwner", stationIds, mustChangePassword: true },
    });

    res.status(201).json({ msg: "Station owner created", ownerId: owner.id, tempPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getAllOthers(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    const where = (admin && admin.role === "super" && admin.region) ? { region: admin.region } : {};

    const others = await prisma.otherUser.findMany({
      where,
      include: {
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(others);
  } catch (error) {
    console.error("Error fetching others:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getAllMillHouseOwners(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    const where = (admin && admin.role === "super" && admin.region) ? { region: admin.region } : {};

    const owners = await prisma.millHouseOwner.findMany({
      where,
      include: {
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(owners);
  } catch (error) {
    console.error("Error fetching mill house owners:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function uploadFuelDeliveries(req, res) {
  const fuelType = req.body.fuelType;

  if (!req.file) {
    return res.status(400).json({ message: "No XLSX file uploaded" });
  }

  if (!["diesel", "benzene"].includes(fuelType)) {
    return res.status(400).json({ message: "Invalid fuel type" });
  }

  try {
    const filePath = path.join(process.cwd(), req.file.path);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    const deliveries = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const [date, customer, destination, citter, fdcNo, volume, region] =
        row.values.slice(1); // Skip first empty value

      deliveries.push({
        date: date?.toString().trim(),
        customer: customer?.toString().trim(),
        destination: destination?.toString().trim(),
        citter: citter?.toString().trim(),
        fdcNo: fdcNo?.toString().trim(),
        volume: parseFloat(volume),
        region: region?.toString().trim(),
        fuelType,
      });
    });

    await prisma.fuelDelivery.createMany({
      data: deliveries,
    });

    res.status(200).json({
      message: "Fuel deliveries imported successfully",
      data: deliveries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to process fuel deliveries",
      error: error.message,
    });
  }
}

export async function getFuelDeliveries(req, res) {
  const fuelType = req.query.fuelType;

  if (!["benzene", "diesel"].includes(fuelType)) {
    return res.status(400).json({ message: "Invalid fuel type" });
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    const where = { fuelType };
    if (admin && admin.region) where.region = admin.region;

    const deliveries = await prisma.fuelDelivery.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch fuel deliveries",
      error: error.message,
    });
  }
}

export async function approveFuelDelivery(req, res) {
  try {
    const { id } = req.params;

    const delivery = await prisma.fuelDelivery.update({
      where: { id },
      data: { isConfirmed: true },
    });

    res.status(200).json({ message: "Fuel delivery approved", data: delivery });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve fuel delivery",
      error: error.message,
    });
  }
}
