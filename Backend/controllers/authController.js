const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/UserModels");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email
    });
    if (!user) {
      return next(new ApiError("Email address not registered", 404));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next(new ApiError("Sorry, wrong password", 400));

    const payload = {
      _id: user._id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET|| 'aaaaaa', {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESHTOKEN_SECRET|| 'aaaaaa', {
      expiresIn: "1h",
    });

    user.refreshToken = refreshToken;
    await user.save();
    const data = {
      accessToken: accessToken,
    };
    res.cookie("refreshToken", refreshToken);
    res.status(200).json({
      status:"Success",
      message:"Login Berhasil",
      data
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};


const loginWithgoogle = async (req, res, next) => {
  try {
    const { email, imageProfile } = req.body;
    let loginUser = await User.findOne({ email });

    if (!loginUser) {
      loginUser = await User.create({
        email,
        imageProfile,
        name: email.split("@")[0],
      });
    }

    const payload = {
      _id: loginUser._id,
      email: loginUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "aaaaaa", {
      expiresIn: "3d",
    });

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESHTOKEN_SECRET || "aaaaaa",
      {
        expiresIn: "3d",
      },
    );

    if (loginUser) {
      loginUser.refreshToken = refreshToken;
      await loginUser.save();
    }

    res.cookie("refreshToken", refreshToken);

    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};
const register = async (req, res, next) => {
  try {
    const { name, email, address ,password } = req.body;

    const existingemail = await User.findOne({ email });

    if (existingemail) {
      return res.status(400).json({
        status: "Error",
        message: "Email already in use",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const users = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
    });
    res.status(200).json({
      status: "Success",
      data: {
        users,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const currentuser = async (req, res, next) => {
  try {
    const data = {
      _id: req.user._id,
      email:req.user.email,
      name:req.user.name,
      imageProfile: req.user.imageProfile
    }

    res.status(200).json({
      status: "Success",
      data: {
        user: data
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

module.exports = {
  login,
  register,
  currentuser,
  loginWithgoogle
};
