import mongoose, { connect } from "mongoose";

import { DB_NAME } from "../constants.js";

// mongoose.connect("mongodb://localhost/myDatabase", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );

    console.log(
      `\n mongodb Connected to !! DB HOST :: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(" mongodb connection/authentication failed: ", error);
    process.exit(1);
  }
};

export default connectDB;
