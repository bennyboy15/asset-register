import express from "express";
import { getAssets, deleteAsset, getSpecificAsset, createAsset, updateAsset } from "../controllers/assets.controller.js";

const router = express.Router();

// GET
router.get("/", getAssets);
router.get("/:id", getSpecificAsset);

// POST
router.post("/", createAsset);

// PUT
router.put("/:id", updateAsset);

// DELETE
router.delete("/:id", deleteAsset);

export default router;