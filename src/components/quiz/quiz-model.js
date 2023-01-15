import mongoose from 'mongoose'

const { Schema } = mongoose

const quizSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    finalScore: {
        type: Number,
        default: null
    }
}, 
{
    timestamps: true,
    versionKey: false
})

const Quiz = mongoose.model('Quiz', quizSchema)

export default Quiz