// import { request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "Ok",
  // });
  // get user details from frontend
  // validations - not empty
  // check if user is already registered/exists :- username and email
  // check for images, check for avatar images
  // upload them cloudinary , avatar check
  // create user object - create entry in db
  // remove refresh token and pass from response
  // check for user creation
  // return respo or send error
  //

  // console.log("username::", username);

  /*
  if (fullName === "") {
    throw new ApiError(400, "Fullname is required");
  }
  */

  /*
  const fields = [fullName, username, email, password].map((field) =>
    field?.trim()
  );

  if (fields.every((field) => field !== "")) {
  } else {
    throw new ApiError(400, "All fields are required");
  }
    */
  const { username, email, fullName, password } = req.body;

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "Username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar not found/ Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, " Avatar not found / file is required");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating a new user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));

  /*const symbols = "@";
  if (!email.includes(symbols)) {
    throw new ApiError(400, "Invalid email address");
  }
  */
});

/*
express.get("/", (req, res, next) => {
  foo
    .findAll()
    .then((bar) => {
      res.send(bar);
    })
    .catch(next); // error passed on to the error handling route
});
*/

/*

const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};
*/

export { registerUser };
