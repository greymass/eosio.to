import React, { Component } from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';

class GlobalHeader extends Component {
  render() {
    return (
      <Segment attached="top" inverted color="blue">
        <Header size="large">
          <Icon name="linkify" />
          <Header.Content>
            eosio.to
            <Header.Subheader style={{ color: '#ffffff' }}>
              Signing Request Processing Service
            </Header.Subheader>
          </Header.Content>
        </Header>
      </Segment>
    );
  }
}

export default GlobalHeader;
