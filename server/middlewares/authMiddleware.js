import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const protectCompany = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.token) {
    token = req.headers.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const company = await prisma.company.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!company) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, company not found.",
      });
    }

    req.company = company;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed." });
  }
};
