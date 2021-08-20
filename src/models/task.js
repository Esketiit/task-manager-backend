const mongoose = require('mongoose')
const validator = require('validator')

//schema and model definiton
const taskSchema = mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectID,
    required: true,
    ref: "User"
  }
})

const Task = mongoose.model("task", taskSchema)

// middleware
// taskSchema.pre('save', async function(this) {
//   const task = this
//   if (task.isModified()) {

//   }
//   next()
// })

module.exports = Task