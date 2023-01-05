import mongoose from 'mongoose'

const { Schema } = mongoose

const quizSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, 
{
    timestamps: true
})

const Quiz = mongoose.model('Quiz', quizSchema)

export default Quiz