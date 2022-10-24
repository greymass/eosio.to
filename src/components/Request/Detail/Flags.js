import React, { Component } from 'react'
import { Header, Segment, Table } from 'semantic-ui-react'

class ActionRequestDetailFlags extends Component {
    render() {
        const { broadcast } = this.props
        return (
            <Segment style={{ marginTop: '1em' }}>
                <Header size="small">Request Flags</Header>
                <Table definition>
                    <Table.Row>
                        <Table.Cell collapsing>
                            Broadcast Transaction
                        </Table.Cell>
                        <Table.Cell>{broadcast ? 'True' : 'False'}</Table.Cell>
                    </Table.Row>
                </Table>
            </Segment>
        )
    }
}

export default ActionRequestDetailFlags
