import mongoose from 'mongoose'

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ydqjdba.mongodb.net/monumentApi?retryWrites=true&w=majority`)
    .then(() => console.log('✅ Successfully connected to the database'))
    .catch((e) => console.log(`⛔️ Error during database connection ${e}`))