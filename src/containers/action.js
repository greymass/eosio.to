import React, { Component } from 'react';
import { find } from 'lodash';

import QRCode from 'qrcode';

import {
  Button,
  Container,
  Checkbox,
  Divider,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Label,
  Message,
  Segment,
  Select,
  Tab,
  Table,
  TextArea
} from 'semantic-ui-react';

import ReactJson from 'react-json-view';

const { SigningRequest } = require("eosio-uri");

const eosjs = require('eosjs')
const eos = eosjs({
  httpEndpoint: 'https://eos.greymass.com'
});

const uriProxy = 'http://eosio.to/';

const initialState = {
  abi: false,
  action: 'transfer',
  authorization: {
    actor: "............1",
    permission: "............1",
  },
  callback: {
    background: false,
    url: '',
  },
  contract: 'eosio.token',
  decoded: {
    actions: [],
  },
  fields: {},
  fieldsMatchSigner: {},
  fieldsPromptSigner: {},
  loading: false,
  uri: false,
  uriError: false,
  uriParts: []
};

const knownContracts = [
  'eosio',
  'eosio.token',
  'eosio.forum',
];

// opts for the signing request
const util = require('util');
const zlib = require('zlib');
const opts = {
  // string compression
  zlib: {
      deflateRaw: (data) => {
          return new Uint8Array(zlib.deflateRawSync(Buffer.from(data)))
      },
      inflateRaw: (data) => {
          return new Uint8Array(zlib.inflateRawSync(Buffer.from(data)))
      },
  },
  // provider to retrieve contract abi
  abiProvider: {
      getAbi: async (account) => {
          return (await eos.getAbi(account)).abi
      }
  }
}

class ActionContainer extends Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, initialState);
  }
  componentWillMount() {
    const uriState = {};
    const { decode, props } = this;
    const { match } = props;
    if (match && match.params && match.params.uri) {
      const uri = `eosio:${match.params.uri}`;
      this.setState({
        loading: true,
        uri
      }, () => {
        decode(uri);
      });
    }
    if (this.state.contract && !this.state.abi) {
      eos.getAbi(this.state.contract).then((result) => {
        this.setState({ abi: result.abi });
      });
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.contract !== nextState.contract
    ) {
      eos.getAbi(nextState.contract).then((result) => {
        console.log(result.abi)
        this.setState({ abi: result.abi });
      });
    }
    if (
      this.state.action
      && this.state.action !== nextState.action
    ) {
      const { abi, action } = nextState;
      const { structs } = abi;
      const struct = find(structs, { name: action });
      if (struct) {
        const { fields } = struct;
        const defaultFields = {};
        fields.forEach((field) => {
          defaultFields[field.name] = '';
        });
        this.setState({
          uri: undefined,
          fields: defaultFields
        });
      }
    }
  }
  clipboard = (element) => {
    const { ref } = this.refs[element];
    ref.select();
    document.execCommand('copy');
    ref.focus();
  };
  decode = async (uri = false) => {
    const {
      authorization
    } = this.state;
    let uriFormatHack = uri;
    if(uri.substring(0, 8) !== 'eosio://') {
      uriFormatHack = uriFormatHack.replace(':', '://');
    }
    const uriParts = uriFormatHack.split("://");
    console.log(uriParts)
    const decoded = SigningRequest.from(uriFormatHack, opts);
    const actions = await decoded.getActions();
    const head = (await eos.getInfo(true)).head_block_num;
    const block = await eos.getBlock(head);
    const tx = await decoded.getTransaction(authorization, block);
    const cb = decoded.data.callback.url;
    const action = actions[0];
    const fieldsMatchSigner = {};
    const fieldsPromptSigner = {};
    Object.keys(action.data).forEach((field) => {
      const data = action.data[field];
      if (data === '............2') {
        fieldsPromptSigner[field] = true;
      }
      if (data === '............1') {
        fieldsMatchSigner[field] = true;
      }
    });
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    QRCode.toCanvas(canvas, uriFormatHack, { scale: 8 }, function (error) {
      if (error) console.error(error)
    });
    // window.location.replace(`eosio://${uriParts[1]}`);
    this.setState({
      action: action.name,
      callback: {
        background: false,
        url: cb
      },
      contract: action.account,
      decoded: {
        actions,
        tx,
        callback: cb,
      },
      fields: Object.assign({}, action.data),
      fieldsMatchSigner,
      fieldsPromptSigner,
      loading: false,
      raw: decoded,
      uriParts
    });
  }

  copyToClipboard = (e) => {
    this.textArea.select();
    document.execCommand('copy');
    e.target.focus();
  };

  render() {
    const {
      abi,
      action,
      contract,
      decoded,
      fieldsMatchSigner,
      fieldsPromptSigner,
      loading,
      raw,
      uri,
      uriError,
      uriParts,
    } = this.state;
    const {
      actions,
      tx,
      callback
    } = decoded;
    return (
      <Container className="App" style={{ paddingTop: "1em" }}>
        <Segment attached="top" inverted color="blue">
          <Header size="large">
            <Icon name="linkify" />
            <Header.Content>
              eosio.to
              <Header.Subheader style={{ color: '#ffffff' }}>
                Signing Request Processing Service
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <Segment attached loading={loading}>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={10}>
                {(!loading)
                  ? (
                    <Segment>
                      <Header size="large">
                        <Icon name="info circle" style={{ verticalAlign: 'top' }} />
                        <Header.Content>
                          A Signing Request has been triggered.
                          <Header.Subheader style={{ padding: '1em 0' }}>
                            <Label as='a' href={`eosio:${uriParts[1]}`}>
                              <Icon name="linkify" />
                              eosio:{uriParts[1]}
                            </Label>
                          </Header.Subheader>
                          <Header.Subheader>
                            Not working? Make sure you have an
                            {' '}
                            <a href="#wallets">
                              EEP-6 compatible wallet
                            </a>
                            {' '}
                            installed.
                          </Header.Subheader>
                        </Header.Content>
                      </Header>
                    </Segment>
                  )
                  : false
                }
                <Segment secondary>
                  <Header>
                    Request Details
                  </Header>
                  <p>This signing request contains {actions.length} action(s).</p>
                  {actions.map((action) => (
                    <Table definition>
                      <Table.Body>
                        {Object.keys(action).map((param) => (
                          <Table.Row>
                            <Table.Cell>{param}</Table.Cell>
                            <Table.Cell><pre>{JSON.stringify(action[param], null, 2)}</pre></Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>

                    </Table>
                  ))}
                </Segment>
              </Grid.Column>
              <Grid.Column width={6}>
                <Header>
                  QR Code
                  <Header.Subheader>
                    Scanning this QR code with a EEP-6 enabled mobile wallet will prompt to sign this request.
                  </Header.Subheader>
                </Header>
                <Container textAlign="center">
                  <canvas ref="canvas" />
                </Container>
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
                <Form>
                  <Segment secondary>
                    <Form.Field>
                      <label>EOSIO URI Link</label>
                      <TextArea
                        ref="uriLink"
                        value={uri}
                      />
                    </Form.Field>
                    <Button
                      as="a"
                      content="Open"
                      color="blue"
                      icon="external"
                      href={`eosio://${uriParts[1]}`}
                      size="small"
                    />
                    <Button
                      as="a"
                      color="blue"
                      icon="clipboard"
                      onClick={() => this.clipboard('uriLink')}
                      size="small"
                    />
                  </Segment>
                  <Segment secondary>
                    <Form.Field>
                      <label>HTTPS Link (EOSIO URI via redirection)</label>
                      <TextArea
                        ref="httpsLink"
                        value={`${uriProxy}${uriParts[1]}`}
                      />
                    </Form.Field>
                    <Button
                      as="a"
                      content="Open"
                      color="blue"
                      icon="external"
                      href={`/${uriParts[1]}`}
                      size="small"
                    />
                    <Button
                      as="a"
                      color="blue"
                      icon="clipboard"
                      onClick={() => this.clipboard('httpsLink')}
                      size="small"
                    />
                  </Segment>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment attached="bottom" id="wallets">
          <Header>
            EEP-6 Compatible Wallets
            <Header.Subheader>
              The <a href="$">EEP-6 standard</a> is a communication layer any wallet can adopt. Encourage your favorite wallet developer to implement this standard or download one of the wallets below.
            </Header.Subheader>
          </Header>
        </Segment>
        <Segment basic style={{ padding: '2em 0 '}} textAlign="center">
          <Header size="small">
            eosio.to
            <Header.Subheader>
              a <a href="https://greymass.com">greymass</a> project
            </Header.Subheader>
          </Header>
        </Segment>
      </Container>
    );
  }
}

export default ActionContainer;
