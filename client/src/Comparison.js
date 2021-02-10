//PAGE FOR SEEING SCORE COMPARISONS

import React, { Component, createElement } from 'react';


import api from './api'
//import { Progress } from 'antd';

import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import './styles/Comparison.scss'
import loadImg from './images/loading.gif'

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

      return{ name:"Loading", id: _id, rank : 0, imgSrc: loadImg }

  }
 
  componentDidMount() {
    
    
    //parse the url....
    let usrcomp = window.location.href.split("/compare/user/")[1]
    let themId = localStorage.getItem("comparison") || usrcomp;
    let demo = window.location.href.split("/cmp/")[1]



    //CASE 1: This is just a demo, if it is a demo preset to two users...
    if(demo == "demo"){
        this.setState({demo: demo})
        themId = "ademidunt"
        myId = "22nrtqre3rxxue6ekzqemxbba"
        
    }


    //CASE 2: not a demo -- if user is not logged in they'll have to log in...
    else if(!api.userIsLoggedIn()){

      //set local storage so after we redirect we know where we left off...
      localStorage.setItem("mode-type", "compare")
      localStorage.setItem("mode-data",themId)

      console.log("***")
      //login
      return api.simulatedLogin().then((res)=>{ window.location.href = res.data})

    }


    //CASE 3: user is logged in....
    //load and compare profiles....  
    let myId = localStorage.getItem("username")
    this.loadAndSetComparison(myId, themId)
    
  }



  //FUNCTION for loading profiles and comparing the simlarities...
  loadAndSetComparison(myId, themId){

    let viewingUser = {}
    let viewedUser = {}

    api.loadFriend(myId).then((usr1)=>{
      
      //this user will be the user that is viewing....
      viewingUser = usr1.data;

      //get the user we want to compare ourselves to....
      api.loadFriend(themId).then((usr2)=>{

        //this is the user that is viewed....
        viewedUser = usr2.data;

        //if the user does not exist...//TODO: catch errors
        if(!viewedUser){
          this.props.history.push('/')
          return
        }

        //If the user exists set the info for both users...
        this.setState({them: viewedUser})
        this.setState({me: viewingUser})

        this.setState({sharedArtists:
          this.getShared(viewingUser.topArtists, viewedUser.topArtists)
        })
    
        this.setState({sharedSongs:
          this.getShared(viewingUser.topSongs, viewedUser.topSongs)
          
        })
        
        //get the score...
        this.setState({score: this.similarityScore(this.state.sharedArtists.length, this.state.sharedSongs.length)})

        //set the info for the dashboard...
        this.setState({target_dashboard: {
            p: this.state.score,
            a: this.state.sharedArtists.length,
            b: this.state.sharedSongs.length
        }

        })

        //set animations for the dashboard....
        this.timer["p"] = setInterval(() => this.animate('p', 'percent', 'p'), 10);
        this.timer["a"] = setInterval(() => this.animate('a','artistsNum','a'), 100);
        this.timer["s"] = setInterval(() => this.animate('b','songsNum','s'), 100);
        

      })
    })
  }


  //Function for caculating similarity scores..
  similarityScore(numSharedArtists, numSharedSongs){

    //init score to 0
    let score = 0;
    //get sum of the amount of artists and songs they have in common
    var sum = numSharedArtists + numSharedSongs;

    //calculate the score... 8% per similarity, more than 10 similar  =  0.7% per shared
    //>20 shared = 95%, > 30 = ~100%
    if(sum >30) score = 99.99
    else if(sum >20) score = 95
    else if(sum > 10) score = 10*8 + (sum-10)*(2/3)
    else score = sum * 8;

    return Math.round(score)

    
  }


  //Function for anumating the similarity scores...
  animate(tgt, dsp, _id) {

    //score we want to show
    let X = this.state.target_dashboard[tgt];

    //when we reach the metric we want to show
    if(this.state[dsp] >= X){

      //make this the value we want
      this.setState({
        dsp: X
      });
      clearInterval(this.timer[_id])
    }

    //update value displayed...
    this.setState({

        //slowly increase the value showed until we reach our target...
      [dsp] : this.state[dsp] >= X? X : this.state[dsp]+1

    });
  }


//function for getting what values are shared...
getShared(myTop, theirTop){

    
    let sharedList = []
   
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

    }

    return sharedList
}

//function for turning list of values to dictionary for viewing
resultsToRankingDictionary(_data){
  let x = _data
  let y = {}

  for(var i=0;i<x.length;i++){

    let img = x[i].album
    let creator = null;

    if(!img) img = x[i]
    if(x[i].artists)creator = x[i].artists[0].name;
    else creator = null;

    y[x[i].id] = {
        'name': x[i].name,
        'id': x[i].id,
        'rank': i+1,
        'imgSrc': img.images[0].url,
        'track_creator': creator
    }

  }
  return y;
}


 simulatedLogin = ()=>{

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

<div className="comparison-container">

  <div className="profile-title-container" >
  <a href="https://oademid2.github.io" target="_blank" className="my-link">created by kitan ademidun</a>


    {this.state.demo == "demo"? 

        <p className="profile-title-subcaption"> Demo comparison of two users</p>
        :<p className="profile-title-subcaption"> Comparison To {this.state.them.display_name? this.state.them.display_name : this.state.them.username}</p>
   
   }

    <h1 className="profile-landing-title">FRIENDS ON SPOTIFY</h1>
  
      <div className="ranking-container">

          <div className="dashboard-section">

              <div class="data-section">

                <span className="data-card-title circle-title">Music Taste Similarity</span>

                <div className="circle-card">

                  <CircularProgressbar value={this.state.percent} text={`${this.state.percent}%`} styles={circleStyles} />

                  <button onClick={this.viewAll} className="themed-btn shared-theme-btn">
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

        {this.state.demo == "demo"?  <span>try it out</span> : <span>View Your Top 5</span>}
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
