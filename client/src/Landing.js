//Landing page

import React, { Component } from 'react';
import { Layout} from 'antd';
import {Button } from 'antd';

import './styles/Landing.scss'
import titleImg from './images/title.png'
import api from './api'

const { Header} = Layout;

class Landing extends Component{

  constructor(props){
    console.log(process.env.REACT_APP_TEST)

    super(props);
    this.viewProfile = this.viewProfile.bind(this)

  }
 
  componentDidMount() {

    if(localStorage.getItem("comparison"))localStorage.removeItem("comparison")

  }


  //function for user that wants to view their profile
  viewProfile(){

    console.log(api.getUser())
    //if user is logged in redirect to their profile.....
    if(api.userIsLoggedIn()){
      localStorage.setItem("mode-type", "landing-to-profile")
      return this.props.history.push("/viewprofile/usr/"+localStorage.getItem("username"))
    }
    //prompt them to login....
    api.simulatedLogin().then((res)=>{
      
        //set mode
        localStorage.setItem("mode-type", "landing-to-login")
        //open spotify log in window....
        window.location.href = res.data

    })
  }


render(){
 

return (

 <div className="landing-container">

        
      <div className="landing-title-container" >
      <a href="https://oademid2.github.io" target="_blank" className="my-link">created by kitan ademidun</a>

            <div>
           
            <h1 className="landing-title">FRIENDS ON SPOTIFY V.2</h1>
            <p className="landing-caption">Find out which of your friends have the closest music taste to you 👀</p>
            <img className ="landing-img" src={titleImg}></img><br></br>
            <p className="landing-caption"> How it works? When you get your top plays you get a link you can share with friends. By clicking a friends link you can sign in an automatically compare your listens that you have in common. </p>
            <Button onClick={this.viewProfile} className = "themed-btn">Get Started</Button>
            
       
            </div>
       
      </div>

    </div>




//end of return
//<Button href="/cmp/demo" className = "themed-btn">view demo</Button>
)

//end of render
}

//end of class
};



export default Landing
