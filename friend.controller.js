const Friend = require('./friend.model');
const path = require('path');

//PROD
var SpotifyWebApi = require('spotify-web-api-node');
scopes = ['user-top-read']//, 'user-read-private', 'user-read-email']//,'playlist-modify-public','playlist-modify-private']
var DEST = "http://localhost:3000"; //'https://agile-beyond-63487.herokuapp.com'
var HOST = "http://localhost:1234"; //'https://agile-beyond-63487.herokuapp.com'
var DEST = 'https://friendsonspotify.herokuapp.com'
var HOST = 'https://friendsonspotify.herokuapp.com'
var client_id = "73e90db024fc4168853c3320202e37d5"; // Your client id
var client_secret = "19426ec3794742f281b73bd1e3e82783"; // Your secret
var redirect_uri = HOST+'/callback'; // Your redirect uri// uri that works 'http://localhost:1234/callback'
var redirect_uri2 = HOST+'/callback';

//must be to a back end thing
var spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri,
  });
//require('dotenv').config();
var spotifyApi2 = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri2,
  });

  exports.test = function (req, res){
    res.json(["pas"]);
  };


var localtest = 'client/public/index.html';
var b = 'build/'
var deploytest = 'build/client/public/index.html';


///client/build/index.html
exports.serve = function (req, res){
    //res.sendFile(path.join(__dirname+'/client/build/index.html'));
    res.json(["pas"]);
  };

///build/client/index.html'
exports.login = function(req,res,next){
    var html = spotifyApi.createAuthorizeURL(scopes)

    res.send(html+"&show_dialog=true")  
}

exports.generate = function(req,res,next){
    var html = spotifyApi2.createAuthorizeURL(scopes)

    res.send(html+"&show_dialog=true")  
}

exports.callback = async function (req,res) {
    const { code } = req.query;

    try {
      var data = await spotifyApi.authorizationCodeGrant(code)
      const { access_token, refresh_token } = data.body;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
  
      //res.send(access_token);
      res.redirect(DEST+"/?token="+access_token)
    } catch(err) {
      res.redirect('/#/error/invalid token');
      console.log(err)
    }
  };

  exports.gencallback = async function (req,res) {
    const { code } = req.query;

    try {
      var data = await spotifyApi.authorizationCodeGrant(code)
      const { access_token, refresh_token } = data.body;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
  
      //res.send(access_token);
      res.redirect(DEST+"?gentoken="+access_token)
    } catch(err) {
      res.redirect('/#/error/invalid token');
      console.log(err)
    }
  };

  
exports.spotifyLogin = function (req, res,next) {

    Friend.findOne({username: req.params.username}).exec()
    .then(function(friend, err) {

        //if it exists then repond that it is not unique
        console.log(err);
        if (friend){
            //console.log("friend found ",req.params.username, friend)
            console.log("Return friend...", req.params.username)
            return res.send(friend)
        }else{
            //console.log(req.params.username, " friend does not exist", friend)
            let friend = new Friend({
                username: req.params.username,
                email: req.body.email,
                topArtists: {},//req.body.topArtists,
                topSongs: {},//req.body.topSongs,
                network: [],
                display_name: req.body.display_name

            })
            console.log("Return friend2...", req.params.username)

            friend.save(function(err, result) {
                if (err){
                    console.log("Return friend3...", req.params.username)
                    return res.send(err);}
                return res.json(result);
            });
        }

       

    });
};

exports.updateFriend = function(req,res,next){
    Friend.findOne({username: req.params.username}).exec()
    .then(function(friend, err) {
     
        //if it exists then repond that it is not unique
        if (!err){
            friend.topArtists = req.body.topArtists;
            friend.topSongs = req.body.topSongs;
            friend.network = req.body.network;
            friend.email = req.body.email;
            friend.display_name = req.body.display_name;
            console.log("update friend1...", req.params.username)
            // save the bear
            friend.save(function(err, result) {
                if (err)
                    return res.send(err);
                console.log("update friend2...", result)
                return res.json(result);
            });
        }
    })
}

exports.loadfriend = function (req, res) {
    Friend.findOne({username: req.params.username}).exec()
    .then(function(friend, err) {

         if (err) 
            return next(err);
        console.log("load friend ", req.params.username)
         return res.send(friend);
     })
 };



exports.friend_create2 = function (req, res,next) {

   
            let friend = new Friend({
                username: req.body.username,
                email: req.body.email,
                topArtists: req.body.topArtists,
                topSongs: req.body.topSongs

            })

            friend.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'friend created!' });
            });
       

};

