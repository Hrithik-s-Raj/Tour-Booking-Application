import express from "express";
import {
  addVideo,
  addView,
  deleteVideo,
  getBytag,
  getVideo,
  random,
  search,
  subscribe,
  trends,
  updateVideo,
} from "../controllers/videoController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

//create a video
router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.get("/view/:id", addView);
router.get("/trend", trends);
router.get("/random", random);
router.get("/sub", verifyToken, subscribe);
router.get("/tags", getBytag);
router.get("/search", search);

export default router;
