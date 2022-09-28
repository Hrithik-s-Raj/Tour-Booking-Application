import { createError } from "../errors.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json({
      status: "Success",
      data: {
        savedVideo,
      },
    });
  } catch (err) {
    next(err);
  }
};
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video Not Found"));
    if (req.user.id === video.userId) {
      const updatedUser = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        status: "Success",
        data: {
          updatedUser,
        },
      });
    } else {
      return next(createError(403, "You can update only your Video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not Found"));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
    }
    res.status(200).json({
      status: "Success",
      message: "Video has been Deleted",
    });
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json({
      sttatus: "Success",
      data: {
        video,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json({
      status: "Success",
      message: "View has been incremented",
    });
  } catch (err) {
    next(err);
  }
};

export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json({
      status: "Success",
      data: {
        videos,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const trends = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json({
      status: "Success",
      data: {
        videos,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subcribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subcribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

export const getBytag = async (req, res, next) => {
  // gonna use express query over here

  const tags = req.query.tags.split(",");
  console.log(tags);

  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json({
      status: "Success",
      data: {
        videos,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json({
      status: "Success",
      data: {
        videos,
      },
    });
  } catch (err) {
    next(err);
  }
};
