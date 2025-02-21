import { Router } from "express";
import {
    registerUser,
    loginUser,
    updateUser,
    logoutUser,
    getAllUsers,
    getUserById
} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const userRouter = Router();


userRouter.route("/auth/register").post(registerUser);
userRouter.route("/auth/login").post(loginUser);



//secure routes
userRouter.route("/updateUser").put(verifyJWT,updateUser);
userRouter.route("/auth/logout").post(verifyJWT,logoutUser);
userRouter.route("/getAllUsers").get(verifyJWT,getAllUsers);
userRouter.route("/getUserById/:id").get(verifyJWT,getUserById);


export default userRouter;



