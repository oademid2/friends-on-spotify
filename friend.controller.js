const Friend = require('./friend.model');
const path = require('path');

//PROD
var SpotifyWebApi = require('spotify-web-api-node');
scopes = ['user-top-read']//, 'user-read-private', 'user-read-email']//,'playlist-modify-public','playlist-modify-private']
var DEST = "https://floating-lake-89604.herokuapp.com"//"http://localhost:3000"; //'https://agile-beyond-63487.herokuapp.com'
var HOST = "https://floating-lake-89604.herokuapp.com"//""http://localhost:1234"; //'https://agile-beyond-63487.herokuapp.com'
var DEST = "http://localhost:3000"//"https://floating-lake-89604.herokuapp.com"//"http://localhost:3000"; //'https://agile-beyond-63487.herokuapp.com'
var HOST = "http://localhost:1234"//"https://floating-lake-89604.herokuapp.com"//""http://localhost:1234"; //'https://agile-beyond-63487.herokuapp.com'


var client_id = "73e90db024fc4168853c3320202e37d5"; // Your client id
var client_secret = "19426ec3794742f281b73bd1e3e82783"; // Your secret
var redirect_uri = HOST+'/callback'; // Your redirect uri// uri that works 'http://localhost:1234/callback'

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

///build/client/index.html'
exports.login = function(req,res,next){
    var html = spotifyApi.createAuthorizeURL(scopes)
    res.send(html+"&show_dialog=true")  
    //res.redirect(html+"&show_dialog=true")
}


exports.callback = async function (req,res) {
    const { code } = req.query;

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

    Friend.findOneAndUpdate({username: req.body.username}, {$set:{display_name:"test"}}, {returnOriginal:true}, (err, doc) => {
        console.log(doc)
        if (!doc) {
            let friend = new Friend({
                username: req.body.username,
                display_name: req.body.display_name,
                topArtists: req.body.topArtists,
                topSongs: req.body.topSongs

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



