const express = require("express");
const requireAuth = require("../middleware/auth");
const {
  listMemberships,
  createMembership,
  updateMembership,
  deleteMembership,
} = require("../controllers/membershipController");

const router = express.Router();

// Every route below requires a valid Bearer token
router.use(requireAuth);

router.get("/", listMemberships);
router.post("/", createMembership);
router.patch("/:id", updateMembership);
router.delete("/:id", deleteMembership);

module.exports = router;
