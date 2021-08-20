const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require("../middleware/auth")

// index
router.get('/tasks', auth, async (req, res) => {
  
  try {
    // finds all tasks that belong to the logged in user
    const tasks = await Task.find({owner: req.user._id})
    res.send(tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

// gets a single task by ID
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    // finds a task with the provided id that belongs to the logged in user
    const task = await Task.findOne({_id, owner: req.user._id})
    if (!task) {
      return res.status(404).send("task not found")
    }
    res.send(task)
  } catch (e) {
    res.send("something went wrong")
  }
})

// create new task
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    "owner": req.user._id
  })
  console.log(req.user._id, task)
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

//update
router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  const allowedUpdates = ["status", "description"]
  const updates = Object.keys(req.body)
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({error: "invalid operation"})
  }

  try {
    let task = await Task.findOne({_id: req.params.id, owner: req.user._id})

    if (!task) {
      return res.status(404).send("task not found")
    }

    updates.forEach(update => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(500).send("sever error: update")
  }
})

// delete
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})
    if(!task) {
      return res.status(404).send("user not found")
    }
    res.send(task)
  } catch (e) {
    res.send(e)
  }
})

module.exports = router