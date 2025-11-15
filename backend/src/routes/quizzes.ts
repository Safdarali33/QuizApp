import express from 'express';
import Quiz from '../models/Quiz';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all quizzes (public)
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .select('title description questions createdAt')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single quiz (public)
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get admin's quizzes (protected)
router.get('/admin/my-quizzes', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.adminId })
      .sort({ createdAt: -1 });
    
    res.json(quizzes);
  } catch (error) {
    console.error('Get admin quizzes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create quiz (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Title and questions are required' });
    }

    const quiz = new Quiz({
      title,
      description,
      questions,
      createdBy: req.adminId
    });

    await quiz.save();
    
    // Populate the createdBy field for the response
    await quiz.populate('createdBy', 'name email');
    
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit quiz and get results (public)
router.post('/:id/submit', async (req, res) => {
  try {
    const { answers } = req.body; // { questionId: answer }
    
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let score = 0;
    let totalPoints = 0;
    const results = quiz.questions.map(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        score += question.points;
      }

      return {
        questionId: question.id,
        questionText: question.questionText,
        type: question.type,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: question.points
      };
    });

    const percentage = Math.round((score / totalPoints) * 100);

    res.json({
      score,
      totalPoints,
      percentage,
      results
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update quiz (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ 
      _id: req.params.id, 
      createdBy: req.adminId 
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    Object.assign(quiz, req.body);
    await quiz.save();
    
    res.json(quiz);
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete quiz (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.adminId 
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;