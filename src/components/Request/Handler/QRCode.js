import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';

class ActionHandlerQRCode extends Component {
  render() {
    return (
      <React.Fragment>
        <Header>
          QR Code
          <Header.Subheader>
            Scanning this QR code with a EEP-7 enabled mobile wallet will prompt to sign this request.
          </Header.Subheader>
        </Header>
        <Container textAlign="center">
          <canvas ref="canvas" />
        </Container>
      </React.Fragment>
    );
  }
}

export default ActionHandlerQRCode;
