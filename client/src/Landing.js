import React, { Component } from 'react';
import { Layout} from 'antd';
import {Button } from 'antd';

import './Landing.scss'
import titleImg from './title.png'
import api from './api'


const { Header} = Layout;




class Landing extends Component{

  constructor(props){
    super(props);
    this.viewProfile = this.viewProfile.bind(this)

  }
 
  componentDidMount() {
     
  let b = this.c (5,6,7,8,0); 
  console.log(b);
    if(localStorage.getItem("comparison"))localStorage.removeItem("comparison")
  }

c (...e)
  {
    console.log(e)
  
      return e; 
  }


  viewProfile(){
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

 <div className="landing-container">

        
      <div className="landing-title-container" >
      <a href="https://oademid2.github.io" className="my-link">created by kitan ademidun</a>

            <div>
           
            <h1 className="landing-title">FRIENDS ON SPOTIFY</h1>
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
