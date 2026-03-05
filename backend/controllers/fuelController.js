import prisma from '../lib/prisma.js';

export async function addFuelStock(req, res) {
  try {
    const { gasType, quantity, stationName, city } = req.body;
    const newStock = await prisma.fuelStock.create({
      data: {
        gasType,
        litersReceived: quantity,
        stationName, // Added stationName and city as they are required in Prisma schema
        city,
      },
    });
    res.status(201).json({ message: 'Fuel stock recorded', stock: newStock });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add fuel stock', error: error.message });
  }
}

export async function getFuelStocks(req, res) {
  try {
    const stocks = await prisma.fuelStock.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch fuel stock records', error: error.message });
  }
}

export async function getFuelLeftForDriver(req, res) {
  try {
    const driverId = req.params.driverId;

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    });
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

    const result = await prisma.fuelTransaction.aggregate({
      where: {
        driverId: driver.id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _sum: {
        liters: true,
      },
    });

    const taken = result._sum.liters || 0;
    const fuelLeft = Math.max(dailyLimit - taken, 0);

    res.status(200).json({ fuelLeft });
  } catch (error) {
    console.error('Fuel Left Error:', error);
    res.status(500).json({ message: 'Error calculating fuel left', error: error.message });
  }
}
