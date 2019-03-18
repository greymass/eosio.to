import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';

class ActionRequestDetailBlockchain extends Component {
  render() {
    const {
      callback,
    } = this.props;
    return (
      <Segment>
        <Header size="small">
          Callback
        </Header>
        {(callback)
          ? (
            <React.Fragment>
              <p>
                A callback URL exists within this signing request. Upon completion, clients will issue a callback to the following URL.
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
