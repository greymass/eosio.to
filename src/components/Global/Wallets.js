import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';

class GlobalWallets extends Component {
  render() {
    return (
      <Segment attached="bottom" id="wallets">
        <Header>
          EEP-6 Compatible Wallets
          <Header.Subheader>
            The <a href="$">EEP-6 standard</a> is a communication layer any wallet can adopt. Encourage your favorite wallet developer to implement this standard or download one of the wallets below.
          </Header.Subheader>
        </Header>
        <p>No wallets available yet - this protocol is still under development.</p>
      </Segment>
    );
  }
}

export default GlobalWallets;
