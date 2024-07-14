// import { request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken(); // access token == user
    const refreshToken = user.generateRefreshToken(); // refresh token == db store
    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false,
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong... while generating access and refresh tokens"
    );
  }
};

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

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "Username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  /* This code snippet is checking if there are files attached to the request (`req.files`) and if there
is an array of files under the key `coverImage` in the request files. If these conditions are met,
it assigns the path of the first file in the `coverImage` array to the variable
`coverImageLocalPath`. This is a way to handle the case where there may be multiple files uploaded
with the key `coverImage`, and it ensures that the path of the first file is stored in
`coverImageLocalPath` for further processing. */
  // let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

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

const loginUser = asyncHandler(async (req, res) => {
  /*
  1. request body ==> data
  2. username or email (login on what basis)
  3. find the user
  4. check if password is correct
  5. generate and send jwt token {access and refresh token}
  6. send the jwt token to client ==? send cookies
  7. res ==> successfully logged-in .
  */

  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "Invalid username || email is required");
  }

  const user = await User.findOne({
    $or: [{ username: username, email: email }],
  });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  /* we are using the small case user not the capital User [capital User is a monogoose object] if 
we want to use our own generated methods then we have to use small case user.....
*/

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password ");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User is authenticated and logged in successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("access_token", options)
    .clearCookie("refresh_token", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
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

export { registerUser, loginUser, logOutUser };
