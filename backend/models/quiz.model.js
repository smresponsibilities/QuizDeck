import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizname: {
        type: String,
        required: true,
        trim: true
    },
    questions: [{
        question: {
            type: String,
            required: true,
            trim: true
        },
        options: {
            type: [{
                option: {
                    type: String,
                    required: true,
                    trim: true
                },
                isAnswer: {
                    type: Boolean,
                    required: true
                }
            }],
            validate: [optionLimit, '{PATH} must have exactly 4 options']
        }
    }]//,
    // validate: [questionLimit, ' must have at least 1 question']
});

function optionLimit(val) {
    return val.length ===4 ;
}

function questionLimit(val) {
    return val.length ===1 ;
}

const Quiz = mongoose.model('quiz', quizSchema);

export default Quiz;