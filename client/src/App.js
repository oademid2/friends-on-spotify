import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';


import Landing from './Landing';
import Profile from './Profile';
import Comparison from './Comparison';



function App() {

  return (
   
    <div className="App">

      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
     
      <Router >
     
     <Switch>
     
     <Route path='/cmp/demo' component={Comparison}/>
     <Route path='/viewprofile' component={Profile}/>
       <Route path='/compare' component={Comparison}/>
       <Route path='/' component={Landing}/>
       
     </Switch>
    </Router>
    </div>
  );
}

export default App;


/*
       <Route path='/friend' component={HomePage}/>
       <Route path='/find' component={Shared}/>
       <Route path='/about' component={About}/>
       <Route path='/ERROR' component={Error}/>

*/