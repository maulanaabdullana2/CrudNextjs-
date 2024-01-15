const imagekit = require("../lib/imagekit");
const Cars = require("../models/carsModels");
const ApiError = require("../utils/ApiError");

const createCar = async (req, res, next) => {
  try {
    const { name, merek, year } = req.body;
    const file = req.file;
    let imageUrl;

    if (file) {
      const img = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });
      imageUrl = img.url;
    }

    const userId = req.user.id;
    const car = await Cars.create({
      name,
      merek,
      year,
      imageUrl,
      ownerId: userId,
    });

    res.status(201).json({
      status: "success",
      message: "Berhasil Mendapatkan Data",
      data: {
        car,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, merek, year } = req.body;
    const userId = req.user.id;

    const existingCar = await Cars.findOne({ _id: id, ownerId: userId });

    if (!existingCar) {
      return res.status(404).json({
        status: "failed",
        message: "Mobil tidak ditemukan",
      });
    }

    let imageUrl = existingCar.imageUrl;
    const file = req.file;

    if (file) {
      const img = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });
      imageUrl = img.url;
    }

    const updatedCar = await Cars.findByIdAndUpdate(
      id,
      { name, merek, year, imageUrl },
      { new: true },
    );

    res.status(200).json({
      status: "success",
      message: "Edit Berhasil",
      data: {
        car: updatedCar,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getCarById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const car = await Cars.findOne({ _id: id, ownerId: userId });

    if (!car) {
      return res.status(404).json({
        status: "failed",
        message: "Data tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data Berhasil Didapatkan",
      data: {
        car,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const removeCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedCar = await Cars.findOneAndDelete({
      _id: id,
      ownerId: userId,
    });

    if (!deletedCar) {
      return res.status(404).json({
        status: "failed",
        message: "Data tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data berhasil dihapus",
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getCars = async (req, res, next) => {
  try {
    const { page, limit, merek } = req.query;
    const userId = req.user.id;

    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 3;

    const skip = (pageNumber - 1) * pageSize;
    let filter = {ownerId:userId}
     if (merek) {
       filter.merek = { $regex: merek, $options: "i" };
     }

    const cars = await Cars.find(filter)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      status: "success",
      message: "Data Berhasil Ditemukan",
      data: {
        cars,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};


module.exports = {
  createCar,
  updateCar,
  getCarById,
  removeCar,
  getCars,
};
