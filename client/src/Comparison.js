import React, { Component, createElement } from 'react';

import './Comparison.scss'
import api from './api'

class Shared extends Component{

  constructor(props){
    super(props);
   
    this.simulatedLogin = this.simulatedLogin.bind(this);
    this.copyLink = this.copyLink.bind(this);

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
        {name:"Burna Boy",
          id:"3wcj11K77LjEY1PkEazffa1",
          rank : 1,
          imgSrc: "https://i.scdn.co/image/17755d54631ecbc0c40d327738bcfc5287dd9aff"},
          {name:"Burna Boy",
          id:"3wcj11K77LjEY1PkEazffa2",
          rank :1,
          imgSrc: "https://i.scdn.co/image/17755d54631ecbc0c40d327738bcfc5287dd9aff"},
          {name:"Burna Boy",
          id:"3wcj11K77LjEY1PkEazffa3",
          rank :1,
          imgSrc: "https://i.scdn.co/image/17755d54631ecbc0c40d327738bcfc5287dd9aff"},
          {name:"Burna Boy",
          id:"3wcj11K77LjEY1PkEazffa4",
          rank :1,
          imgSrc: "https://i.scdn.co/image/17755d54631ecbc0c40d327738bcfc5287dd9aff"},
          {name:"Burna Boy",
          id:"3wcj11K77LjEY1PkEazffa5",
          rank :1,
          imgSrc: "https://i.scdn.co/image/17755d54631ecbc0c40d327738bcfc5287dd9aff"}
      ],
      sharedSongs: [
        {name:"From The D To The A (feat. Lil Yachty)",
        id:"2NyrXRn4tancYPW6JwtTl2a",
        rank : 1,
        imgSrc: "https://i.scdn.co/image/ab67616d0000b273a64fac177809a71bf0a2ffee"},
        {name:"From The D To The A (feat. Lil Yachty)",
        id:"2NyrXRn4tancYPW6JwtTl2b",
        rank : 1,
        imgSrc: "https://i.scdn.co/image/ab67616d0000b273a64fac177809a71bf0a2ffee"},
        {name:"From The D To The A (feat. Lil Yachty)",
        id:"2NyrXRn4tancYPW6JwtTl2c",
        rank : 1,
        imgSrc: "https://i.scdn.co/image/ab67616d0000b273a64fac177809a71bf0a2ffee"},
      ],
      isLoading: true
    };
  }
 
  componentDidMount() {
    let tkn = window.location.href.split("?token=")[1]
    tkn = "BQDNa1laRxIREC1Y6QPd19JVVG3Zo-T77154-YAyZcXsbxxq0bYgKpUSLyDcMvmK_ct2IVa2TqlD_VobYe_1WG15pE_aLcMkcxzafa_NMR9qQPV12yxe99lgmu_GHeeL8hDa6uy8Fjq9PvK-BsigBur7OwKUAHDuD68MndZTKN-rCw";

    let pageId = window.location.href.split("viewprofile/usr/")[1]
    pageId = "22nrtqre3rxxue6ekzqemxbba"//"z1m3os116mvplpoe023f8uxkc";

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
   console.log("click")
  api.simulatedLogin().then((res)=>{
    console.log(res.data)
    console.log('redirecting through spotify....')
    window.location.href = res.data
  })
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

render(){
 
return (

<div className="profile-container">

  <div className="profile-title-container" >

<p className="profile-title-subcaption"> {this.state.user.display_name? this.state.user.display_name : this.state.user.username}</p>
    <h1 className="profile-landing-title">FRIENDS ON SPOTIFY</h1>
    <div className="ranking-section">
      <div>
        percentage
      </div>
      </div>
      <div className="ranking-container">
      <div className="ranking-section">

      <div className="shared-card" >
    <div className= "ranking-section-title">Your Top Songs</div>
      </div>
      { //Array for artists
      this.state.sharedArtists.map(item =>{
        if(item.isNull){
          return( <div key={item.id}></div> )
        }else{return(

          <div className="shared-card" key={item.id}>
          <img  src= {item.imgSrc} class="shared-card-img"></img>
          <div className="shared-card-text">
            <p class="shared-card-title">{item.name}</p>
          </div>
          </div>
        )}//end array
      })}
    </div>

  
    <div className="ranking-section">
    

    <div className="shared-card" >
    <div className= "ranking-section-title">Your Top Songs</div>
      </div>
    { 
      this.state.sharedSongs.map(item =>{
          if(item.isNull){
            return(
              <div key={item.id}></div>
            )
          }else{return(
            <div className="shared-card" key={item.id}>
            <img  src= {item.imgSrc} class="shared-card-img"></img>
            <div className="shared-card-text">
              <p class="shared-card-title"> {item.name}</p>
            </div>
            </div>
          )}})
    }
    </div>

  
  </div>

{this.state.pageId == this.state.user.username?
(  <div className="">
<p className="">Share your top 5 with friends and they can get a similary score of your top 50!</p>
<p className="sharing-link">Link</p>
<button className = "themed-btn dark-green-bg" onClick={this.simulatedLogin}>Copy This Link</button>

</div>):
  (  <div className="">
  <p className="">Compare to your top 50 and get a similary score!</p>
  <button className = "themed-btn dark-green-bg" onClick={this.simulatedLogin}>Compare</button>

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
