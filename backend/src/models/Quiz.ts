import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  id: string;
  type: 'mcq' | 'truefalse' | 'text';
  questionText: string;
  options?: string[];
  correctAnswer: string;
  points: number;
}

export interface IQuiz extends Document {
  title: string;
  description?: string;
  questions: IQuestion[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mcq', 'truefalse', 'text'],
    required: true
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    trim: true
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 1,
    min: 1
  }
});

const quizSchema = new Schema<IQuiz>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  questions: [questionSchema],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IQuiz>('Quiz', quizSchema);