import React, { Component, createElement } from 'react';


import api from './api'
//import { Progress } from 'antd';

import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import './Comparison.scss'
import loadImg from './loading.gif'

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
    this.timer={
      a:'',
      b:'',
      p: ''
    }
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
    
    let viewingUser = {}
    let viewedUser = {}
    let usrcomp = window.location.href.split("/compare/user")[1]
    let themId = localStorage.getItem("comparison") || usrcomp;
    let myId = localStorage.getItem("username")

    let demo = window.location.href.split("/cmp/")[1]
   
    if(demo == "demo"){
      this.setState({demo: demo})
      themId = "ademidunt"
      myId = "22nrtqre3rxxue6ekzqemxbba"
      console.log(demo)
    }else{

      localStorage.removeItem("comparison")
      console.log(themId, myId)
    }
    
    

    api.loadFriend(myId).then((usr1)=>{
      viewingUser = usr1.data;
      api.loadFriend(themId).then((usr2)=>{
        viewedUser = usr2.data;
        console.log(viewedUser)
        console.log(viewedUser)
        if(!viewedUser){
          this.props.history.push('/')
          return
        }
        this.setState({them: viewedUser})
        this.setState({me: viewingUser})
        console.log(viewedUser.topSongs);
        this.setState({sharedArtists:
          this.getShared(viewingUser.topArtists, viewedUser.topArtists)
        })
        this.setState({sharedSongs:
          this.getShared(viewingUser.topSongs, viewedUser.topSongs)
          
        })

        
        let x =  this.state.sharedArtists.length;
        let y =this.state.sharedSongs.length;
        let aP = parseInt(x/3,10);
        let aS = parseInt(y/5,10);

        if(aP == 0) this.state.score = 0;
        else if(0 <aP<=5)this.state.score = 50 +aP*10
        else if(aP<6.1)this.state.score = 95
        else this.state.score = 99
      
        this.state.score *= 0.9 +  parseInt(y/10,10)*0.1;


        this.setState({target_dashboard: {
          p: this.state.score,
          a: this.state.sharedArtists.length,
          b: this.state.sharedSongs.length
        }

        })

        this.timer["p"] = setInterval(() => this.animate('p', 'percent', 'p'), 10);
        this.timer["a"] = setInterval(() => this.animate('a','artistsNum','a'), 100);
        this.timer["s"] = setInterval(() => this.animate('b','songsNum','s'), 100);
        

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



  animate(tgt, dsp, _id) {
    let X = this.state.target_dashboard[tgt];
    if(tgt == 'a')console.log(this.state[dsp])
    if(this.state[dsp] >= X){
      this.setState({
        dsp: X
      });
      clearInterval(this.timer[_id])
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

    /*while(sharedList.length <3){
      sharedList.push({'id':-1*sharedList.length})
    }*/
    console.log("shared", sharedList)
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
  <a href="https://oademid2.github.io" target="_blank" className="my-link">created by kitan ademidun</a>


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

{this.state.sharedArtists.length>0?
<div>
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
  </div>:
  <p>No Shared Artists</p>


}

      
    </div>

  
    <div className="shared-section">
    <p className= "shared-section-sub">songss</p>
    
    {this.state.sharedSongs.length>0?
<div>

    { 
      this.state.sharedSongs.slice(0,this.state.results).map(item =>{
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
    </div>:
    <p> No Shared Songs</p>
}
    </div>

    </div>
    
    <button onClick={this.simulatedLogin} className="themed-btn shared-theme-btn">
      {this.state.demo == "demo"?  <span>get started</span> : <span>Your Top 5</span>}
    </button>
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
