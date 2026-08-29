const Membership = require("../models/Membership");

// GET /api/memberships
async function listMemberships(req, res, next) {
  try {
    const memberships = await Membership.find({ owner: req.user.id }).sort({ dueDate: 1 });
    return res.status(200).json({ memberships });
  } catch (err) {
    return next(err);
  }
}

// POST /api/memberships
async function createMembership(req, res, next) {
  try {
    const { title, description, dueDate, isCompleted } = req.body;

    const membership = await Membership.create({
      title,
      description,
      dueDate,
      isCompleted: Boolean(isCompleted),
      owner: req.user.id,
    });

    return res.status(201).json({ membership });
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/memberships/:id
async function updateMembership(req, res, next) {
  try {
    const { id } = req.params;
    const updates = {};

    ["title", "description", "dueDate", "isCompleted"].forEach((field) => {
      if (field in req.body) updates[field] = req.body[field];
    });

    const membership = await Membership.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!membership) {
      return res.status(404).json({ message: "Membership record not found" });
    }

    return res.status(200).json({ membership });
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/memberships/:id
async function deleteMembership(req, res, next) {
  try {
    const { id } = req.params;
    const membership = await Membership.findOneAndDelete({ _id: id, owner: req.user.id });

    if (!membership) {
      return res.status(404).json({ message: "Membership record not found" });
    }

    return res.status(200).json({ message: "Deleted", id });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listMemberships, createMembership, updateMembership, deleteMembership };
