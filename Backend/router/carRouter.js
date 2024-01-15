const router = require("express").Router();
const car = require("../controllers/carControllers");
const upload = require("../middleware/upload");
const authenticate = require("../middleware/authenticate");

router.post("/add", authenticate ,upload.single("image") ,car.createCar);
router.patch("/edit/:id", authenticate ,upload.single("image"),car.updateCar);
router.get("/:id", authenticate ,car.getCarById);
router.get("/", authenticate, car.getCars);
router.delete("/:id", authenticate ,car.removeCar);

module.exports = router;
