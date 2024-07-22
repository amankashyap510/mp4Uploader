const express = require('express');
const router = express.Router();
const { registerUser, loginUser, uploadVideo } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/upload', uploadVideo);

module.exports = router;
