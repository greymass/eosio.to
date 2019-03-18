import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';

class GlobalFooter extends Component {
  render() {
    return (
      <Segment basic style={{ padding: '2em 0 '}} textAlign="center">
        <Header size="small">
          eosio.to
          <Header.Subheader>
            a <a href="https://greymass.com">greymass</a> project
          </Header.Subheader>
        </Header>
      </Segment>
    );
  }
}

export default GlobalFooter;
