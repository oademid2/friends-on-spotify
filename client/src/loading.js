


import React, { Component } from 'react';

import { Layout } from 'antd';
import { Spin } from 'antd';
//import Spin from 'antd/es/spin';
import 'antd/es/spin/style/css';

import './HomePage.scss';
import api from './api'

const { Header, Footer, Sider, Content } = Layout;

class Loading extends Component{

    constructor(props){
        super(props)
    }

    componentDidMount(){
        /*setTimeout(()=>{
            this.props.history.push('/') //change to href
            //window.location.reload();
          }, 10000)*/
         
    }

    render(){
        return (

            <div className="landingcontainer">  
            <div className="loading-center">
            <h1 className="landing-title">FREINDS ON SPOTIFY</h1>
            <h1 className="landing-title">LOADING....</h1>
            <div className="spin">
            <Spin size="large" />
            </div>


            </div>
            </div>
        
      
      
      
        )
        }



}

export default Loading