
const mongoose = require('mongoose')


mongoose.set('strictQuery', false)
const connectDb = () => {
    mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log("Database Connected")
        }).catch(e => {
            console.log("error encountered")
            console.log(e)
        })

}

module.exports = connectDb;