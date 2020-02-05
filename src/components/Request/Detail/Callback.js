import React, { Component } from 'react';
import { Form, Header, Label, Segment } from 'semantic-ui-react';

class ActionRequestDetailCallback extends Component {
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
    /** The first signature. */
    const hasSig = callback.url.includes('{{sig}}');
    /** Transaction ID as HEX-encoded string. */
    const hasTx = callback.url.includes('{{tx}}');
    /** Block number hint (only present if transaction was broadcast). */
    const hasBn = callback.url.includes('{{bn}}');
    /** Signer authority, aka account name. */
    const hasSa = callback.url.includes('{{sa}}');
    /** Signer permission, e.g. "active". */
    const hasSp = callback.url.includes('{{sp}}');
    /** Reference block num used when resolving request. */
    const hasRbn = callback.url.includes('{{rbn}}');
    /** Reference block id used when resolving request. */
    const hasRid = callback.url.includes('{{rid}}');
    /** The originating signing request packed as a uri string. */
    const hasReq = callback.url.includes('{{req}}');
    /** Expiration time used when resolving request. */
    const hasEx = callback.url.includes('{{ex}}');
    const anyData = (hasSig || hasTx || hasBn || hasSa || hasSp || hasRbn || hasRid || hasReq || hasEx)
    return (
      <Segment style={{ marginTop: '1em' }}>
        <Header size="small">
          Callback
        </Header>
        <Form>
          <Form.Field>
            <label>URL</label>
            <Form.Input value={callback.url} />
          </Form.Field>
          <p>
            {(callback.background)
              ? <Label style={{ marginBottom: '0.5em' }}>Background Callback</Label>
              : <Label style={{ marginBottom: '0.5em' }}>Foreground Callback</Label>
            }
          </p>
          <p>
            The following public information will be transmitted in the callback:
          </p>
          <p>
            <Segment textAlign="center">
              {(hasSig || callback.background) ? (
                <Label style={{ marginBottom: '0.5em' }}>First Signature</Label>
              ) : false}
              {(hasTx || callback.background) ? (
                <Label style={{ marginBottom: '0.5em' }}>Transaction ID</Label>
              ) : false}
              {(hasBn || callback.background) ? (
                <Label style={{ marginBottom: '0.5em' }}>Block Number Hint</Label>
              ) : false}
              {(hasSa || callback.background) ? (
                <Label style={{ marginBottom: '0.5em' }}>Signer Account Name</Label>
              ) : false}
              {(hasSp || callback.background) ? (
                <Label style={{ marginBottom: '0.5em' }}>Signer Permission</Label>
              ) : false}
              {(hasRbn || callback.background) ? (
                <Label style={{ marginBottom: '0.5em' }}>Reference Block Number</Label>
              ) : false}
              {(hasRid || callback.background) ? (
                <Label style={{ marginBottom: '0.5em' }}>Reference Block ID</Label>
              ) : false}
              {(hasReq || callback.background) ? (
                <Label style={{ marginBottom: '0.5em' }}>Original Signing Request</Label>
              ) : false}
              {(hasEx || callback.background) ? (
                <Label style={{ marginBottom: '0.5em' }}>Expiration Time Used</Label>
              ) : false}
              {(!callback.background && !anyData) ? 'None' : false}
            </Segment>
          </p>
        </Form>
      </Segment>
    );
  }
}

export default ActionRequestDetailCallback;
