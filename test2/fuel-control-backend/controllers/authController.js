import Driver from "../models/Driver.js";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
const { sign } = jwt;


export async function register(req, res) {
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
    res.status(201).json({ msg: "Driver registered. Awaiting admin approval." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



export async function login(req, res) {
  try {
    const { phone, password } = req.body;
    const driver = await Driver.findOne({ phone });
    if (!driver) return res.status(400).json({ msg: "Invalid phone or password" });

    const isMatch = await compare(password, driver.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid phone or password" });

    
    if (!driver.isApproved) {
      return res.status(403).json({ msg: "Your account is awaiting admin approval." });
    }

    const token = sign({ id: driver._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        phone: driver.phone,
        carType: driver.carType,
        carPlate: driver.carPlate
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function approveDriver(req, res) {
  try {
    const { driverId } = req.params;
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ msg: "Driver not found" });

    driver.isApproved = true;
    await driver.save();

    res.status(200).json({ msg: "Driver approved successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
