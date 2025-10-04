import Driver from "../../models/Driver.js";
import FuelAttendant from "../../models/FuelAttendant.js";
import Farmer from "../../models/Farmer.js";
import OtherUser from "../../models/Others.js";


export async function approveDriver(req, res) {
  
  try {
    const { driverId } = req.params;
    const approverId = req.admin._id;

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { isApproved: true, approvedBy: approverId },
      { new: true }
    ).populate("approvedBy", "name email");

    if (!driver) return res.status(404).json({ msg: "Driver not found" });

    res.status(200).json({ msg: "Driver approved", driver });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getUnapprovedDrivers(req, res) {
  try {
    const drivers = await Driver.find({ isApproved: false });

    
    const baseUrl = 'http://192.168.43.237:5000';

    
    const updatedDrivers = drivers.map(driver => ({
      ...driver._doc,
      documentUrl: `${baseUrl}/${driver.documentPath.replace(/\\/g, '/')}`
    }));

    res.status(200).json(updatedDrivers);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

// controllers/approverAdminController.js

export async function rejectDriver(req, res) {
  try {
    const { driverId } = req.params;

    const driver = await Driver.findByIdAndDelete(driverId);

    if (!driver) {
      return res.status(404).json({ msg: "Driver not found" });
    }

    res.status(200).json({ msg: "Driver rejected and deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}


export async function approveAttendant(req, res) {
  try {
    const { attendantId } = req.params;
    const attendant = await FuelAttendant.findByIdAndUpdate(attendantId, { isApproved: true }, { new: true });
    if (!attendant) return res.status(404).json({ msg: "Attendant not found" });
    res.json({ msg: "Attendant approved", attendant });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getUnapprovedAttendants(req, res) {
  try {
    const attendants = await FuelAttendant.find({ isApproved: false });

    // Replace this with your actual backend server IP and port
    const baseUrl = 'http://192.168.43.237:5000';

    // Map each attendant and attach a full document URL
    const updatedAttendants = attendants.map(attendant => ({
      ...attendant._doc,
      documentUrl: `${baseUrl}/${attendant.documentPath.replace(/\\/g, '/')}`
    }));

    res.status(200).json(updatedAttendants);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

// Delete attendant (Reject)
export async function rejectAttendant(req, res) {
  try {
    const { attendantId } = req.params;
    const attendant = await FuelAttendant.findByIdAndDelete(attendantId);
    if (!attendant) return res.status(404).json({ msg: "Attendant not found" });
    res.json({ msg: "Attendant rejected and deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function approveFarmer(req, res) {
  try {
    const { farmerId } = req.params;
    const approverId = req.admin._id;
    const farmer = await Farmer.findByIdAndUpdate(
      farmerId,
     { isApproved: true, approvedBy: approverId },
      { new: true }
    ).populate("approvedBy", "name email");
    if (!farmer) return res.status(404).json({ msg: "Farmer not found" });
    res.status(200).json({ msg: "Farmer approved", farmer });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getUnapprovedFarmers(req, res) {
  try {
    const farmers = await Farmer.find({ isApproved: false });

    const baseUrl = 'http://192.168.43.237:5000';

    const updatedFarmers = farmers.map(farmer => ({
      ...farmer._doc,
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

    const farmer = await Farmer.findByIdAndDelete(farmerId);

    if (!farmer) {
      return res.status(404).json({ msg: "Farmer not found" });
    }

    res.status(200).json({ msg: "Farmer rejected and deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}



export async function approveOthers(req, res) {
  try {
    const { otherId } = req.params;
    const approverId = req.admin._id;
    const other = await OtherUser.findByIdAndUpdate(
      otherId,
     { isApproved: true, approvedBy: approverId },
      { new: true }
    ).populate("approvedBy", "name email");
    if (!other) return res.status(404).json({ msg: "other not found" });
    res.status(200).json({ msg: "Farmer approved", other});
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}


// Reject/delete an "Other" user
export const rejectOther = async (req, res) => {
  try {
    const { otherId } = req.params;

    const other = await OtherUser.findById(otherId);
    if (!other) return res.status(404).json({ msg: "Other user not found" });

    await OtherUser.findByIdAndDelete(otherId);

    res.status(200).json({ msg: "Other user rejected and deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get all unapproved "Other" users
export const getUnapprovedOthers = async (req, res) => {
  try {
    const unapproved = await OtherUser.find({ isApproved: false }).sort({ createdAt: -1 });
    res.status(200).json(unapproved);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};