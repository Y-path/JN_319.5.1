import express from "express";
import Grade from '../models/grade.mjs';

const router = express.Router();

// Create a single grade entry
router.post("/", async (req, res) => {
  let newDocument = req.body;

  // rename fields for backwards compatibility
  if (newDocument.student_id) {
    newDocument.learner_id = newDocument.student_id;
    delete newDocument.student_id;
  }

  try {
    const grade = new Grade(newDocument);
    await grade.save();
    res.status(201).send(grade);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get a single grade entry
router.get("/:id", async (req, res) => {
  const grade = await Grade.findById(req.params.id);
  if (!grade) {
    res.status(404).send("Not found");
  } else {
    res.status(200).send(grade);
  }
});

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
  const grade = await Grade.findByIdAndUpdate(
    req.params.id,
    { $push: { scores: req.body } },
    { new: true }
  );
  if (!grade) {
    res.status(404).send("Not found");
  } else {
    res.status(200).send(grade);
  }
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {
  const grade = await Grade.findByIdAndUpdate(
    req.params.id,
    { $pull: { scores: req.body } },
    { new: true }
  );
  if (!grade) {
    res.status(404).send("Not found");
  } else {
    res.status(200).send(grade);
  }
});

// Delete a single grade entry
router.delete("/:id", async (req, res) => {
  const result = await Grade.findByIdAndDelete(req.params.id);
  if (!result) {
    res.status(404).send("Not found");
  } else {
    res.status(200).send(result);
  }
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  const query = { learner_id: Number(req.params.id) };

  // Check for class_id parameter
  if (req.query.class) query.class_id = Number(req.query.class);
  const grades = await Grade.find(query);
  if (grades.length === 0) {
    res.status(404).send("Not found");
  } else {
    res.status(200).send(grades);
  }
});

// Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
  const result = await Grade.deleteOne({ learner_id: Number(req.params.id) });
  if (!result.deletedCount) {
    res.status(404).send("Not found");
  } else {
    res.status(200).send(result);
  }
});

// Get a class's grade data
router.get("/class/:id", async (req, res) => {
  const query = { class_id: Number(req.params.id) };

  // Check for learner_id parameter
  if (req.query.learner) query.learner_id = Number(req.query.learner);
  const grades = await Grade.find(query);
  if (grades.length === 0) {
    return res.status(404).send("Not found");
  } else {
    res.status(200).send(grades);
  }
});

// Update a class id
router.patch("/class/:id", async (req, res) => {
  const result = await Grade.updateMany(
    { class_id: Number(req.params.id) },
    { $set: { class_id: req.body.class_id } }
  );
  if (result.modifiedCount === 0) {
    return res.status(404).send("Not found");
  } else {
    res.status(200).send(result);
  }
});

// Delete a class
router.delete("/class/:id", async (req, res) => {
  const result = await Grade.deleteMany({ class_id: Number(req.params.id) });
  if (result.deletedCount === 0) {
    return res.status(404).send("Not found");
  } else {
    res.status(200).send(result);
  }
});

export default router;
