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
import { JsonRpc, Api, Serialize } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2'

import GlobalHeader from '../components/Global/Header';
import GlobalFooter from '../components/Global/Footer';
import GlobalWallets from '../components/Global/Wallets';

import RequestDetailBlockchain from '../components/Request/Detail/Blockchain';
import RequestDetailActions from '../components/Request/Detail/Actions';
import RequestDetailCallback from '../components/Request/Detail/Callback';
import RequestHandlerURIBuilder from '../components/Request/Handler/URIBuilder';
import RequestMessageTriggered from '../components/Request/Message/Triggered';

const { convertLegacyPublicKeys } = require('eosio-signing-request/node_modules/eosjs/dist/eosjs-numeric');

ScatterJS.plugins( new ScatterEOS() );

const { SigningRequest } = require("eosio-signing-request");

// A custom cosigner AuthorityProvider for EOSJS v2
// This provider overrides the checks on all keys,
// allowing a partially signed transaction to be
// broadcast to the API node.
class CosignAuthorityProvider {
  async getRequiredKeys(args) {
    const { transaction } = args;
    // Iterate over the actions and authorizations
    transaction.actions.forEach((action, ti) => {
      action.authorization.forEach((auth, ai) => {
        // If the authorization matches the expected cosigner
        // then remove it from the transaction while checking
        // for what public keys are required
        if (
          auth.actor === 'greymassfuel'
          && auth.permission === 'cosign'
        ) {
          delete transaction.actions[ti].authorization.splice(ai, 1)
        }
      })
    });
    return convertLegacyPublicKeys((await rpc.fetch('/v1/chain/get_required_keys', {
      transaction,
      available_keys: args.availableKeys,
    })).required_keys);
  }
}

const tempSigProvider = new JsSignatureProvider([])
let rpc = new JsonRpc('https://eos.greymass.com')
let eos = new Api({
    rpc,
    signatureProvider: tempSigProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
})

let scatterNetwork = ScatterJS.Network.fromJson({
    blockchain: 'eos',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
});


let scatter = ScatterJS.eos(scatterNetwork, Api, {
  authorityProvider: new CosignAuthorityProvider(),
  rpc
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
          return (await rpc.get_abi(account)).abi
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
  '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca': 'https://jungle.greymass.com',
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
    this.detect = setInterval(() => {
      if (ScatterJS.identity) {
        this.setState({ scatterAccount: ScatterJS.account('eos') })
        clearInterval(this.detect)
      }
    }, 100)
    this.state = Object.assign({}, initialState);
  }
  componentWillMount() {
    const { decode, props } = this;
    const { match } = props;

    if (match && match.params && match.params.uri) {
      const uri = `esr:${match.params.uri}`;
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
      rpc.get_abi(nextState.contract).then((result) => {
        console.log(result)
        this.setState({ abi: result.abi });
      });
    }
    if (
      this.state.action
      && this.state.action !== nextState.action
    ) {
      const { abi, action } = nextState;
      if (abi) {
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
    const uriParts = uri.split(":");
    const decoded = SigningRequest.from(uri, opts);
    const [chain, chainId] = this.getChain(decoded);
    const httpEndpoint = chainAPIs[chainId];
    // Reinitialize EOSJS
    rpc = new JsonRpc(httpEndpoint)
    eos = new Api({
        rpc,
        signatureProvider: tempSigProvider,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder(),
    })
    // Reinitialize Scatter
    scatterNetwork = ScatterJS.Network.fromJson({
        blockchain: chain.toLowerCase(),
        chainId: chainId,
    });
    scatter = ScatterJS.eos(scatterNetwork, Api, {
      authorityProvider: new CosignAuthorityProvider(),
      rpc
    });
    const head = (await rpc.get_info()).head_block_num;
    const block = await rpc.get_block(head);
    const abis = await decoded.fetchAbis();
    const resolved = decoded.resolve(abis, authorization, block);
    const { actions } = resolved.transaction;
    const tx = resolved.transaction
    const { callback } = decoded.data;
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
    // window.location.replace(`esr:${uriParts[1]}`);
    this.setState({
      action: action.name,
      callback,
      chain,
      chainId,
      contract: action.account,
      decoded: {
        actions,
        tx,
        callback,
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
  scatterLogin = async () => {
    const connected = await ScatterJS.connect('eosio.to', { scatterNetwork })
    if(!connected) return false;
    await ScatterJS.login({accounts:[ scatterNetwork ]})
  }
  scatterLogout = async () => {
    this.setState({ scatterAccount: null })
    await ScatterJS.logout()
  }
  useScatter = async () => {
    const { decoded } = this.state;
    this.setState({
      scatterError: null,
      scatterResults: null
    })
    scatter.transact({
      actions: decoded.actions
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((result) => {
      this.setState({
        scatterError: null,
        scatterResults: result
      })
    }).catch((error) => {
      this.setState({
        scatterError: error,
        scatterResults: null
      })
    });

  }
  render() {
    const {
      chain,
      chainId,
      decoded,
      loading,
      scatterAccount,
      scatterError,
      scatterResults,
      uri,
      uriParts,
    } = this.state;
    const {
      actions,
      callback
    } = decoded;
    console.log(scatterError)
    return (
      <Container className="App">
        <GlobalHeader />
        <Segment loading={loading} style={{ marginTop: 0 }}>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={10}>
                <RequestMessageTriggered
                  chain={chain}
                  loading={loading}
                  uriParts={uriParts}
                  useAnchor={`esr:${uriParts[1]}`}
                  useScatter={this.useScatter}
                  scatterAccount={scatterAccount}
                  scatterError={scatterError}
                  scatterResults={scatterResults}
                  scatterLogin={this.scatterLogin}
                  scatterLogout={this.scatterLogout}
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
                    Scanning this QR code with a ESR enabled mobile wallet will prompt to sign this request.
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
                      <label>ESR Link</label>
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
                      href={`esr:${uriParts[1]}`}
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
                      <label>HTTPS Link (ESR URI via redirection)</label>
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
