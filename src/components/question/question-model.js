import mongoose from 'mongoose'

const { Schema } = mongoose

const questionSchema = new Schema({
    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    monument: {
        type: Schema.Types.ObjectId,
        ref: 'Monument',
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    userAnswerLatitude: {
        type: Number
    },
    userAnswerLongitude: {
        type: Number
    },
    timeStart: {
        type: Date
    },
    timeEnd: {
        type: Date
    },
    score: {
        type: Number,
        default: 0
    }
})

const Question = mongoose.model('Question', questionSchema)

export default Question