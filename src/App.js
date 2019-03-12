import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ActionContainer from './containers/action'
import './semantic/dist/semantic.min.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/:uri" component={ActionContainer}/>
        </div>
      </Router>
    )
  }
}
