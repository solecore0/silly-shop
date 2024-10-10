import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  photo: string;
  role: string;
  gender: string;
  dob: Date;
  age: number;
  createdAt: Date;
  updatedAt: Date;
  getJwtTokens: () => string;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
  getRefreshToken: () => string;
  tokenVersion: number;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      maxlength: [30, "Name cannot exceed 30 characters"],
      minlength: [4, "Name should have more than 4 characters"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Email"],
      unique: [true, "Email already exists"],
      validate: [validator.isEmail, "Please Enter Valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
      minlength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
    photo: {
      type: String,
      required: [true, "Please Provide Photo"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please Specify Your Gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please Enter Date of Birth"],
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.virtual("age").get(function () {
  const today = new Date();
  const birthDate = this.dob;
  let age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

userSchema.methods.getJwtTokens = function () {
  const accessToken = jwt.sign({ id: this._id }, process.env.JWT_SECRET ?? "", {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });
  const refreshToken = jwt.sign(
    { id: this._id, tokenVersion: this.tokenVersion },
    process.env.REFRESH_JWT_SECRET ?? "",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
