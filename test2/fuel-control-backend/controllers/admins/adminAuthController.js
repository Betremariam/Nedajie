import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.js"; 

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.SUPER_ADMIN_EMAIL &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { role: "super" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      admin: {
        name: "Super Admin",
        email: process.env.SUPER_ADMIN_EMAIL,
        role: "super",
      },
    });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    // ✅ Build JWT payload
    const payload = { id: admin._id, role: admin.role };

if (admin.role === "stationOwner" && admin.stationIds?.length > 0) {
  payload.stationIds = admin.stationIds.map(id => id.toString());
}

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

res.json({
  token,
  admin: {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    stationIds: admin.stationIds && admin.stationIds.length > 0
      ? admin.stationIds.map(id => id.toString())
      : [],
  },
});


    res.json(response);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
