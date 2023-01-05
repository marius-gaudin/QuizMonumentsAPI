import mongoose from 'mongoose'

const { Schema } = mongoose

const monumentSchema = new Schema({
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    frenchName: {
        type: String,
        required: true,
        unique: true
    }
}, 
{
    timestamps: true
})

const Monument = mongoose.model('Monument', monumentSchema)

export default Monument