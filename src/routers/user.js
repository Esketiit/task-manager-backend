const express = require('express')
const User = require('../models/user')
const router = new express.Router()

// Users endpoints
// index
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).send(users)
  } catch (e) {
    res.status(500).send(e)
  }
})

//show
router.get('/users/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const user = await User.findById(_id)
    if (!user) {
      return res.status(404).send("user not found")
    }
    res.status(200).send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

// post
router.post('/users', async (req, res) => {
   const user = new User(req.body)
   try {
    await user.save()
    res.status(201).send(user)
   } catch (e){
    res.status(400).send(e)
   }
   
})

// login
router.post('/users/login', async (req,res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    res.send(user)
  } catch (e) {
    res.status(400).send()
  }
})

//update
router.patch('/users/:id', async (req, res) => {
  const _id = req.params.id
  const allowedUpdates = ["name", "email", "password", "age"]
  const updates = Object.keys(req.body)
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({error: "invalid update"})
  }

  try {
    let user = await User.findById(_id)
    updates.forEach(update => user[update] = req.body[update])

    if (!user) {
      return res.status(404).send("user not found")
    }

    await user.save()
    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

//delete
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if(!user) {
      return res.status(404).send("user not found")
    }
    res.send(user)
  } catch (e) {
    res.send(e)
  }
})


module.exports = router