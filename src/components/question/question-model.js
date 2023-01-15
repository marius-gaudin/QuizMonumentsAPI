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
        type: Number,
        default: null
    },
    userAnswerLongitude: {
        type: Number,
        default: null
    },
    timeStart: {
        type: Date,
        default: null
    },
    timeEnd: {
        type: Date,
        default: null
    },
    score: {
        type: Number,
        default: null
    }
},
{
    versionKey: false
})

const Question = mongoose.model('Question', questionSchema)

export default Question