const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const friend_controller = require('./friend.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/api/qrZtyoP/login', friend_controller.login);
router.get('/api/qrZtyoP/test', friend_controller.test);
router.get('/callback', friend_controller.callback);
router.put('/api/qrZtyoP/createProfile', friend_controller.create_profile);
router.get('/api/qrZtyoP/loadfriend/:username', friend_controller.find_profile);
router.get('/api/qrZtyoP/loadfriend/:username', friend_controller.loadfriend);
router.get('*', friend_controller.serve);


module.exports = router;
