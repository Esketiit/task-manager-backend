const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

// index
router.get('/tasks', async (req, res) => {
  
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

// show
router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findById(_id)
    if (!task) {
      return res.status(404).send("task not found")
    }
    res.send(task)
  } catch (e) {
    res.send(e)
  }
})

// post
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)

  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

//update
router.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  const allowedUpdates = ["status", "description"]
  const updates = Object.keys(req.body)
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({error: "invalid operation"})
  }

  try {
    let task = await Task.findById(_id)
    if (!task) {
      return res.status(404).send("user not found")
    }
    updates.forEach(update => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(500).send("sever error: update")
  }
})

// delete
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if(!task) {
      return res.status(404).send("user not found")
    }
    res.send(task)
  } catch (e) {
    res.send(e)
  }
})

module.exports = router