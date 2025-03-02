import Property from "../models/property.model.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllPropertiesService = async (page, limit) => {
  const skip = (page - 1) * limit;
  const properties = await Property.find().skip(skip).limit(parseInt(limit));
  const total = await Property.countDocuments();
  const totalPages = Math.ceil(total / limit);
  return { properties, total, totalPages, currentPage: page, limit: parseInt(limit) };
};

export const getPropertyByIdService = async (id) => {
  const property = await Property.findById(id).populate("host", "name email");
  if (!property) {
    throw new ApiError(404, "Property not found");
  }
  return property;
};
