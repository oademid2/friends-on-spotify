import React, { Component, createElement } from 'react';

import './Shared.scss'
import api from './api'
import loadImg from './loading.gif'

class Shared extends Component{

  constructor(props){
    super(props);
   
    this.simulatedLogin = this.simulatedLogin.bind(this);
    this.copyLink = this.copyLink.bind(this);
    this.viewProfile = this.viewProfile.bind(this);

    this.state = { 
      user:{
        display_name:'',
        username: ''
      },
      pageId: '',
      authToken:'',
      allArtists: [],
      allSongs:[],
      sharedArtists:[
        this.loading("AA"),
        this.loading("BB"),
        this.loading("CC")
 
       ],
       sharedSongs: [
         this.loading("AA"),
         this.loading("BB"),
         this.loading("CC")
 
       ],
      isLoading: true
    };
  }
 
  loading(_id){

    return{
      name:"Loading",
      id: _id,
      rank : 0,
      imgSrc: loadImg
    }

  }
 
  componentDidMount() {
    //if(localStorage.getItem("comparison"))this.props.history.push("/compare/user/"+localStorage.getItem("comparison"))
    let tkn = window.location.href.split("?token=")[1]
    //tkn = "BQDNa1laRxIREC1Y6QPd19JVVG3Zo-T77154-YAyZcXsbxxq0bYgKpUSLyDcMvmK_ct2IVa2TqlD_VobYe_1WG15pE_aLcMkcxzafa_NMR9qQPV12yxe99lgmu_GHeeL8hDa6uy8Fjq9PvK-BsigBur7OwKUAHDuD68MndZTKN-rCw";
    let pageId = window.location.href.split("viewprofile/usr/")[1]
    this.setState({pageId: pageId})

    if(localStorage.getItem("comparison")){
      
      if(localStorage.getItem("username")){
        this.props.history.push("/compare/user/"+localStorage.getItem("comparison"))
        return
      }//cookie
      api.getProfile(tkn).then((result)=>{
        localStorage.setItem("username",result.data.id )
        this.props.history.push("/compare/user/"+localStorage.getItem("comparison"))
      })
    }


    if(pageId){
      api.loadProfile(pageId).then((result)=>{
        console.log(result)
        this.setState({
          user:{
            display_name:result.data.display_name,
            username: result.data.username
          }
        })
          this.setState({sharedArtists: this.topRankingFromDict(result.data.topArtists)})
          this.setState({sharedSongs: this.topRankingFromDict(result.data.topSongs)})
      })
    }else{
      api.getProfile(tkn).then((result)=>{
      let _user = {
        display_name: result.data.display_name,
        username: result.data.id
      }
      this.setState({pageId: result.data.id})
      localStorage.setItem("username",result.data.id )
      this.setState({user:_user})
          //get the artist rankings
      api.getSpotifyTopArtists(tkn).then((result)=>{
      this.setState({allArtists:this.resultsToRankingDictionary(result.data.items)})
      console.log(result.data.items)
      this.setState({sharedArtists: this.topRankingFromDict(this.state.allArtists)})

      api.getSpotifyTopSongs(tkn).then((result)=>{
        this.setState({allSongs:this.resultsToRankingDictionary(result.data.items)})
        console.log(result.data.items)
        this.setState({sharedSongs: this.topRankingFromDict(this.state.allSongs)})
  
        _user.topArtists = this.state.allArtists;
        _user.topSongs = this.state.allSongs;
        console.log("...")
        
        api.createprofile(_user).then((res)=>{
          console.log(res)
        })
      })


    })
    })
    }
  }

resultsToRankingDictionary(_data){
  let x = _data
  let y = {}

  for(var i=0;i<x.length;i++){
    let img = x[i].album
    let creator = null;
    if(!img) img = x[i]
    if(x[i].artists){

    creator = x[i].artists[0].name;
    console.log(x[i].artists[0].name)
    }else creator = null;

    y[x[i].id] = {
        'name': x[i].name,
        'id': x[i].id,
        'rank': i+1,
        'imgSrc': img.images[0].url,
        'track_creator': creator
    }
    if(i == 1)console.log(img)
  }
  return y;
}

topRankingFromDict(_dict){
  let topList = [];
      for (const [key, value] of Object.entries(_dict)) {
        topList.push({
          'id': value['id'],
          'name': value['name'],
          'rank': topList.length + 1,
          'imgSrc': value['imgSrc'],
          'track_creator': value['track_creator']
        })
        if(topList.length == 5)break
      }

    return topList;
}


 simulatedLogin = ()=>{
  
  api.simulatedLogin().then((res)=>{
    console.log(res.data)
    console.log('redirecting through spotify....')
    window.location.href = res.data
  })
 }

 compare = ()=>{
  
  localStorage.setItem("comparison",this.state.pageId) //store so that when it comes back we know to redirect
  //cookie
  if(api.userIsValid()){   
   
      this.props.history.push("/compare/user/"+localStorage.getItem("comparison"))
      return

  }
  else this.simulatedLogin()
 }
copyLink = () => {
  let link = document.getElementsByClassName("sharing-link")[0]
  let textfield = document.createElement('textarea')
  textfield.innerText = link.textContent;
  document.body.appendChild(textfield)
  textfield.select()
  document.execCommand('copy')
  textfield.remove()

 };

 viewProfile = () =>{
  if(api.userIsValid()){
    this.props.history.push("/viewprofile/usr/"+localStorage.getItem("username"))
    return
  }

  api.simulatedLogin().then((res)=>{
    console.log(res.data)
    console.log('redirecting through spotify....')
    window.location.href = res.data
  })
}

render(){
 
return (

<div className="profile-container">

  <div className="profile-title-container" >
  <a href="https://oademid2.github.io" target="_blank" className="my-link">created by kitan ademidun</a>
    

<p className="profile-title-subcaption"> {this.state.user.display_name? this.state.user.display_name : this.state.user.username}</p>
    <h1 className="profile-landing-title">FRIENDS ON SPOTIFY</h1>
        
      <div className="ranking-container">
      <div className="ranking-section">

      <div className= "ranking-section-title">Your Top Artists</div>
      { //Array for artists
      this.state.sharedArtists.map(item =>{
        if(item.isNull){
          return( <div key={item.id}></div> )
        }else{return(

          <div className="ranking-card" key={item.id}>
          <img  src= {item.imgSrc} class="ranking-card-img"></img>
          <div className="ranking-card-text">
            <p class="ranking-card-title">{item.rank}| {item.name}</p>
          </div>
          </div>
        )}//end array
      })}
    </div>

  
    <div className="ranking-section">
    <div className= "ranking-section-title">Your Top Songs</div>
    { 
      this.state.sharedSongs.map(item =>{
          if(item.isNull){
            return(
              <div key={item.id}></div>
            )
          }else{return(
            <div className="ranking-card" key={item.id}>
            <img  src= {item.imgSrc} class="ranking-card-img"></img>
            <div className="ranking-card-text">
              <p class="ranking-card-title">{item.rank}| {item.name}</p>
              <p class="ranking-card-subtitle">{item.track_creator}</p>
            </div>
            </div>
          )}})
    }
    </div>

  
  </div>

{this.state.pageId == localStorage.getItem("username")?
(  <div className="">
<p className="">Share your top 5 with friends and they can get a similary score of your top 50!</p>
<p className="sharing-link"><a href="">{api.HOST}/viewprofile/usr/{localStorage.getItem("username")}</a></p>
<a class= "themed-btn dark-green-bg" href="https://twitter.com/intent/tweet?text=Check+out+my+top+listens+on+Spotify+and+reply+to+this+tweet+with+our+percentage+score+of+our+similar+our+music+is%3A+friendsonspotify.heroku.com" target="_blank">share</a>
<button className = "themed-btn dark-green-bg" onClick={this.copyLink}>Copy This Link</button>
{api.userIsValid()?<button onClick={()=> api.reset(this.props) } className = "themed-btn">logout</button> : 
 <span></span>}

</div>):
  (  <div className="">
  <p className="">Compare to your top 50 👀</p>
  <button className = "themed-btn dark-green-bg" onClick={this.compare}>See similarities</button>
  
  {api.userIsValid()?<button onClick={()=> api.reset(this.props) } className = "themed-btn">logout</button> :<button onClick={()=> api.viewProfile } className = "themed-btn">view yours</button> }


  </div>)}

    
  </div>


</div>



//end of return
)
//end of render
}
//end of class
};

export default Shared


/*


  {name:"Burna Boy",
          id:"3wcj11K77LjEY1PkEazffa1",
          rank : 1,
          imgSrc: "https://i.scdn.co/image/17755d54631ecbc0c40d327738bcfc5287dd9aff"},

          */

/*
  loading(_id){

    return{
      name:"Loading",
      id: _id,
      rank : 0,
      imgSrc: "https://images.app.goo.gl/1CVfeqYHyEtu8MW17"
    }

  }


*/