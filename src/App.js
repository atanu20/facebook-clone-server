import React from 'react';

import { Switch, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
// import Topbar from './component/topbar/Topbar';
import Register from './pages/Register';
import Login from './pages/Login';
import PostDetails from './pages/postdetails/PostDetails';
import './App.css';
import Friends from './pages/Friends';
import Messanger from './pages/messenger/Messanger';
import Followers from './pages/Followers';
import Notification from './pages/notification/Notification';
import Error from './pages/Error'
const App = () => {
  return (
    <>
   
    <Switch>
      <Route exact path ="/" component={Home}/>
      <Route exact path="/profile/:id" component={Profile}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/postdetails/:postid" component={PostDetails} />
      <Route exact path="/friends" component={Friends}/>
      <Route exact path="/messanger" component={Messanger}/>
      <Route exact path="/followers" component={Followers}/>
      <Route exact path="/messanger/:con_id" component={Messanger}/>
      <Route exact path="/notification" component={Notification} />
      <Route component={Error} />
    </Switch>
    
     

    </>
  )
}

export default App;



