//PAGE FOR SEEING USER'S PROFILES


import React, { Component, createElement } from 'react';
import { message} from 'antd';


import './styles/Shared.scss'
import api from './api'
import loadImg from './images/loading.gif'

class Shared extends Component{

  constructor(props){
    
    super(props);

    this.simulatedLogin = this.simulatedLogin.bind(this);
    this.copyLink = this.copyLink.bind(this);
    this.viewProfile = this.viewProfile.bind(this);
    this.page_type = null;

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

      //get page type
      let mode_type = localStorage.getItem('mode-type')
      let mode_data= localStorage.getItem('mode-data')

      //don't need these anymore....
      localStorage.removeItem("mode-type")
      localStorage.removeItem("mode-data")

      //get the parameters so we know what to do..
      let tkn = window.location.href.split("?token=")[1]
      let pageId = window.location.href.split("viewprofile/usr/")[1]
      this.setState({pageId: pageId})

      //CASE 1: User is brand new and came from landing
      if(mode_type == "landing-to-login")
        return this.createAndSetNewUser(tkn)
      
      //CASE 2: User is logged on and came from landing
      else if( mode_type == "landing-to-profile" )
        return this.setActiveUser(pageId)

      //CASE 3: User came from a compare request and is now logged in
      else if(mode_type == "compare" && tkn){
        this.createAndSetNewUser(tkn)
        window.open("/compare/user/"+mode_data)
      }

      //CASE 4: link was visited straight from url....
      else
        return this.setActiveUser(pageId)


  
  }

setActiveUser(pageId){

    //pull up user profile....
    return api.loadProfile(pageId).then((result)=>{

      //set active user..... //TODO: set local storage
      this.setState({
          user:{
            display_name:result.data.display_name,
            username: result.data.username
          }
      })

      //get information of user to display....
      this.setState({sharedArtists: this.topRankingFromDict(result.data.topArtists)})
      this.setState({sharedSongs: this.topRankingFromDict(result.data.topSongs)})

    })

}

createAndSetNewUser(tkn){

        //get the user from spotify....
        api.getProfile(tkn).then((result)=>{
      
          //create a new user with spotify public info....
          let _user = {
              display_name: result.data.display_name,
              username: result.data.id
          }
  
          //save the user locally for next login....
          localStorage.setItem("username",result.data.id )
  
          //save user information locally...
          this.setState({pageId: result.data.id})
          this.setState({user:_user})
          
          //get the artist rankings
          api.getSpotifyTopArtists(tkn).then((result)=>{
  
            //set user artists....
            this.setState({allArtists:this.resultsToRankingDictionary(result.data.items)})
            this.setState({sharedArtists: this.topRankingFromDict(this.state.allArtists)})
  
            //get user songs....
            api.getSpotifyTopSongs(tkn).then((result)=>{
              
              //set user songs
              this.setState({allSongs:this.resultsToRankingDictionary(result.data.items)})        
              this.setState({sharedSongs: this.topRankingFromDict(this.state.allSongs)})
      
              //set this to the user
              _user.topArtists = this.state.allArtists;
              _user.topSongs = this.state.allSongs;
            
              //save this as a new user to database
              api.createprofile(_user).then((res)=>{

                //set local storage...
                localStorage.setItem("username", _user.username )
                localStorage.setItem("page-type", "active-user" )

              })
  
        })
  
  
      })
        })
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

      window.location.href = res.data

    })

 }

 compare = ()=>{

      //set local storage...
      localStorage.setItem("mode-type", "compare")
      localStorage.setItem("mode-data", this.state.pageId)

      //if user is already logged in take them directly to compare page....
      if(api.userIsLoggedIn()) window.open("/compare/user/"+this.state.pageId)
      
      //otherwise log in....
      else api.simulatedLogin().then((res)=>{ window.location.href = res.data})
  

 }

 //create shareable link
copyLink = () => {
  

  let link = document.getElementsByClassName("sharing-link")[0]
  let textfield = document.createElement('textarea')
  textfield.innerText = link.textContent;
  document.body.appendChild(textfield)
  textfield.select()
  document.execCommand('copy')
  console.log("copied")
  message.success('Message copied');
  textfield.remove()
  


 };

 viewProfile = () =>{

  if(api.userIsValid()){
    window.open("/viewprofile/usr/"+localStorage.getItem("username"), "_blank")
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

              {api.userIsValid()&&(this.state.pageId == api.getUser())?
              <div className= "ranking-section-title">Your Top Artists</div>:
              <div className= "ranking-section-title">Their Top Artists</div>}
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
            {api.userIsValid()&&(this.state.pageId == api.getUser())?
              <div className= "ranking-section-title">Your Top Songs</div>:
              <div className= "ranking-section-title">Their Top Songs</div>}
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

                    (  
                    
                        <div className="">

                          <p className="">Share your top 5 with friends and they can get a similary score of your top 50!</p>
                          <p className="sharing-link"><a href="">{api.HOST}/viewprofile/usr/{localStorage.getItem("username")}</a></p>
                          <a class= "themed-btn dark-green-bg" href={"https://twitter.com/intent/tweet?text=Check+out+my+top+listens+on+Spotify+and+reply+to+this+tweet+with+our+percentage+score+of+our+similar+our+music+is%3A+"+api.HOST+"/viewprofile/usr/"+localStorage.getItem("username")} target="_blank">share</a>
                          <button className = "themed-btn dark-green-bg" onClick={this.copyLink}>Copy This Link</button>
                          
                          {api.userIsValid()?<button onClick={()=> api.reset(this.props) } className = "themed-btn">logout</button> : <span></span>}

                        </div>
                    ):
                
                
                    (  <div className="">
                          <p className="">Compare to your top 50 👀</p>
                          <button className = "themed-btn dark-green-bg" onClick={this.compare}>See similarities</button>
              
                          {api.userIsValid()?<span><button onClick={()=> api.reset(this.props) } className = "themed-btn">logout</button> <button onClick={()=> api.viewProfile } className = "themed-btn">view yours</button></span> :
                          <button onClick={this.viewProfile} className = "themed-btn">view yours</button> }


                        </div>
                    )
                  }

                
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