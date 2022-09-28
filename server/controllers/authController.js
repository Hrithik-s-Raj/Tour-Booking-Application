import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../errors.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(200).json({
      status: "Success",
      data: {
        message: "New user has been Created",
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ name: req.body.name });

    if (!user)
      return next(createError(404, "UserName or Password is Incorrect"));
    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect)
      return next(createError(404, "UserName or Password is Incorrect"));

    //jwt

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password, ...others } = user;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        status: "Success",
        data: {
          user,
        },
      });
  } catch (err) {
    console.log(err);
  }
};
