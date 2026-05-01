-- CreateTable
CREATE TABLE IF NOT EXISTS "VehicleTypeConfig" (
    "id" TEXT NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,
    "fuelCapacity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleTypeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "VehicleTypeConfig_vehicleType_key" ON "VehicleTypeConfig"("vehicleType");
