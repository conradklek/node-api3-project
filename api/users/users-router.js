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

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  User.update(req.user.id, { name: req.name })
    .then(() => {
      return User.getById(req.params.id);
    })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(next);
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    const result = await User.remove(req.params.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const result = await User.getUserPosts(req.params.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  try {
    const result = await Post.insert({ user_id: req.params.id, text: req.text })
    res.json(result)
  } catch (err) {
    next(err)
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    stack: err.stack,
  })
})

// do not forget to export the router
module.exports = router;