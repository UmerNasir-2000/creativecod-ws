const mongoose = require("mongoose")

async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("Connected to MongoDB")
  } catch (error) {
    console.log("Error connecting to MongoDB", error)
    process.exit(1)
  }
}

module.exports = connectToMongo
