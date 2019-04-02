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
      <Segment color="blue" inverted stacked>
        <Header size="large">
          <Icon name="info circle" />
          <Header.Content>
            A Signing Request has been triggered.
            <Header.Subheader style={{ color: '#fff' }}>
              Not working? Make sure you have an
              {' '}
              <a href="#wallets" style={{ color: '#fff', textDecoration: 'underline' }}>
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
