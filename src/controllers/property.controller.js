import { asyncHandler } from "../utils/asyncHandler.js";
import { getAllPropertiesService, getPropertyByIdService } from "../services/property.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET /api/v1/properties
export const getAllProperties = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await getAllPropertiesService(parseInt(page), parseInt(limit));
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Properties retrieved successfully"));
});

// GET /api/v1/properties/:id
export const getPropertyById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const property = await getPropertyByIdService(id);
  return res
    .status(200)
    .json(new ApiResponse(200, property, "Property retrieved successfully"));
});
