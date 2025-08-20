import FuelTransaction from "../../models/FuelTransaction.js";
import FuelStock from "../../models/FuelStock.js";
import Farmer from "../../models/Farmer.js";
import Driver from "../../models/Driver.js";
import Admin from "../../models/Admin.js";
import OtherUser from "../../models/Others.js";
import FuelDelivery from '../../models/FuelDelivery.js';
import bcrypt from "bcryptjs";
import moment from "moment";
import ExcelJS from 'exceljs';
import path from 'path';

export async function getAllFuelTransactions(req, res) {
  try {
    const transactions = await FuelTransaction.find()
      .populate("driver", "name phone carPlate carType")
      .populate("farmer", "fullName")
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getAllFuelStocks(req, res) {
  try {
    const stocks = await FuelStock.find().sort({ createdAt: -1 });
    res.status(200).json(stocks);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function addFuelStock(req, res) {
  try {
    const { stationName,city, gasType, litersReceived} = req.body;
    const newStock = new FuelStock({ stationName,city, gasType, litersReceived });
    await newStock.save();
    res.status(201).json({ msg: "Fuel stock added", stock: newStock });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function updateFuelDispensed(req, res) {
  try {
    const { stockId } = req.params;
    const { litersDispensed } = req.body;

    const stock = await FuelStock.findById(stockId);
    if (!stock) return res.status(404).json({ msg: "Fuel stock not found" });

    stock.litersDispensed += litersDispensed;
    await stock.save();

    res.status(200).json({ msg: "Fuel dispensed updated", stock });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function refillFuelStock(req, res) {
  try {
    const { stockId } = req.params;
    const { additionalLiters } = req.body;

    const stock = await FuelStock.findById(stockId);
    if (!stock) return res.status(404).json({ msg: "Fuel stock not found" });

    stock.litersReceived += additionalLiters;
    await stock.save();

    res.status(200).json({ msg: "Fuel stock refilled", stock });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getFarmerDetails(req, res) {
  const { id } = req.params;

  try {
    const farmer = await Farmer.findById(id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const last15Days = moment().subtract(15, 'days').startOf('day').toDate();

    const recentTx = await FuelTransaction.findOne({
      farmer: id,
      date: { $gte: last15Days }
    });

    const isEligible = !recentTx;

    res.status(200).json({
      farmer: {
        id: farmer._id,
        name: farmer.fullName,
        phoneNumber: farmer.phoneNumber,
        kebele: farmer.kebele,
        woreda: farmer.woreda
      },
      isEligible
    });
  } catch (error) {
    console.error("Error getting farmer details:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getAllFarmers(req, res) {
  try {
    const farmers = await Farmer.find()
      .populate("approvedBy", "name email");

    res.status(200).json(farmers);
  } catch (error) {
    console.error("Error fetching farmers:", error);
    res.status(500).json({ message: "Server error" });
  }
}


export async function getDriverDetails(req, res) {
  const { id } = req.params;

  try {
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const today = moment().startOf("day").toDate();
    const transaction = await FuelTransaction.findOne({
      driver: id, 
      date: { $gte: today },
    });

    const alreadyReceivedFuelToday = !!transaction;

    res.status(200).json({
      driver: {
        id: driver._id,
        name: driver.name,
        vehicleType: driver.carType,
        fuelLimit: driver.fuelLimit,
      },
      alreadyReceivedFuelToday,
    });
  } catch (error) {
    console.error("Error getting driver details:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getAllDrivers(req, res) {
  try {
    const drivers = await Driver.find()
      .populate("approvedBy", "name email");

    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Server error" });
  }
}



/**
 * Super Admin - Create new admin (approver or registerer)
 */
export async function createAdmin(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (!["approver", "register"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role. Must be approver or registerer." });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Admin with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newAdmin.save();
    res.status(201).json({ msg: `New ${role} admin created successfully.` });
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
    const admins = await Admin.find().select("-password"); // exclude passwords
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch admins", error: err.message });
  }
}

/**
 * Super Admin - Delete an admin by ID
 */
export async function deleteAdmin(req, res) {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    await admin.deleteOne();
    res.status(200).json({ msg: "Admin deleted successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting admin", error: err.message });
  }
}



export async function getAllOthers(req, res) {
  try {
    const others = await OtherUser.find()
      .populate("approvedBy", "name email");

    res.status(200).json(others);
  } catch (error) {
    console.error("Error fetching others:", error);
    res.status(500).json({ message: "Server error" });
  }
}




export async function uploadFuelDeliveries(req, res) {
  const fuelType = req.body.fuelType;

  if (!req.file) {
    return res.status(400).json({ message: 'No XLSX file uploaded' });
  }

  if (!['diesel', 'benzene'].includes(fuelType)) {
    return res.status(400).json({ message: 'Invalid fuel type' });
  }

  try {
    const filePath = path.join(process.cwd(), req.file.path);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    const deliveries = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const [
        date,
        customer,
        destination,
        citter,
        fdcNo,
        volume,
        region
      ] = row.values.slice(1); // Skip first empty value

     
      deliveries.push({
        date: date?.toString().trim(),
        customer: customer?.toString().trim(),
        destination: destination?.toString().trim(),
        citter: citter?.toString().trim(),
        fdcNo: fdcNo?.toString().trim(),
        volume: parseFloat(volume),
        region: region?.toString().trim(),
        fuelType,
        isConfirmed: false
      });
    });

    await FuelDelivery.insertMany(deliveries);

    res.status(200).json({ message: 'Fuel deliveries imported successfully', data: deliveries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to process fuel deliveries', error: error.message });
  }
}

   


export async function getFuelDeliveries(req, res) {
  const fuelType = req.query.fuelType;

  if (!['benzene', 'diesel'].includes(fuelType)) {
    return res.status(400).json({ message: 'Invalid fuel type' });
  }

  try {
    const deliveries = await FuelDelivery.find({ fuelType }).sort({ createdAt: -1 });
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch fuel deliveries', error: error.message });
  }
};

// controllers/fuelDeliveryController.js
export async function approveFuelDelivery(req, res) {
  try {
    const { id } = req.params;

    const delivery = await FuelDelivery.findByIdAndUpdate(
      id,
      { isConfirmed: true },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: 'Fuel delivery not found' });
    }

    res.status(200).json({ message: 'Fuel delivery approved', data: delivery });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve fuel delivery', error: error.message });
  }
}
