import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "invalid user token!!!!");
    }

    /* `req.user = user;` is setting the `user` object retrieved from the database to the `user` property
    of the `req` object. This allows the user information to be accessed and used in subsequent
    middleware functions or routes within the request handling process. By attaching the `user` object
    to the `req` object, it makes the user data easily accessible throughout the request lifecycle. */
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid user token");
  }
});
