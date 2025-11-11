import express from "express";
import { signup, login, logout, getCurrentUser, getUsers } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/users", protectRoute, getUsers);
router.get("/me", protectRoute, getCurrentUser);

export default router;