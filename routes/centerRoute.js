import express from "express";
import {
  center,
  deleteCenter,
  getAllCenters,
  getSingleCenter,
  updateCenter,
} from "../controllers/centerController.js";

const router = express.Router();
//center
router.route("/addcenter").post(center);
router.route("/getallcenter").get(getAllCenters);
router.route("/getcenterbyid/:id").get(getSingleCenter);
router.route("/updatecenter/:id").put(updateCenter);
router.route("/deletecenter/:id").delete(deleteCenter);

export default router;
