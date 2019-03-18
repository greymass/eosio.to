import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';

class ActionRequestDetailBlockchain extends Component {
  render() {
    const {
      chain,
      chainId,
    } = this.props;
    if (!chain) return false;
    return (
      <Segment>
        <Header size="small">
          Blockchain
        </Header>
        <span>This transaction was created with the intention of using the following blockchain.</span>
        <Header block color="blue">
          {chain}
          <Header.Subheader>
            {chainId}
          </Header.Subheader>
        </Header>
      </Segment>
    );
  }
}

export default ActionRequestDetailBlockchain;
