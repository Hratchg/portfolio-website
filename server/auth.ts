import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { getAdminUser } from "./storage";

// Rate limiter for login endpoint
export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth middleware — rejects unauthenticated requests
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && (req.session as any).isAdmin) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

// Login handler
export async function handleLogin(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const admin = await getAdminUser();
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch || admin.username !== username) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  (req.session as any).isAdmin = true;
  return res.status(200).json({ message: "Login successful" });
}

// Logout handler
export async function handleLogout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out" });
  });
}

// Auth status check
export async function handleAuthStatus(req: Request, res: Response) {
  const isAdmin = !!(req.session && (req.session as any).isAdmin);
  return res.status(200).json({ authenticated: isAdmin });
}
