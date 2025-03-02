import express from "express";
import { getAllProperties, getPropertyById } from "../controllers/property.controller.js";

const propertyRouter = express.Router();

// Route for getting all properties with pagination
propertyRouter.get("/", getAllProperties);

// Route for getting a single property by id
propertyRouter.get("/:id", getPropertyById);

export default propertyRouter;
