import Driver from "../../models/Driver.js";
import FuelAttendant from "../../models/FuelAttendant.js";
import Farmer from "../../models/Farmer.js";
import OtherUser from "../../models/Others.js";

import bcrypt from "bcryptjs";
import { hash } from "bcryptjs";




export async function registerDriver(req, res) {
  try {
    const { name, phone, carType, carPlate, password } = req.body;

    
    if (!req.file) {
      return res.status(400).json({ msg: "Document is required" });
    }

    const existing = await Driver.findOne({ phone });
    if (existing) return res.status(400).json({ msg: "Driver already registered" });

    const hashed = await hash(password, 10);

    const driver = new Driver({
      name,
      phone,
      carType,
      carPlate,
      password: hashed,
      isApproved: false,
      documentPath: req.file.path, 
    });

    await driver.save();
    res.status(201).json({
  msg: "Driver registered. Awaiting admin approval.",
  driverId: driver._id,
});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function registerAttendant(req, res) {
  try {
    const { name, phone, password, stationName ,city} = req.body;

    
    if (!name || !phone || !password || !stationName|| !city) {
      return res.status(400).json({ msg: "All fields are required." });
    }

   
    if (!req.file) {
      return res.status(400).json({ msg: "Document is required." });
    }

   
    const existing = await FuelAttendant.findOne({ phone });
    if (existing) {
      return res.status(400).json({ msg: "Phone already registered." });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newAttendant = new FuelAttendant({
      name,
      phone,
      password: hashedPassword,
      stationName,
      city,
      documentPath: req.file.path, 
    });

    await newAttendant.save();
    res.status(201).json({ msg: "Registered successfully. Await admin approval." });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}


export async function registerFarmer(req, res) {
  try {
    const { fullName, kebele, woreda, phoneNumber } = req.body;

    // Validate required fields
    if (!fullName || !kebele || !woreda || !phoneNumber) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // Ensure a document is uploaded
    if (!req.file) {
      return res.status(400).json({ msg: "Document is required." });
    }

    // Check for duplicate phone number
    const existingFarmer = await Farmer.findOne({ phoneNumber });
    if (existingFarmer) {
      return res.status(400).json({ msg: "Phone number already registered." });
    }

    // Create new farmer
    const newFarmer = new Farmer({
      fullName,
      kebele,
      woreda,
      phoneNumber,
      documentPath: req.file.path, // From Multer middleware
      isApproved: false, // Default: waiting for approval
    });

    await newFarmer.save();

    res.status(201).json({ msg: "Farmer registered. Awaiting approval." ,  farmerId:newFarmer._id });
  } catch (err) {
    console.error("Farmer Registration Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export const registerOtherUser = async (req, res) => {
  try {
    const { fullName, phoneNumber, fuelType } = req.body;

    // Check if required fields exist
    if (!fullName || !phoneNumber || !fuelType) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if file was uploaded
    const documentPath = req.file ? req.file.path : null;

    const newOtherUser = new OtherUser({
      fullName,
      phoneNumber,
      fuelType,
      documentPath,
    });

    await newOtherUser.save();

    res.status(201).json({
      msg: "Other user registered successfully",
      othersId: newOtherUser._id,
    });
  } catch (err) {
    console.error("Register Other User Error:", err.message);
    res.status(500).json({ msg: "Server error while registering other user" });
  }
};

