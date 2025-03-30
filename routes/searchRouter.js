import express from "express";
import { getSearchResults } from "../controllers/searchControllers.js";

const router = express.Router();

// Define the search route
router.get("/", getSearchResults);

export { router as searchRouter };
