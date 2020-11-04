
import request from 'axios';

class api {


    constructor(){
        //this.server = "http://localhost:1234/api"
    }

    static myToken = '';
    static myUser = '';
    static theirUser = '';
    //static HOST = "localhost:3000"//
    static HOST = "friendsonspotify.herokuapp.com"//PROD""localhost:3000"
    static _url = "/api/qrZtyoP";

    static getProfile = (tkn) =>{
        let _headers = {'Authorization': "Bearer " + tkn}
        const apiCompletionPromise = request({
            method: 'get',
            url: "https://api.spotify.com/v1/me",
            headers: _headers
        })
        return apiCompletionPromise;
    }

    static createprofile = (usr) => {

        const apiCompletionPromise = request({
            method: 'put',
            data: usr,
            url: this._url +'/createprofile',
        })

        //todo: put in database
        return apiCompletionPromise;
    }

    static getSpotifyTopArtists = async (tkn) => {

        let _headers = {'Authorization': "Bearer " +tkn}
        let _params = {'limit':50}
        const apiCompletionPromise = await request({
            method: 'get',
            url: "https://api.spotify.com/v1/me/top/artists",
            params: _params,
            headers: _headers
        })
        return apiCompletionPromise;
    }

    static getSpotifyTopSongs = async (tkn) => {

        let _headers = {'Authorization': "Bearer " + tkn}
        let _params = {'limit':50}
        const apiCompletionPromise = await request({
            method: 'get',
            url: "https://api.spotify.com/v1/me/top/tracks",
            params: _params,
            headers: _headers
        })
        return apiCompletionPromise;
    }


    static simulatedLogin = (usrname) => {
        const apiCompletionPromise = request({
            method: 'get',
            url: this._url + '/login',
        })
        //todo: put in database
        return apiCompletionPromise;
    }

    static loadProfile= (usrname) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: this._url + '/loadfriend/' +usrname,
        })

        //todo: put in database
        return apiCompletionPromise;
    }

    static loadFriend = (usrname) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: this._url + '/loadfriend/' +usrname,
        })

        //todo: put in database
        return apiCompletionPromise;
    }

    static reset = (props)=>{
            localStorage.clear();
            props.history.push("/")
    }



    static setToken(tkn){
        localStorage.setItem("token", tkn)
        localStorage.setItem("timestamp", Date().time)
    }

    static tokenIsValid(){
        
        
        let tkn = localStorage.getItem("token")
        if(!tkn) return false
    
        let now = Date().time;
        let then = localStorage.getItem("timestamp")
        let diff = (now - then)/100
        if(diff > 3400)return false;
        
    }

    static userIsValid(){
        let usr = localStorage.getItem("username")
        if(!usr)return false;
        else return true;
    }

    static getUser(){
        return localStorage.getItem("username")
    }
    

}

/*

    
    static setToken = (tkn)=>{
        this.myToken = tkn;
    };
    static setMyUser = (usr)=>{
        this.myUser = usr;
    };
    static setTheirUser = (usr)=>{
        this.theirUser = usr;
    };

    static current = (tkn)=>{
        this.myToken = tkn;
    };

    static login = (usrname) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: this._url + '/login',
        })

        //todo: put in database
        return apiCompletionPromise;
    }

    static generate = () => {

        const apiCompletionPromise = request({
            method: 'get',
            url: this._url + '/generate',
        })

        //todo: put in database
        return apiCompletionPromise;
    }

    static getToken = (code) => {
        console.log(this.myToken)
        const apiCompletionPromise = request({
            method: 'get',
            url: this._url + '/login/?code='+code,
        })

        //todo: put in database
        return apiCompletionPromise;
    }


    static getMe = () =>{
        let _headers = {'Authorization': "Bearer " + this.myToken}
        const apiCompletionPromise = request({
            method: 'get',
            url: "https://api.spotify.com/v1/me",
            headers: _headers
        })
        return apiCompletionPromise;
    }
    static spotifyLogin = (usrname) => {

        const apiCompletionPromise = request({
            method: 'put',
            url: this._url + '/spotifylogin/' +usrname,
        })

        //todo: put in database
        return apiCompletionPromise;
    }

    static loadFriend = (usrname) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: this._url + '/loadfriend/' +usrname,
        })

        //todo: put in database
        return apiCompletionPromise;
    }



    static getMyArtists = async () => {

        let _headers = {'Authorization': "Bearer " + this.myToken}
        let _params = {'limit':50}
        const apiCompletionPromise = await request({
            method: 'get',
            url: "https://api.spotify.com/v1/me/top/artists",
            params: _params,
            headers: _headers
        })

        //todo: put in database
        

        return apiCompletionPromise;
    }

    static getMySongs = async () => {

        let _headers = {'Authorization': "Bearer " + this.myToken}
        let _params = {'limit':50}
        const apiCompletionPromise = await request({
            method: 'get',
            url: "https://api.spotify.com/v1/me/top/tracks",
            params: _params,
            headers: _headers
        })
        return apiCompletionPromise;
    }


    static updateFriend = (username, usr)=> {

        const apiCompletionPromise = request({
            method: 'put',
            data: usr,
            url: this._url +'/updatefriend/'+username,
        });

        console.log("api, addartist")

        return apiCompletionPromise;
    }



*/




export default api;
