import FuelStock from "../models/FuelStock.js";
import FuelTransaction from "../models/FuelTransaction.js";
import FuelReceived from "../models/FuelReceived.js";

export const ownerFuelReceived = async (req, res) => {
  try {
    let stationIds = req.query.stationIds;

    if (!stationIds) {
      return res.status(400).json({ msg: "No station IDs provided" });
    }

    // Ensure stationIds is an array
    if (!Array.isArray(stationIds)) {
      stationIds = [stationIds];
    }

    // Fetch all FuelReceived records for these station IDs
    const records = await FuelReceived.find({ station: { $in: stationIds } })
      .sort({ createdAt: -1 })
      .populate("station", "stationName city gasType"); 
      // populate from FuelStock so you can access stationName & city

    if (!records || records.length === 0) {
      return res
        .status(404)
        .json({ msg: "No fuel received records found for these stations" });
    }

    // Reshape response (flatten station details into the response)
    const formatted = records.map((r) => ({
      _id: r._id,
      stationName: r.station?.stationName || "",
      city: r.station?.city || "",
      gasType: r.gasType,
      liters: r.liters,
      date: r.date,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("ownerFuelReceived error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};



export const ownerStations = async (req, res) => {
  try {
    let stationIds = req.admin.stationIds; // array of assigned stations
    if (!stationIds || stationIds.length === 0) {
      return res.status(400).json({ msg: "⚠️ No stations assigned to this owner" });
    }

    const stations = await FuelStock.find({ _id: { $in: stationIds } }).select("stationName city");
    res.json(stations);
  } catch (err) {
    console.error("ownerStations error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};





export const ownerTransactions = async (req, res) => {
  try {
    let stationIds = req.query.stationIds;
    if (!stationIds) {
      return res.status(400).json({ msg: "No station IDs provided" });
    }
    if (!Array.isArray(stationIds)) {
      stationIds = [stationIds];
    }

    const stocks = await FuelStock.find({ _id: { $in: stationIds } });
   const seen = new Set();
    const pairs = [];
    for (const stock of stocks) {
      const key = `${stock.stationName}|${stock.city}`;
      if (!seen.has(key)) {
        seen.add(key);
        pairs.push({ stationName: stock.stationName, city: stock.city });
      }
    }

    // 3. Query FuelTransaction for any matching pair
    const transactions = await FuelTransaction.find({ $or: pairs })
      .sort({ createdAt: -1 })
      .populate('driver', 'name')
      .populate('farmer', 'fullName');

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ msg: "No transactions for these stations" });
    }

    res.json(transactions);
  } catch (err) {
    console.error("ownerTransactions error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};



// 🔹 Reports with filters
export const ownerReports = async (req, res) => {
  try {
    let stationIds = req.query.stationIds;
    if (!stationIds) {
      return res.status(400).json({ msg: "No station IDs provided" });
    }
    if (!Array.isArray(stationIds)) {
      stationIds = [stationIds];
    }

    // Get all stocks for these stationIds
    const stocks = await FuelStock.find({ _id: { $in: stationIds } });
    const seen = new Set();
    const pairs = [];
    for (const stock of stocks) {
      const key = `${stock.stationName}|${stock.city}`;
      if (!seen.has(key)) {
        seen.add(key);
        pairs.push({ stationName: stock.stationName, city: stock.city });
      }
    }

    // Date range filter
    const { type } = req.query; // daily, weekly, monthly, yearly
    let startDate = new Date();
    switch (type) {
      case "daily":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "weekly":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "yearly":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // all time
    }

    // Query transactions matching any pair and date range
    const transactions = await FuelTransaction.find({
      $and: [
        { $or: pairs },
        { date: { $gte: startDate } }
      ]
    })
      .sort({ date: -1 })
      .populate('driver', 'name')
      .populate('farmer', 'fullName');

    const totalLiters = transactions.reduce((sum, t) => sum + (t.liters || 0), 0);

    res.json({ transactions, totalLiters });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

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