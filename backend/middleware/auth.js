import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { isValidGmail, normalizeGmail } from "../utils/validation.js";

let developmentSecret;

const getJwtSecret = () => {
  const configuredSecret = process.env.JWT_SECRET;
  if (configuredSecret) {
    if (Buffer.byteLength(configuredSecret, "utf8") < 32) {
      throw new Error("JWT_SECRET must contain at least 32 bytes");
    }
    return configuredSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }

  developmentSecret ??= randomBytes(32).toString("hex");
  return developmentSecret;
};

const getAdminEmails = () => {
  const emails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (!emails.every(isValidGmail)) {
    throw new Error("ADMIN_EMAILS must contain valid email addresses");
  }

  return emails.map(normalizeGmail);
};

export const validateAuthConfig = () => {
  getJwtSecret();
  const adminEmails = getAdminEmails();
  if (process.env.NODE_ENV === "production" && adminEmails.length === 0) {
    throw new Error("ADMIN_EMAILS must include at least one administrator in production");
  }
};

export const createAccessToken = (user) => {
  const role = getAdminEmails().includes(normalizeGmail(user.gmail)) ? "admin" : "user";
  return jwt.sign(
    { role },
    getJwtSecret(),
    {
      algorithm: "HS256",
      expiresIn: "15m",
      subject: String(user.id),
    },
  );
};

export const authenticate = (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const [scheme, token, extra] = authorization.trim().split(/\s+/);
  if (scheme?.toLowerCase() !== "bearer" || !token || extra) {
    return res.status(401).json({ message: "Se requiere una sesion valida" });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      !["admin", "user"].includes(payload.role)
    ) {
      return res.status(401).json({ message: "La sesion no es valida" });
    }

    req.auth = { userId: payload.sub, role: payload.role };
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "La sesion ha expirado" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "La sesion no es valida" });
    }
    return next(error);
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.auth?.role !== "admin") {
    return res.status(403).json({ message: "Se requieren permisos de administrador" });
  }

  return next();
};
