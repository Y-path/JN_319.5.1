import express from "express";
// import db from "../db/conn.mjs";
import Grade from '../models/grade.mjs';


// import { ObjectId } from "mongodb";

const router = express.Router();

// // Create a single grade entry
router.post("/", async (req, res) => {
    let newDocument = req.body;
// router.post("/", async (req, res) => {
//   let collection = await db.collection("grades");
//   let newDocument = req.body;

//   // rename fields for backwards compatibility
if (newDocument.student_id) {
    newDocument.learner_id = newDocument.student_id;
    delete newDocument.student_id;
  }
//   if (newDocument.student_id) {
//     newDocument.learner_id = newDocument.student_id;
//     delete newDocument.student_id;
//   }

try {
    const grade = new Grade(newDocument);
    await grade.save();
    res.status(201).send(grade);
  } catch (error) {
    res.status(400).send(error);
  }
});
//   let result = await collection.insertOne(newDocument);
//   res.send(result).status(204);
// });




// // Get a single grade entry
router.get("/:id", async (req, res) => {
      const grade = await Grade.findById(req.params.id);
      if (!grade) {
        res.status(404).send("Not found");
      } else {
        res.status(200).send(grade);
      }
     });
// router.get("/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { _id: ObjectId(req.params.id) };
//   let result = await collection.findOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Add a score to a grade entry
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
// router.patch("/:id/add", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { _id: ObjectId(req.params.id) };

//   let result = await collection.updateOne(query, {
//     $push: { scores: req.body }
//   });

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Remove a score from a grade entry
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
// router.patch("/:id/remove", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { _id: ObjectId(req.params.id) };

//   let result = await collection.updateOne(query, {
//     $pull: { scores: req.body }
//   });

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Delete a single grade entry
router.delete("/:id", async (req, res) => {
      const result = await Grade.findByIdAndDelete(req.params.id);
      if (!result) {
        res.status(404).send("Not found");
      } else {
        res.status(200).send(result);
      }
  });
// router.delete("/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { _id: ObjectId(req.params.id) };
//   let result = await collection.deleteOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Get route for backwards compatibility

// router.get("/student/:id", async (req, res) => {
//   res.redirect(`learner/${req.params.id}`);
// });

// // Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
    const query = { learner_id: Number(req.params.id) };
// router.get("/learner/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { learner_id: Number(req.params.id) };
  
//   // Check for class_id parameter
if (req.query.class) query.class_id = Number(req.query.class);
    const grades = await Grade.find(query);
    if (grades.length === 0) {
      res.status(404).send("Not found");
    } else {
    res.status(200).send(grades);
   }
});
//   if (req.query.class) query.class_id = Number(req.query.class);

//   let result = await collection.find(query).toArray();

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
      const result = await Grade.deleteOne({ learner_id: Number(req.params.id) });
      if (!result.deletedCount) {
        res.status(404).send("Not found");
      } else {
        res.status(200).send(result);
      }
  });
// router.delete("/learner/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { learner_id: Number(req.params.id) };

//   let result = await collection.deleteOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });



export default router;
