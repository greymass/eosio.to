import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';

class ActionRequestDetailBlockchain extends Component {
  render() {
    const {
      callback,
    } = this.props;
    return (
      <Segment attached="bottom">
        <Header size="small">
          Callback
        </Header>
        {(callback)
          ? (
            <React.Fragment>
              <p>
                A callback URL exists within this signing request. The URL shown below is intended to be loaded after the transaction has been signed.
              </p>
              <p>
                {callback}
              </p>
            </React.Fragment>
          )
          : (
            <p>This transaction does not request a callback after completion.</p>
          )
        }
      </Segment>
    );
  }
}

export default ActionRequestDetailBlockchain;
