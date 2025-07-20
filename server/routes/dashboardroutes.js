const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  studentDashboard,
  teacherDashboard,
  parentDashboard,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/student", protect, authorize(["student"]), studentDashboard);
router.get("/teacher", protect, authorize(["developer", "admin"]), teacherDashboard);
router.get("/parent", protect, authorize(["parent"]), parentDashboard);

module.exports = router;
