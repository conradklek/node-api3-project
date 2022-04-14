const express = require('express');
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware');
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

const User = require('./users-model')
const Post = require('../posts/posts-model')

router.get('/', (req, res, next) => {
    User.get()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.send(req.user);
});

router.post('/', validateUser, (req, res, next) => {
  User.insert({ name: req.name })
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(next);
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  res.send(req.user);
});

router.delete('/:id', validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  res.send(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  res.send(req.user.posts);
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  res.send(req.post);
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    stack: err.stack,
  })
})

// do not forget to export the router
module.exports = router;