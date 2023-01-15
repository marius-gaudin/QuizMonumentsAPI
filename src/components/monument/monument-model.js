import mongoose from 'mongoose'

const { Schema } = mongoose

const monumentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, 
{
    timestamps: true,
    versionKey: false
})

const Monument = mongoose.model('Monument', monumentSchema)

export default Monument