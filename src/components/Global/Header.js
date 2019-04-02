import React, { Component } from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';

class GlobalHeader extends Component {
  render() {
    return (
      <Segment basic style={{ marginBottom: 0 }}>
        <Header size="large">
          <Icon name="linkify" />
          <Header.Content>
            EOSIO.TO
            <Header.Subheader>
              Signing Request Processing Service
            </Header.Subheader>
          </Header.Content>
        </Header>
      </Segment>
    );
  }
}

export default GlobalHeader;
