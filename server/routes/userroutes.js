const express = require("express");
const { getUserById, getAllUsers, updateUser, deleteUser } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user by ID (self or admin)
// @access  Private
router.get("/:id", protect, getUserById);

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get("/", protect, authorize(["admin"]), getAllUsers);

// @route   PUT /api/users/:id
// @desc    Update user (profile update)
// @access  Private
router.put("/:id", protect, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete("/:id", protect, authorize(["admin"]), deleteUser);

module.exports = router;
