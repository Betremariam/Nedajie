import prisma from "../../lib/prisma.js";

export async function approveVehicle(req, res) {
  try {
    const { vehicleId } = req.params;
    const approverId = req.admin.id;

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        isApproved: true,
        approvedById: approverId,
      },
      include: {
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!vehicle) return res.status(404).json({ msg: "Vehicle not found" });

    res.status(200).json({ msg: "Vehicle approved", vehicle });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getUnapprovedVehicles(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    const where = { isApproved: false };
    if (admin.region) where.region = admin.region;

    const vehicles = await prisma.vehicle.findMany({
      where: where,
    });

    const baseUrl = 'http://192.168.43.237:5000';

    const updatedVehicles = vehicles.map(vehicle => ({
      ...vehicle,
      documentUrl: vehicle.documentPath ? `${baseUrl}/${vehicle.documentPath.replace(/\\/g, '/')}` : null
    }));

    res.status(200).json(updatedVehicles);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function rejectVehicle(req, res) {
  try {
    const { vehicleId } = req.params;
    await prisma.vehicle.delete({
      where: { id: vehicleId },
    });
    res.status(200).json({ msg: "Vehicle rejected and deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function approveAttendant(req, res) {
  try {
    const { attendantId } = req.params;
    const attendant = await prisma.fuelAttendant.update({
      where: { id: attendantId },
      data: { isApproved: true },
    });
    if (!attendant) return res.status(404).json({ msg: "Attendant not found" });
    res.json({ msg: "Attendant approved", attendant });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getUnapprovedAttendants(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    const where = { isApproved: false };
    if (admin.region) where.region = admin.region;

    const attendants = await prisma.fuelAttendant.findMany({
      where: where,
    });

    const baseUrl = 'http://192.168.43.237:5000';

    const updatedAttendants = attendants.map(attendant => ({
      ...attendant,
      documentUrl: attendant.documentPath ? `${baseUrl}/${attendant.documentPath.replace(/\\/g, '/')}` : null
    }));

    res.status(200).json(updatedAttendants);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function rejectAttendant(req, res) {
  try {
    const { attendantId } = req.params;
    await prisma.fuelAttendant.delete({
      where: { id: attendantId },
    });
    res.json({ msg: "Attendant rejected and deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function approveFarmer(req, res) {
  try {
    const { farmerId } = req.params;
    const approverId = req.admin.id;
    const farmer = await prisma.farmer.update({
      where: { id: farmerId },
      data: {
        isApproved: true,
        approvedById: approverId,
      },
      include: {
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!farmer) return res.status(404).json({ msg: "Farmer not found" });
    res.status(200).json({ msg: "Farmer approved", farmer });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getUnapprovedFarmers(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    const where = { isApproved: false };
    if (admin.region) where.region = admin.region;

    const farmers = await prisma.farmer.findMany({
      where: where,
    });

    const baseUrl = 'http://192.168.43.237:5000';

    const updatedFarmers = farmers.map(farmer => ({
      ...farmer,
      documentUrl: farmer.documentPath
        ? `${baseUrl}/${farmer.documentPath.replace(/\\/g, '/')}`
        : null
    }));

    res.status(200).json(updatedFarmers);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function rejectFarmer(req, res) {
  try {
    const { farmerId } = req.params;
    await prisma.farmer.delete({
      where: { id: farmerId },
    });
    res.status(200).json({ msg: "Farmer rejected and deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function approveOthers(req, res) {
  try {
    const { otherId } = req.params;
    const approverId = req.admin.id;
    const other = await prisma.otherUser.update({
      where: { id: otherId },
      data: {
        isApproved: true,
        approvedById: approverId,
      },
      include: {
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!other) return res.status(404).json({ msg: "other not found" });
    res.status(200).json({ msg: "Farmer approved", other });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export const rejectOther = async (req, res) => {
  try {
    const { otherId } = req.params;
    await prisma.otherUser.delete({
      where: { id: otherId },
    });
    res.status(200).json({ msg: "Other user rejected and deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const getUnapprovedOthers = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    const where = { isApproved: false };
    if (admin.region) where.region = admin.region;

    const unapproved = await prisma.otherUser.findMany({
      where: where,
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(unapproved);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
