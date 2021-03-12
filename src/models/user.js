const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is not validator')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Your password must not contain the word password")
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (0 > value) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    } 
  }]
})

// finds user by login credentials
userSchema.statics.findByCredentials = async (email, password) => {
  // see if user with correct email exists
  const user = await User.findOne({email})
  if (!user) {
    throw new Error("Uable to login")
  }

  // see if given password is correct
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

// generates new token for user
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({_id: user._id.toString()}, 'ilostmyjournal')

  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

//Middleware
// Hash user password before saving
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User