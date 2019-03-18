import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import RequestContainer from './containers/request'
import './semantic/dist/semantic.min.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/:uri" component={RequestContainer}/>
        </div>
      </Router>
    )
  }
}
