import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";




const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"],
    },
    isGoogleSignIn: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [function () { return !this.isGoogleSignIn; }, "Password is required for email/password sign-in"],
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character"
      ],
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["host", "guest", "admin"],
      default: "guest",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "active",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
      match: [
        /^(\+88)?(01)[0-9]{9}$/,
        "Please enter a valid phone number",
      ],
    },
    profileImage: {
        type: String,
        default: function () {
          // Generates a random number between 1 and 70
          const randomNumber = Math.floor(Math.random() * 70) + 1;
          return `https://i.pravatar.cc/150?img=${randomNumber}`;
        },
      },
  },
  { timestamps: true }
);

// virtuals
// myBookings virtual
userSchema.virtual("myBookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "guest",
});

// myListings virtual
userSchema.virtual("myListings", {
  ref: "Property",
  localField: "_id",
  foreignField: "host",
});

// set virtuals to true
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });




// methods

// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


//compare password 
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate tokens

// generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};


// generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};


// update last login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return await this.save();
};


export const User = mongoose.model("User", userSchema);
