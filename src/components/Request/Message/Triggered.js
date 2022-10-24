import React, { Component } from 'react'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'

class ActionMessageTriggered extends Component {
    render() {
        const {
            chain,
            loading,
            useAnchor,
            useScatter,
            scatterAccount,
            scatterError,
            scatterResults,
            scatterLogin,
            scatterLogout,
        } = this.props
        if (loading) return false
        return (
            <Segment color="blue" stacked>
                <Header size="large">
                    <Icon name="info circle" />
                    <Header.Content>
                        A Signing Request has been processed.
                        <Header.Subheader>
                            Click one of the options below to launch this
                            transaction in your preferred wallet.
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                <Segment>
                    <Button
                        as="a"
                        color="blue"
                        content="Sign with Anchor"
                        href={useAnchor}
                        size="small"
                    />
                    {scatterAccount ? (
                        <React.Fragment>
                            <Button
                                color="blue"
                                content="Sign with Scatter"
                                onClick={useScatter}
                                size="small"
                            />
                            <Button
                                color="blue"
                                content="Logout Scatter"
                                floated="right"
                                onClick={scatterLogout}
                                size="small"
                            />
                        </React.Fragment>
                    ) : (
                        <Button
                            color="blue"
                            content="Login Scatter"
                            onClick={scatterLogin}
                            size="small"
                        />
                    )}
                    {scatterResults ? (
                        <Segment color="green" size="large">
                            <Header size="small">Transaction Successful</Header>
                            <Segment>
                                <p>
                                    The transaction was successfully pushed,
                                    click the link below to view more details.
                                </p>
                                <a
                                    href={`https://${
                                        chain !== 'eos'
                                            ? `${chain.toLowerCase()}.`
                                            : ''
                                    }bloks.io/transaction/${
                                        scatterResults.transaction_id
                                    }`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {scatterResults.transaction_id}
                                </a>
                            </Segment>
                        </Segment>
                    ) : (
                        false
                    )}
                    {scatterError ? (
                        <Segment color="red" size="large">
                            <Header
                                color="red"
                                content="Transaction Error"
                                icon="warning sign"
                                size="small"
                            />
                            <p>{scatterError.message}</p>
                        </Segment>
                    ) : (
                        false
                    )}
                </Segment>
            </Segment>
        )
    }
}

export default ActionMessageTriggered
