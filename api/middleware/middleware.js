const User = require('../users/users-model');

function logger(req, res, next) {
  const timestamp = new Date().toLocaleString();
  const method = req.method;
  const url = req.originalUrl;
  console.log(`${timestamp} ${method} to ${url}`);
  next()
}

async function validateUserId(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.get(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
}

function validateUser(req, res, next) {
 const { name } = req.body;
  if (!name || !name.trim()) {
    res.status(400).json({ message: 'Missing required name field' });
  } else {
    req.name = name.trim();
    next();
  }
}

function validatePost(req, res, next) {
  
}

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}