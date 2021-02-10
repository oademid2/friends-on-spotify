const Friend = require('./friend.model');
const path = require('path');
require('dotenv').config();

//SPOTIFY API
var SpotifyWebApi = require('spotify-web-api-node');
scopes = ['user-top-read']

//load enviroment varaibles
var DEST = process.env.FRONTEND_URL;
var client_id = process.env.client_id;
var client_secret = process.env.client_secret;
var redirect_uri = process.env.SERVER_URL+'/callback/'; 

//must be to a back end thing
var spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri,
});

exports.test = function (req, res){
    res.json(["pas"]);
};

///client/build/index.html
exports.serve = function (req, res){

    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  };

exports.login = function(req,res,next){
    var html = spotifyApi.createAuthorizeURL(scopes)
    console.log(html)
    res.send(html+"&show_dialog=true")  
}


exports.callback = async function (req,res) {
    const { code } = req.query;

    console.log(code)

    try {
      var data = await spotifyApi.authorizationCodeGrant(code)
      const { access_token, refresh_token } = data.body;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      console.log("Access: ",access_token)
  
      //res.send(access_token);
      res.redirect(DEST+"/viewprofile/?token="+access_token)
    } catch(err) {
      res.redirect('/#/error/invalid token');
      console.log(err)
    }
};

exports.create_profile = function (req, res,next) {

    Friend.findOneAndUpdate({username: req.body.username}, {$set:{network: []}}, {returnOriginal:true}, (err, doc) => {
        console.log(doc)
        if (!doc) {
            let friend = new Friend({
                username: req.body.username,
                display_name: req.body.display_name,
                topArtists: req.body.topArtists,
                topSongs: req.body.topSongs,
                network : []

            })
            console.log("new created")

            friend.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'friend created!' });
            });
        }else{
            res.json(doc);
        }
     

});

};


exports.find_profile = function (req, res) {
    Friend.findOne({username: req.params.username}).exec()
    .then(function(friend, err) {
         if (err) 
            return next(err);
         return res.send(friend);
     })
 };




exports.loadfriend = function (req, res) {
    Friend.findOne({username: req.params.username}).exec()
    .then(function(friend, err) {

         if (err) 
            return next(err);
        console.log("load friend ", req.params.username)
         return res.send(friend);
     })
 };



