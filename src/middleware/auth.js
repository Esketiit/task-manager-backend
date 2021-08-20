const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
  try {
    // req.header() takes a header key and returns its value
    // .replace() is used here to remove "Bearer" from the token string
    // if no token is provided, req.header will return undefined, which will throw an error
    const token = req.header("Authorization").replace("Bearer ", "")

    // next we need to make sure the token is valid
    const decoded = jwt.verify(token, 'ilostmyjournal')

    // using the data from the decoded token, try to find a user with the correct id
    // that has this authentication token still stored
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
    // if no user is found, throw an error
    if (!user) {
      console.log("user not found")
      throw new Error()
    }

    // if the user is found, give the route handler access to user data and token
    req.token = token
    req.user = user
    next()
  } catch (e){
    res.status(401).send({error: " Please authenticate."})
  }
}

module.exports = auth