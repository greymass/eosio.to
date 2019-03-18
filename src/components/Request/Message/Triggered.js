import React, { Component } from 'react';
import { Header, Icon, Label, Segment } from 'semantic-ui-react';

class ActionMessageTriggered extends Component {
  render() {
    const {
      loading,
      uriParts,
    } = this.props;
    if (loading) return false;
    return (
      <Segment stacked>
        <Header size="large">
          <Icon name="info circle" style={{ verticalAlign: 'top' }} />
          <Header.Content>
            A Signing Request has been triggered.
            <Header.Subheader style={{ padding: '1em 0' }}>
              <Label as='a' href={`eosio:${uriParts[1]}`}>
                eosio:{uriParts[1]}
              </Label>
            </Header.Subheader>
            <Header.Subheader>
              Not working? Make sure you have an
              {' '}
              <a href="#wallets">
                EEP-6 compatible wallet
              </a>
              {' '}
              installed.
            </Header.Subheader>
          </Header.Content>
        </Header>
      </Segment>
    );
  }
}

export default ActionMessageTriggered;
