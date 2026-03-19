import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Federal admin - env-based credentials
  if (
    email === process.env.FEDERAL_EMAIL &&
    password === process.env.FEDERAL_PASSWORD
  ) {
    try {
      const federalUser = await prisma.admin.findUnique({ where: { email } });
      const payload = { role: "federal" };
      if (federalUser) payload.id = federalUser.id;

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      console.log("Federal login successful via ENV");

      return res.json({
        token,
        admin: {
          id: federalUser?.id,
          name: federalUser?.name || "Federal Admin",
          email: process.env.FEDERAL_EMAIL,
          role: "federal",
        },
        mustChangePassword: false,
      });
    } catch (err) {
      console.error("Federal login lookup error:", err);
      // Fallback if DB lookup fails but credentials match
      const token = jwt.sign({ role: "federal" }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({
        token,
        admin: { name: "Federal Admin", email, role: "federal" },
        mustChangePassword: false
      });
    }
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    // Check if account is blocked
    if (admin.isBlocked) {
      return res.status(403).json({ msg: "Your account has been blocked. Please contact the Super Admin." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    // Build JWT payload
    const payload = { id: admin.id, role: admin.role };
    if (admin.role === "stationOwner" && admin.stationIds?.length > 0) {
      payload.stationIds = admin.stationIds;
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        stationIds: admin.stationIds || [],
      },
      mustChangePassword: admin.mustChangePassword,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.user?.id;

  if (!adminId) return res.status(401).json({ msg: "Unauthorized" });
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: "Both current and new passwords are required." });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ msg: "New password must be at least 6 characters." });
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(401).json({ msg: "Current password is incorrect." });

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashed, mustChangePassword: false },
    });

    res.json({ msg: "Password changed successfully. You can now access your dashboard." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
