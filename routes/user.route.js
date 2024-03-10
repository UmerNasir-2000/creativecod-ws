const express = require("express")
const router = express.Router()

const db = require("../models")

router.get("/", async (req, res) => {
  const users = await db.user.find()
  res.status(200).json(users)
})

module.exports = router
