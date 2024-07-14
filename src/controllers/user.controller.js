// import { request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

// const registerUser = asyncHandler(async (req, res) => {
//   res.status(200).json({
//     message: "Ok",
//   });
// });

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
