const express = require('express');
const router = express.Router();
const Score = require('../../models/Score');

// Get all scores
router.get('/', async (req, res) => {
  try {
    const scores = await Score.find();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one score
router.get('/:id', async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (score == null) {
      return res.status(404).json({ message: 'Score not found' });
    }
    res.json(score);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create score
router.post('/', async (req, res) => {
  const score = new Score({
    process_score: req.body.process_score,
    midterm_score: req.body.midterm_score,
    final_score: req.body.final_score,
    subject_id: req.body.subject_id,
    student_id: req.body.student_id,
    by_instructor_id: req.body.by_instructor_id
  });

  try {
    const newScore = await score.save();
    res.status(201).json(newScore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update score
router.patch('/:id', async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (score == null) {
      return res.status(404).json({ message: 'Score not found' });
    }

    if (req.body.process_score != null) {
      score.process_score = req.body.process_score;
    }
    if (req.body.midterm_score != null) {
      score.midterm_score = req.body.midterm_score;
    }
    if (req.body.final_score != null) {
      score.final_score = req.body.final_score;
    }
    if (req.body.subject_id != null) {
      score.subject_id = req.body.subject_id;
    }
    if (req.body.student_id != null) {
      score.student_id = req.body.student_id;
    }
    if (req.body.by_instructor_id != null) {
      score.by_instructor_id = req.body.by_instructor_id;
    }

    const updatedScore = await score.save();
    res.json(updatedScore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete score
router.delete('/:id', async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (score == null) {
      return res.status(404).json({ message: 'Score not found' });
    }
    await score.remove();
    res.json({ message: 'Score deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 