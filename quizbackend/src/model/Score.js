const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({

 
  userId: {
    type: String,
    
    required: true
  },

 
  quizId: {
    type: String,
    
    required: true
  },

 
  mode: {
    type: String,
    required: true
  },

  timeTaken: {
    type: Number,
    required: true
  },


  
  survivalCount: {
    type: Number,
    default: null
  },

  failedQuestionId: {
    type: String,
    
    default: null
  },

  
  answers: [
    {
      questionId: {
         type:String,
        required: true
      },

      selectedOption: {
        type: String,
        default: null   
      },

      isCorrect: Boolean,

                   
    }
  ],

  attemptedAt: {
    type: Date,
    default: Date.now
  }

},
{ timestamps: true });

const ScoreModel = mongoose.model("Score", scoreSchema);

module.exports = ScoreModel;
