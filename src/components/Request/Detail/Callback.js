import React, { Component } from 'react';
import { Form, Header, Label, Segment } from 'semantic-ui-react';

class ActionRequestDetailBlockchain extends Component {
  render() {
    const {
      callback,
    } = this.props;
    if (!callback || !callback.url) {
      return (
        <Segment attached="bottom">
          <Header size="small">
            Callback
          </Header>
          <p>This transaction does not request a callback after completion.</p>
        </Segment>
      );
    }
    const url = new URL(callback.url);
    const hasTx = (callback.url.includes('{{tx}}'));
    const hasBn = (callback.url.includes('{{bn}}'));
    const hasSig = (callback.url.includes('{{sig}}'));
    return (
      <Segment attached="bottom">
        <Header size="small">
          Callback
        </Header>
          <Form>
            <p>
              A callback URL exists within this signing request. The URL shown below is intended to be loaded after the transaction has been signed.
            </p>
            <Form.Field>
              <label>Callback URL</label>
              <Form.Input value={callback.url} />
            </Form.Field>
            <p>
              {(callback.background)
                ? 'This callback URL will be executed in the background with no user interaction.'
                : 'This callback URL will be opened after the transaction has been completed in the users default web browser.'
              }
            </p>
            <p>
              The following public information will be transmitted in the callback:
            </p>
            <p>
              {(hasTx) ? (
                <Label>
                  Transaction ID
                </Label>
              ) : false}
              {(hasBn) ? (
                <Label>
                  Block Number
                </Label>
              ) : false}
              {(hasSig) ? (
                <Label>
                  Signature
                </Label>
              ) : false}
              {(!hasTx && !hasBn && !hasSig) ? 'None' : false}
            </p>
          </Form>
      </Segment>
    );
  }
}

export default ActionRequestDetailBlockchain;
