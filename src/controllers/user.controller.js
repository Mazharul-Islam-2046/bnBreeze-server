import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {userService} from "../services/user.service.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    maxAge: process.env.ACCESS_TOKEN_EXPIRY
};

/**
 * desc    Register user
 * route   POST /api/v1/users/auth/register
 * access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { email, password, name, phone } = req.body;

    // Check if all required fields are present
    if (!email || !password || !name || !phone) {
        throw new ApiError(400, "All fields are required");
    }

    const createdUser = await userService.registerUserService(req.body);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = createdUser;
    

    return res
        .status(201)
        .json(new ApiResponse(201, userWithoutPassword, "User registered successfully"));
});

/**
 * desc    Login user
 * route   POST /api/v1/users/auth/login
 * access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const { user, accessToken, refreshToken } = await userService.loginUserService({ email, password });

    // Update last login
    await user.updateLastLogin();

    return res
        .status(200)
        .cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        status: user.status,
                        phone: user.phone,
                        profileImage: user.profileImage
                    },
                    accessToken,
                    refreshToken
                },
                "Login successful"
            )
        );
});

/**
 * desc    Update user
 * route   PUT /api/v1/users/profile
 * access  Private
 */
const updateUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { name, phone, profileImage } = req.body;

    // Only allow certain fields to be updated
    const allowedUpdates = {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(profileImage && { profileImage })
    };

    // Model validation will handle:
    // - Phone number format
    const updatedUser = await userService.updateUserService(userId, allowedUpdates);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

/**
 * desc    Logout user
 * route   POST /api/v1/users/auth/logout
 * access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
    await userService.logoutUserService(req.user._id);

    return res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .status(200)
        .json(new ApiResponse(200, null, "Logged out successfully"));
});

/**
 * desc    Get all users with filters and pagination
 * route   GET /api/v1/users
 * access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        role,
        status,
        search
    } = req.query;

    const filters = {
        ...(role && { role }),
        ...(status && { status }),
        ...(search && {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        })
    };

    const { users, total, totalPages } = await userService.getAllUsersService(
        parseInt(page),
        parseInt(limit),
        filters
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    users,
                    pagination: {
                        total,
                        totalPages,
                        currentPage: parseInt(page),
                        limit: parseInt(limit)
                    }
                },
                "Users retrieved successfully"
            )
        );
});

/**
 * desc    Get user by id with populated bookings/listings
 * route   GET /api/v1/users/:id
 * access  Private
 */
const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { includeBookings, includeListings } = req.query;

    let populateOptions = [];
    if (includeBookings) populateOptions.push("myBookings");
    if (includeListings) populateOptions.push("myListings");

    const user = await userService.getUserByIdService(id, populateOptions);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User retrieved successfully"));
});



/**
 * desc    Get user by email
 * route   GET /api/v1/users/email/:email
 * access  Private
 * */
const getUserByEmail = asyncHandler(async (req, res) => {
    const { email } = req.params;
    const user = await userService.getUserByEmailService(email);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User retrieved successfully"));
});

export {
    registerUser,
    loginUser,
    updateUser,
    logoutUser,
    getAllUsers,
    getUserById,
    getUserByEmail
};