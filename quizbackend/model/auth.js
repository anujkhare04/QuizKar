const mongoose = require('mongoose')

const userschema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {

        firstname: {
            type: String,
            required: true,

        },
        middlename: {
            type: String

        },
        lastname: {
            type: String,
            required: true,

        }


    },


    img: {
        type: String,
        default: ""
    },
    quizHistory: [
        {
            score: Number,
            totalQuestions: Number,
            topic: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    totalScore: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    resetToken:
     { type: String },
     
    resetTokenExpire: { type: Date },



},
    {
        timestamps: true
    }


);

const usermodel = mongoose.model("usermodel", userschema);

module.exports = usermodel
