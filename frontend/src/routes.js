import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './components/Main';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/signup" component={Signup} />
    </Switch>
  </Router>
);

export default Routes;
