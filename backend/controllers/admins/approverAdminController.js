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

export async function approveMillHouseOwner(req, res) {
  try {
    const { ownerId } = req.params;
    const approverId = req.admin.id;

    const owner = await prisma.millHouseOwner.update({
      where: { id: ownerId },
      data: {
        isApproved: true,
        approvedById: approverId,
      },
      include: {
        approvedBy: {
          select: { name: true, email: true },
        },
      },
    });

    if (!owner) return res.status(404).json({ msg: "Mill House Owner not found" });

    res.status(200).json({ msg: "Mill House Owner approved", owner });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getUnapprovedMillHouseOwners(req, res) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    const where = { isApproved: false };
    if (admin.region) where.region = admin.region;

    const owners = await prisma.millHouseOwner.findMany({
      where: where,
      orderBy: { createdAt: "desc" },
    });

    const baseUrl = 'http://192.168.43.237:5000';

    const updatedOwners = owners.map(owner => ({
      ...owner,
      documentUrl: owner.documentPath ? `${baseUrl}/${owner.documentPath.replace(/\\/g, '/')}` : null
    }));

    res.status(200).json(updatedOwners);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function rejectMillHouseOwner(req, res) {
  try {
    const { ownerId } = req.params;
    await prisma.millHouseOwner.delete({
      where: { id: ownerId },
    });
    res.status(200).json({ msg: "Mill House Owner rejected and deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getApproverDashboardStats(req, res) {
  try {
    const adminId = req.admin.id;
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });

    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const where = { isApproved: false };
    if (admin.region) where.region = admin.region;

    const [
      pendingVehicles,
      pendingFarmers,
      pendingAttendants,
      pendingOthers,
      pendingMillOwners,
    ] = await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.farmer.count({ where }),
      prisma.fuelAttendant.count({ where }),
      prisma.otherUser.count({ where }),
      prisma.millHouseOwner.count({ where }),
    ]);

    // Fetch recent decisions (approvals)
    // We'll collect the last few from each category and sort them centrally
    const recentWhere = { isApproved: true };
    if (admin.region) recentWhere.region = admin.region;

    const [
      recentVehicles,
      recentFarmers,
      recentAttendants,
      recentOthers,
      recentMillOwners,
    ] = await Promise.all([
      prisma.vehicle.findMany({ where: recentWhere, take: 5, orderBy: { updatedAt: 'desc' } }),
      prisma.farmer.findMany({ where: recentWhere, take: 5, orderBy: { updatedAt: 'desc' } }),
      prisma.fuelAttendant.findMany({ where: recentWhere, take: 5, orderBy: { updatedAt: 'desc' } }),
      prisma.otherUser.findMany({ where: recentWhere, take: 5, orderBy: { updatedAt: 'desc' } }),
      prisma.millHouseOwner.findMany({ where: recentWhere, take: 5, orderBy: { updatedAt: 'desc' } }),
    ]);

    const allRecent = [
      ...recentVehicles.map(v => ({ name: v.ownerName, type: "Vehicle", time: v.updatedAt })),
      ...recentFarmers.map(f => ({ name: f.fullName, type: "Farmer", time: f.updatedAt })),
      ...recentAttendants.map(a => ({ name: a.name, type: "Attendant", time: a.updatedAt })),
      ...recentOthers.map(o => ({ name: o.fullName, type: "Other", time: o.updatedAt })),
      ...recentMillOwners.map(m => ({ name: m.fullName, type: "Mill Owner", time: m.updatedAt })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    res.status(200).json({
      counts: {
        vehicles: pendingVehicles,
        farmers: pendingFarmers,
        attendants: pendingAttendants,
        others: pendingOthers,
        millOwners: pendingMillOwners,
        total: pendingVehicles + pendingFarmers + pendingAttendants + pendingOthers + pendingMillOwners
      },
      recentDecisions: allRecent
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}
