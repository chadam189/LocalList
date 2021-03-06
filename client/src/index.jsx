import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import renderDom from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import { PropsRoute, PrivateRoute } from './components/RouteHelpers';
import Home from './components/Home';
import Nav from './components/Nav';
import Signup from './components/Signup';
import Login from './components/Login';
import Logout from './components/Logout';
import CreateJob from './components/CreateJob';
import Profile from './components/Profile';
import JobDetails from './components/JobDetails';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };

    this.authenticate();

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.signup = this.signup.bind(this);
  }

  authenticate() {
    return axios.get('/api/auth')
      .then((res) => {
        if (res.data) {
          this.setState({
            user: res.data,
          });
        }
      });
  }

  login({ username, password }) {
    return axios.post('/api/login', { username, password })
      .then((res) => {
        this.setState({
          user: res.data,
        });
      })
      .catch((err) => {
        if (err && err.response && (err.response.status === 400 || err.response.status === 401)) {
          // flash message
          console.error(err.response.data);
        } else {
          throw err;
        }
      });
  }

  logout() {
    this.setState({
      user: null,
    });
    return axios.get('/api/logout');
  }

  signup({ username, password }) {
    return axios.post('/api/signup', { username, password })
      .then((res) => {
        this.setState({
          user: res.data,
        });
      })
      .catch((err) => {
        if (err && err.response && (err.response.status === 400)) {
          // flash message
          console.error(err.response.data);
        } else {
          throw err;
        }
      });
  }

  render() {
    return (
      <Router>
        <div>
          <Nav user={this.state.user} />
          <PropsRoute exact path="/" component={Home} user={this.state.user} />
          <PropsRoute path="/users/:id" component={Profile} user={this.state.user} />
          <PrivateRoute path="/create-job" component={CreateJob} user={this.state.user} />
          <PropsRoute path="/login" component={Login} user={this.state.user} login={this.login} />
          <PropsRoute path="/signup" component={Signup} user={this.state.user} signup={this.signup} />
          <PrivateRoute path="/logout" component={Logout} user={this.state.user} logout={this.logout} />
          <PropsRoute path="/jobs/:id" component={JobDetails} user={this.state.user} />
        </div>
      </Router>
    );
  }
}

renderDom.render(<App />, document.getElementById('app'));
