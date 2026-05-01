import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const defaultVehicleTypes = [
  { vehicleType: "bajaj", fuelCapacity: 15, description: "Light Transport (Bajaj)" },
  { vehicleType: "taxi", fuelCapacity: 50, description: "Public Transit (Taxi)" },
  { vehicleType: "car", fuelCapacity: 60, description: "Private Car" },
  { vehicleType: "motorcycle", fuelCapacity: 20, description: "Motorcycle" },
  { vehicleType: "bus", fuelCapacity: 200, description: "Bus" },
  { vehicleType: "truck", fuelCapacity: 300, description: "Truck / Freight" },
  { vehicleType: "heavy", fuelCapacity: 500, description: "Heavy Machinery" },
  { vehicleType: "boat", fuelCapacity: 150, description: "Boat / Marine" },
  { vehicleType: "ship", fuelCapacity: 1000, description: "Ship / Large Vessel" },
  { vehicleType: "ambulance", fuelCapacity: 70, description: "Ambulance / Emergency" },
  { vehicleType: "other", fuelCapacity: 50, description: "Other Vehicle" },
];

async function seedVehicleTypes() {
  console.log("Seeding vehicle type configurations...");

  for (const config of defaultVehicleTypes) {
    await prisma.vehicleTypeConfig.upsert({
      where: { vehicleType: config.vehicleType },
      update: {},
      create: config,
    });
    console.log(`✓ ${config.vehicleType}: ${config.fuelCapacity}L`);
  }

  console.log("\n✅ Vehicle type configurations seeded successfully!");
}

seedVehicleTypes()
  .catch((e) => {
    console.error("Error seeding vehicle types:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
