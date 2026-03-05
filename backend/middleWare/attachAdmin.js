import prisma from "../lib/prisma.js";

const attachAdmin = async (req, res, next) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
    });
    if (!admin) {
      return res.status(401).json({ msg: "Admin not found" });
    }
    req.admin = admin;
    next();
  } catch (err) {
    console.error("Error attaching admin:", err);
    res.status(500).json({ msg: "Server error attaching admin" });
  }
};

export default attachAdmin;
