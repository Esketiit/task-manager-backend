require('../src/db/mongoose')
const User = require('../src/models/user')
const Task = require('../src/models/task')

const deleteTaskAndCount = async _id => {
  const task = await Task.findByIdAndDelete(_id)
  const count = await Task.countDocuments({status: false})
  return count
}

// deleteTaskAndCount("603571ae5621e18c7f147085")
//   .then(count => {
//     console.log(count)
//   })
// let createTask = async () => {
//   const task = new Task({description: "delete this shit", status: false})
//   task.save()
// }
//  createTask()