const express = require('express')
const User = require('../models/user')
const auth = require("../middleware/auth")
const router = new express.Router()

// Users endpoints

// sends authenticated user data
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

//show
router.get('/users/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const user = await User.findById(_id).lean()
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
    const token = await user.generateAuthToken()
    await user.save()
    res.status(201).send({user, token})
   } catch (e){
    res.status(400).send(e)
   }
   
})

// login
// A user can be logged on to more than one device, which means
// more than one token has to be stored in a user object
router.post('/users/login', async (req,res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({user, token})
  } catch (e) {
    res.status(400).send("Could not login")
  }
})

// logout
router.post('/users/logout', auth, async (req, res) => {
  // #auth runs before the code in the route handler does
  // and auth gives access to user data in req.user
  try {
    // .filter is used on the users array of tokens to delete the token
    // of the device being logged off of
    // we want to keep the others so that the user stay logged in on other devices
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    // save the new token array and send
    await req.user.save()
    res.send()
  } catch (e){
    res.status(500).send() 
  }
})

// logout of all sessions
// this logs a user out of all devices (currently not working for some reason)
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//update
router.patch('/users/me', auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"]
  const updates = Object.keys(req.body)
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({error: "invalid update"})
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})

//delete
router.delete('/users/:id', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.send(500).send()
  }
})


module.exports = router