import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';

class GlobalWallets extends Component {
  render() {
    return (
      <Segment attached="bottom" id="wallets" padded>
        <Header as="h2" size="large">
          EEP-7 Compatible Wallets
          <Header.Subheader>
            The <a href="$">EEP-7 standard</a> is a communication layer any wallet can adopt. Encourage your favorite wallet developer to implement this standard or download one of the wallets below.
          </Header.Subheader>
        </Header>
        <p>No wallets available yet - this protocol is still under development.</p>
      </Segment>
    );
  }
}

export default GlobalWallets;
