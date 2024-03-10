const express = require("express")

const router = express.Router()

const db = require("../models")

router.get("/", async (req, res) => {
  const groups = await db.group.find()
  res.status(200).json(groups)
})

module.exports = router
