import React, { Component } from 'react'
import { Container, Header, Segment } from 'semantic-ui-react'

import ActionRequestDetailActionsFuel from './Actions/Fuel'
import ActionRequestDetailActionsGeneric from './Actions/Generic'

class ActionRequestDetailActions extends Component {
    render() {
        const { actions } = this.props
        if (!actions) return false
        return (
            <Segment attached>
                <Header size="small">Actions</Header>
                <p>This signing request contains {actions.length} action(s).</p>
                <Container style={{ overflowX: 'scroll' }}>
                    {actions.map((action, idx) => {
                        if (
                            ['greymassnoop', 'greymassfuel'].includes(
                                action.account
                            ) &&
                            ['cosign', 'noop'].includes(action.name)
                        ) {
                            return (
                                <ActionRequestDetailActionsFuel
                                    action={action}
                                    idx={idx}
                                />
                            )
                        }
                        return (
                            <ActionRequestDetailActionsGeneric
                                action={action}
                                idx={idx}
                            />
                        )
                    })}
                </Container>
            </Segment>
        )
    }
}

export default ActionRequestDetailActions
