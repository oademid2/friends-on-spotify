import React, { Component } from 'react';

import { Layout } from 'antd';

import './HomePage.scss';
import api from './api'
import Loading from './loading'

const {Footer} = Layout;

class HomePage extends Component{

  constructor(props){
    super(props)
    this.sharedSongs = [{
      name: 'Drake',
      your_rank: 1,
      their_rank: 4
    },
    {
      name: 'Migos',
      your_rank: 1,
      their_rank: 4
    },
    {
      name: 'Future',
      your_rank: 1,
      their_rank: 4
    }]

    this.state = {
      sharedSongs: [],
      sharedArtists: [],
      mySongs: [],
      theirSongs: [],
      myArtists: [],
      theirArtists: [],
      them: {},
      me: {},
      myUser: '',//'22nrtqre3rxxue6ekzqemxbba',//'ademidunt',
      theirUser: '',//'ademidunt' }
      email:'',
      display:'',
      screenw: null,
      isLoading: true,
    }
      //22nrtqre3rxxue6ekzqemxbba
    }
    async sleep(ms) {
      return await new Promise(resolve => setTimeout(resolve, ms));
    }
  componentDidMount() {
  
  
  }




  //<h6 className="sharedcontainer-header"> <a href="https://www.linkedin.com/in/kitan-ademidun/">Created By Kitan Ademidun</a></h6>

render(){
return (

  <div>

<div className ="main-container bg-color">


        <div class="bg-color">
        <p className="home-user-landing-title">Your music compared to {this.state.them.display_name? this.state.them.display_name : this.state.them.username}</p>
        <h1 className="home-landing-title">Friends On Spotify</h1>
        
        </div>
        <div class="shared-ranking-container bg-color">
        <div class="w3-half ranking-container">
          <div class="shared-artists-ranking">
          <h3 className="ranking-title">Your Shared Top Artists</h3>

          { 
            this.state.sharedArtists.map(item =>{
              if(item.isNull){
                return(
                  <div className="rank-card" key={item.id}>
                
                  <div className="rank-card-text">
                    <p class="rank-card-title">No more matches..not that similar I guess?</p>
                  
                  </div>
                  </div>
                )
              }else{
                if(this.state.screenw < 600){
              return(

                <div className="rank-card" key={item.id}>
              <img  src= {item.imgSrc} class="img-test">
               
               </img>
                <div className="rank-card-text">
                  <p class="rank-card-title">{item.name}</p>
                  <p class="rank-card-subtitle">Your #{item.myRank}</p>
                  <p class="rank-card-subtitle">Their #{item.theirRank}</p>
                </div>
                
                </div>
              )}else{
                return(

                  <div className="rank-card" key={item.id}>
              
                  <div className="rank-card-text">
                    <p class="rank-card-title-r">{item.name}</p>
                    <p class="rank-card-subtitle-r">Your #{item.myRank}</p>
                    <p class="rank-card-subtitle-r">Their #{item.theirRank}</p>
                  </div>
                  <img  src= {item.imgSrc} class="img-test">
                 
                 </img>
                  
                  </div>
                )
              }
              }
            })

          }

        </div>
        </div>
        <div class="w3-half ranking-container top-songs">
       
        <div class="shared-songs-ranking">
        <h3 className="ranking-title">Your Shared Top Songs</h3>

        {
            this.state.sharedSongs.map(item =>{
              if(item.isNull){
                return(
          
                   <div className="rank-card" key={item.id}>
                
                  <div className="rank-card-text">
                    <p class="rank-card-title">No more matches..not that similar I guess?</p>
                  
                  </div>
                  </div>
         
                )
              }else{
                return(
                  <div className="rank-card" key={item.id}>
                  <img  src= {item.imgSrc} class="img-test">
                 
                  </img>
                  <div className="rank-card-text">
                    <p class="rank-card-title">{item.name}</p>
                    <p class="rank-card-subtitle">Your #{item.myRank}</p>
                    <p class="rank-card-subtitle">Their #{item.theirRank}</p>
                  </div>
                  </div>
                )
                }
            })

          }
        </div>

        </div>
       
        <button className = "view-yours-btn" onClick={()=> this.props.history.push('/find/'+this.state.myUser)}>Go To/Get Your Own Link</button>
      </div>
      

      <Footer className ="footer">.</Footer>



</div>

</div>
//end of return
)
//end of render
}


//end of class

}

export default HomePage

/*

await api.getMyArtists().then((res) =>{
  console.log(res.data.items)
  let x = res.data.items
  let y = []
  for(var i=0;i<x.length;i++){
    y.push({
      'song': x.name,
      'key': x.id,
      'your_rank': 0,
      'their_rank': 0
    })
  }
 // shared = y
})

*/