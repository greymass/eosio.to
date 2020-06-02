import React, { Component } from 'react';
import { Card, Header, Image, Segment } from 'semantic-ui-react';

class GlobalWallets extends Component {
  render() {
    return (
      <Segment attached="bottom" id="wallets" padded>
        <Header as="h2" size="large">
          ESR Protocol Compatible Wallets
          <Header.Subheader>
            The <a href="https://github.com/eosio-eps/EEPs/blob/master/EEPS/eep-7.md">ESR standard</a> is a communication layer any wallet can adopt. Encourage your favorite wallet developer to implement this standard or download one of the wallets below.
          </Header.Subheader>
        </Header>
        <Card
          as="a"
          href="https://greymass.com/en/anchor"
          raised
        >
          <Image src="https://greymass.com/static/d7bb592f9e38d258e4c916be2fbf3c6e/f7b46/anchor.png" />
          <Card.Content>
            <Card.Header>Anchor</Card.Header>
            <Card.Meta>
              Requires v1.0.3+
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
