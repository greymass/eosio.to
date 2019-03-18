import React, { Component } from 'react';
import { Header, Segment, Table } from 'semantic-ui-react';

class ActionRequestDetailActions extends Component {
  render() {
    const {
      actions,
    } = this.props;
    if (!actions) return false;
    return (
      <Segment>
        <Header size="small">
          Actions
        </Header>
        <p>This signing request contains {actions.length} action(s).</p>
        {actions.map((action, idx) => (
          <Table definition key={idx}>
            <Table.Body>
              {Object.keys(action).map((param) => (
                <Table.Row key={param}>
                  <Table.Cell>{param}</Table.Cell>
                  <Table.Cell><pre>{JSON.stringify(action[param], null, 2)}</pre></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

          </Table>
        ))}
      </Segment>

    );
  }
}

export default ActionRequestDetailActions;
