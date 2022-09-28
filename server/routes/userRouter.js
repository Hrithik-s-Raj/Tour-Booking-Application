import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  deleteUser,
  dislike,
  getUser,
  like,
  subscribe,
  unsubscribe,
  update,
} from "../controllers/userController.js";

const router = express.Router();

//update user

router.put("/:id", verifyToken, update);

//delete user
router.delete("/:id", verifyToken, deleteUser);

//get a user

router.get("/find/:id", verifyToken, getUser);

//subscribe a user

router.put("/sub/:id", verifyToken, subscribe);

//unsubscribe a user

router.put("/unsub/:id", verifyToken, unsubscribe);

//like a video
router.put("/like/:videoId", verifyToken, like);

//dislike a video

router.put("/dislike/:videoId", verifyToken, dislike);
export default router;
