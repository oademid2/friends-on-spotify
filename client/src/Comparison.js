import React, { Component, createElement } from 'react';


import api from './api'
//import { Progress } from 'antd';

import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import './Comparison.scss'

//import PercentageCircle from 'reactjs-percentage-circle';

const circleStyles = {
  // Customize the root svg element
  root: {},
  // Customize the path, i.e. the "completed progress"
  path: {
    stroke: `rgba(21,112,53)`,
    strokeLinecap: 'butt',
    transition: 'stroke-dashoffset 0.5s ease 0s',
  },
  // Customize the circle behind the path, i.e. the "total progress"
  trail: {
    stroke: 'rgba(29,29,29,0.7)',
    strokeLinecap: 'butt',
    transform: 'rotate(0.25turn)',
    transformOrigin: 'center center',
  },

  text: {
    fill: 'rgba(255,255,255)',
    fontSize: '16px',
  },


}

class Shared extends Component{

  constructor(props){
    super(props);
   
    this.simulatedLogin = this.simulatedLogin.bind(this);
    this.viewAll = this.viewAll.bind(this)
    
    this.timerID = 0;
    this.timerID2 = 0;
    this.state = { 
      user:{
        display_name:'',
        username: ''
      },
      demo: '',
      them:{},
      results: 3,
      me: {},
      target_dashboard: {
        p: 78,
        a: 7,
        b: 7
      },
      percent: 0,
      artistsNum: 0,
      songsNum: 0,
      score:0,
      sharedArtists:[
        {name:"Loading rtist",
          id:"AA",
          rank : 1,
          imgSrc: "https://images.app.goo.gl/1CVfeqYHyEtu8MW17"},
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
    
    let viewingUser = {}
    let viewedUser = {}
    let themId = localStorage.getItem("comparison")
    let myId = localStorage.getItem("username")

    let demo = window.location.href.split("/compare/")[1]
    if(demo == "demo"){
      this.setState({demo: demo})
      themId = "ademidunt"
      myId = "22nrtqre3rxxue6ekzqemxbba"
    }else{

      localStorage.removeItem("comparison")
      console.log(themId, myId)
    }
    
    

    api.loadFriend(myId).then((usr1)=>{
      viewingUser = usr1;
      api.loadFriend(themId).then((usr2)=>{
        viewedUser = usr2;
        this.setState({them: viewedUser})
        this.setState({me: viewingUser})
        console.log(viewedUser.data.topSongs);
        this.setState({sharedArtists:
          this.getShared(viewingUser.data.topArtists, viewedUser.data.topArtists)
        })
        this.setState({sharedSongs:
          this.getShared(viewingUser.data.topSongs, viewedUser.data.topSongs)
          
        })

        console.log(this.state.sharedArtists.length)

        this.setState({target_dashboard: {
          p: 70,
          a: this.state.sharedArtists.length,
          b: this.state.sharedSongs.length
        }

        })

        this.timerID = setInterval(() => this.tick2('p', 'percent'), 10);
        this.timerID2 = setInterval(() => this.tick2('a','artistsNum'), 100);
        this.timerID2 = setInterval(() => this.tick2('b','songsNum'), 100);
        

      })
    })

  }

  tick() {

    if(this.state.percent >= 80){
      this.setState({
        percent: 80
      });
      clearInterval(this.timerID)
    }
    this.setState({
      percent: this.state.percent >= 80? 80 : this.state.percent+1
    });
  }

  tick2(tgt, dsp) {
    let X = this.state.target_dashboard[tgt];
    if(tgt == 'a')console.log(this.state[dsp])
    if(this.state[dsp] >= X){
      this.setState({
        dsp: X
      });
      clearInterval(this.timerID2)
    }

    this.setState({
     [dsp] : this.state[dsp] >= X? X : this.state[dsp]+1
    });
  }

  tick3() {
    let X = this.state.target_dashboard.a;
    console.log(X)
    if(this.state.artistsNum >= X){
      this.setState({
        artistsNum: X
      });
      clearInterval(this.timerID2)
    }
    this.setState({
      'artistsNum': this.state.artistsNum >= X? X : this.state.artistsNum+1
    });
  }


getShared(myTop, theirTop){
    let sharedList = []
    console.log(myTop)
    console.log(theirTop)
   
    for (const [key, value] of Object.entries(myTop)) {
      if(theirTop[key]){
        sharedList.push({
          'id': value['id'],
          'name': value['name'],
          'myRank': value['rank'],
          'theirRank': theirTop[key]['rank'],
          'imgSrc': value['imgSrc']
        })
      }
      //if(sharedList.length == 3)break
    }

    while(sharedList.length <3){
      sharedList.push({'id':-1*sharedList.length})
    }

    return sharedList
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


 simulatedLogin = ()=>{
   console.log("click")
   //cookie
   if(api.userIsValid()){   
   
    this.props.history.push("/viewprofile/usr/"+api.getUser())
    return

}
  api.simulatedLogin().then((res)=>{
    console.log(res.data)
    console.log('redirecting through spotify....')
    window.location.href = res.data
  })
 }

 viewAll = ()=>{
  this.state.results == 3? this.setState({results: 50}): this.setState({results: 3})
 }




render(){
 
return (
//           <Progress strokeColor="blue"  format={percent => `${percent} %`} width={100} type="circle" percent={this.state.percent} />
// <CircularProgressbar value={60} text={`60%`} styles={circleStyles} />
<div className="comparison-container">

  <div className="profile-title-container" >
  <a href="https://www.linkedin.com/in/kitan-ademidun-881330149/" className="my-link">created by kitan ademidun</a>


{this.state.demo == "demo"? 
<p className="profile-title-subcaption"> Demo comparison of two users</p>
:
<p className="profile-title-subcaption"> Comparison To {this.state.them.display_name? this.state.them.display_name : this.state.them.username}</p>

}
    <h1 className="profile-landing-title">FRIENDS ON SPOTIFY</h1>
  
      <div className="ranking-container">
        <div className="dashboard-section">
          <div class="data-section">
          <span className="data-card-title circle-title">Music Taste Similarity</span>
          <div className="circle-card">
          <CircularProgressbar value={this.state.percent} text={`${this.state.percent}%`} styles={circleStyles} />

          <button onClick={this.viewAll}
           className="themed-btn shared-theme-btn">
            {this.state.results == 3? <span>view all</span>: <span>collaspe</span>}
            </button>
          
            </div>
            
          </div>

        <div class="data-section">
          <div class="data-card">
            <span className="data-card-title">Total Shared Top 50 songs</span>
            <span className="data-card-number">{this.state.songsNum}</span>
          </div>
          <div class="data-card">
            <span className="data-card-title">Total Shared Top 50 Artists</span>
            <span className="data-card-number"> {this.state.artistsNum}</span>
          </div>
        </div>
              
     
      </div>

      <div class="tiles">
      <div className="shared-section">
      <div className= "ranking-section-title">Your Shared Faves</div>
      <p className= "shared-section-sub">artists</p>


      { //Array for artists
      this.state.sharedArtists.slice(0,this.state.results).map(item =>{
        if(item.isNull){
          return( <div key={item.id}></div> )
        }else{return(

          <div className="shared-card" key={item.id}>
          <img  src= {item.imgSrc} class="shared-card-img"></img>
          <div className="shared-card-text">
            <p class="shared-card-title">{item.name}</p>
            <p class="shared-card-subtitle">Your #{item.myRank}</p>
            <p class="shared-card-subtitle">Their #{item.theirRank}</p>
          </div>
          </div>
        )}//end array
      })}
    </div>

  
    <div className="shared-section">
    <p className= "shared-section-sub">songss</p>
    


    { 
      this.state.sharedSongs.slice(0,3).map(item =>{
          if(item.isNull){
            return(
              <div key={item.id}></div>
            )
          }else{return(
            <div className="shared-card" key={item.id}>
            <img  src= {item.imgSrc} class="shared-card-img"></img>
            <div className="shared-card-text">
              <p class="shared-card-title"> {item.name}</p>
              <p class="shared-card-subtitle">Your #{item.myRank}</p>
              <p class="shared-card-subtitle">Their #{item.theirRank}</p>
            </div>
            </div>
          )}})
    }
    </div>

    </div>
    <button onClick={this.simulatedLogin} className="themed-btn shared-theme-btn">view your top 5</button>
  </div>


    
  </div>


</div>



//end of return
)
//end of render
}
//end of class
};

export default Shared
