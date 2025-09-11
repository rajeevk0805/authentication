import express from "express";

import {
  addAddress,
  createUser,
  deleteAddress,
  forgotPassword,
  getAddressById,
  getAllAddress,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  updateAddress,
  updateUser,
  updateUserPassword,
  userResetPassword,
} from "../controllers/userController.js";
import { isAuthenticatedUser } from "../middlewares/adminAuth.js";

const router = express.Router();

router.route("/createuser").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/getalluser").get(isAuthenticatedUser, getAllUsers);
router.route("/getuserbyid/:id").get(getUserById);
router.route("/updateuser/:id").put(updateUser);

router.route("/forgotpassword/:id").post(forgotPassword);
router.route("/resetpassword/:token").post(userResetPassword);
router.route("/updatepassword/:id").post(updateUserPassword);

router.route("/useraddress").post(addAddress);
router.route("/getalladdress").get(getAllAddress);
router.route("/getaddressbyid/:id").get(getAddressById);
router.route("/updateaddress/:id").put(updateAddress);
router.route("/deleteaddress/:id").delete(deleteAddress);

export default router;
