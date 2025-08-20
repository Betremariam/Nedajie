import FuelStock from '../models/FuelStock.js';
import FuelTransaction from '../models/FuelTransaction.js';
import Driver from '../models/Driver.js';


export async function addFuelStock(req, res) {
  try {
    const { gasType, quantity } = req.body;
    const newStock = new FuelStock({ gasType, quantity });
    await newStock.save();
    res.status(201).json({ message: 'Fuel stock recorded', stock: newStock });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add fuel stock', error });
  }
}


export async function getFuelStocks(req, res) {
  try {
    const stocks = await FuelStock.find().sort({ createdAt: -1 });
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch fuel stock records', error });
  }
}


export async function getFuelLeftForDriver(req, res) {
  try {
    const driverId = req.params.driverId;

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Daily limits
    const limits = {
      bajaj: 10,
      taxi: 40,
      heavy: 100,
    };

    const carType = driver.carType.toLowerCase();
    const dailyLimit = limits[carType] || 0;

    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const transactionsToday = await FuelTransaction.aggregate([
      {
        $match: {
          driverId: driver._id,
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          totalTaken: { $sum: '$liters' },
        },
      },
    ]);

    const taken = transactionsToday.length > 0 ? transactionsToday[0].totalTaken : 0;
    const fuelLeft = Math.max(dailyLimit - taken, 0);

    res.status(200).json({ fuelLeft });
  } catch (error) {
    console.error('Fuel Left Error:', error);
    res.status(500).json({ message: 'Error calculating fuel left', error });
  }
}
