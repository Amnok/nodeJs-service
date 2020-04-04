const express = require('express');

const router = express.Router();

// @route GET api/posts/test
// @desc  tests post route
// @access public

router.get('/test', (req, res) => {
  res.json({
    message: 'post works',
  });
});
module.exports = router;
