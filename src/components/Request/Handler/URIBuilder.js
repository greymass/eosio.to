import React, { Component } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';

class RequestHandlerURIBuilder extends Component {
  render() {
    const {
      uriParts
    } = this.props;
    return (
      <Segment stacked>
        <Header>
          Modify & Share
          <Header.Subheader>
            Edit this signing request in the eosio-uri-builder or copy one of the links below to share.
          </Header.Subheader>
        </Header>
        <Button
          as="a"
          content="Edit in URI Builder"
          color="green"
          icon="edit"
          href={`https://greymass.github.io/eosio-uri-builder/${uriParts[1]}`}
        />
      </Segment>
    );
  }
}

export default RequestHandlerURIBuilder;
