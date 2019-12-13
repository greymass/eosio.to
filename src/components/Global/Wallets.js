import React, { Component } from 'react';
import { Card, Header, Image, Segment } from 'semantic-ui-react';

class GlobalWallets extends Component {
  render() {
    return (
      <Segment attached="bottom" id="wallets" padded>
        <Header as="h2" size="large">
          ESR Compatible Wallets
          <Header.Subheader>
            The <a href="https://github.com/eosio-eps/EEPs/blob/master/EEPS/eep-7.md">ESR standard</a> is a communication layer any wallet can adopt. Encourage your favorite wallet developer to implement this standard or download one of the wallets below.
          </Header.Subheader>
        </Header>
        <Card
          as="a"
          href="https://github.com/greymass/eos-voter/releases/tag/v1.0.0-rc1"
          raised
        >
          <Image src="https://i.imgur.com/U972tzQ.png" />
          <Card.Content>
            <Card.Header>Anchor BETA</Card.Header>
            <Card.Meta>
              Requires v1.0.0-RC1+
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            Maintained by
            {' '}
            <a href="https://greymass.com">
              Greymass
            </a>
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

export default GlobalWallets;
