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



/*
router.put('/api/spotifylogin/:username', friend_controller.spotifyLogin);
router.get('/api/loadfriend/:username', friend_controller.loadfriend);
router.put('/api/updatefriend/:username', friend_controller.updateFriend);
router.get('/api/login', friend_controller.login);
router.get('/callback', friend_controller.callback);
router.get('/api/generate', friend_controller.generate);
router.get('/api/test', friend_controller.test);
router.get('*', friend_controller.serve);

*/

router.get('/gencallback', friend_controller.gencallback);
router.post('/friend', friend_controller.friend_create2);


module.exports = router;
