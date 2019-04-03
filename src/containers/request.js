import React, { Component } from 'react';
import { find } from 'lodash';

import QRCode from 'qrcode';

import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Modal,
  Segment,
  TextArea
} from 'semantic-ui-react';

import ReactJson from 'react-json-view';

import GlobalHeader from '../components/Global/Header';
import GlobalFooter from '../components/Global/Footer';
import GlobalWallets from '../components/Global/Wallets';

import RequestDetailBlockchain from '../components/Request/Detail/Blockchain';
import RequestDetailActions from '../components/Request/Detail/Actions';
import RequestDetailCallback from '../components/Request/Detail/Callback';
import RequestHandlerURIBuilder from '../components/Request/Handler/URIBuilder';
import RequestMessageTriggered from '../components/Request/Message/Triggered';

const { SigningRequest } = require("eosio-uri");

const eosjs = require('eosjs')
let eos = eosjs({
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
  chain: undefined,
  chainId: undefined,
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

// opts for the signing request
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

const chainAliases = [
  ['RESERVED'], // 0x00
  ['EOS','aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'], // 0x01
  ['TELOS','4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'], // 0x02
  ['JUNGLE','038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'], // 0x03
  ['KYLIN','5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'], // 0x04
  ['WORBLI','73647cde120091e0a4b85bced2f3cfdb3041e266cbbe95cee59b73235a1b3b6f'], // 0x05
  ['BOS','d5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86'], // 0x06
  ['MEETONE','cfe6486a83bad4962f232d48003b1824ab5665c36778141034d75e57b956e422'], // 0x07
  ['INSIGHTS','b042025541e25a472bffde2d62edd457b7e70cee943412b1ea0f044f88591664'], // 0x08
  ['BEOS','b912d19a6abd2b1b05611ae5be473355d64d95aeff0c09bedc8c166cd6468fe4'], // 0x09
];

const chainAPIs = {
  'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906': 'https://eos.greymass.com',
  '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11': 'https://telos.greymass.com',
  '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca': 'http://jungle.cryptolions.io:18888',
  '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191': 'https://kylin.eoscanada.com:443',
  '73647cde120091e0a4b85bced2f3cfdb3041e266cbbe95cee59b73235a1b3b6f': 'https://api.worbli.io',
  'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86': 'https://hapi.bos.eosrio.io',
  'cfe6486a83bad4962f232d48003b1824ab5665c36778141034d75e57b956e422': 'https://fullnode.meet.one',
  'b042025541e25a472bffde2d62edd457b7e70cee943412b1ea0f044f88591664': 'https://ireland-history.insights.network',
  'b912d19a6abd2b1b05611ae5be473355d64d95aeff0c09bedc8c166cd6468fe4': 'https://api.beos.world',
}

class RequestContainer extends Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, initialState);
  }
  componentWillMount() {
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
  getChain = (decoded) => {
    const [chainIdType, chainIdValue] = decoded.data.chain_id;
    switch (chainIdType) {
      case "chain_alias":
      default: {
        return chainAliases[chainIdValue];
      }
    }
  }
  decode = async (uri = false) => {
    const {
      authorization
    } = this.state;
    const uriParts = uri.split("://");
    const decoded = SigningRequest.from(uri, opts);
    const [chain, chainId] = this.getChain(decoded);
    const httpEndpoint = chainAPIs[chainId];
    eos = eosjs({ httpEndpoint });
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
    QRCode.toCanvas(canvas, uri, {
      scale: 6
    }, function (error) {
      if (error) console.error(error)
    });
    // window.location.replace(`eosio://${uriParts[1]}`);
    this.setState({
      action: action.name,
      callback: {
        background: false,
        url: cb
      },
      chain,
      chainId,
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
  onMount = () => {
    const { uri } = this.state;
    const { canvasfull } = this.refs;
    QRCode.toCanvas(canvasfull, uri, {
      width: 800
    }, function (error) {
      if (error) console.error(error)
    });
  }
  render() {
    const {
      chain,
      chainId,
      decoded,
      loading,
      uri,
      uriParts,
    } = this.state;
    const {
      actions,
      callback
    } = decoded;
    return (
      <Container className="App">
        <GlobalHeader />
        <Segment loading={loading} style={{ marginTop: 0 }}>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={10}>
                <RequestMessageTriggered
                  loading={loading}
                  uriParts={uriParts}
                />
                <Segment secondary stacked>
                  <Header>
                    Request Details
                  </Header>
                  <RequestDetailBlockchain
                    chain={chain}
                    chainId={chainId}
                  />
                  <RequestDetailActions
                    actions={actions}
                  />
                  <RequestDetailCallback
                    callback={callback}
                  />
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
                  <Modal
                    centered={false}
                    closeIcon={true}
                    onMount={this.onMount}
                    size="large"
                    trigger={(
                      <Button
                        content="View Larger QR Code"
                        icon="qrcode"
                      />
                    )}
                  >
                    <Container textAlign="center">
                      <canvas ref="canvasfull"></canvas>
                    </Container>
                  </Modal>
                </Container>
                <RequestHandlerURIBuilder
                  uriParts={uriParts}
                />
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
        <GlobalWallets />
        <GlobalFooter />
      </Container>
    );
  }
}

export default RequestContainer;
