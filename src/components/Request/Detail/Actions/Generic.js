import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

class ActionRequestDetailActionsGeneric extends Component {
  render() {
    const {
      action,
      idx,
    } = this.props;
    if (!action) return false;
    return (
      <Table definition key={idx}>
        <Table.Body>
          {Object.keys(action).map((param) => {
            let formatted = JSON.stringify(action[param], null, 2);
            formatted = formatted.replace("............1", "[Signing Account: Actor]")
            formatted = formatted.replace("............2", "[Signing Account: Permission]")
            return (
              <Table.Row key={param}>
                <Table.Cell collapsing textAlign="right">{param}</Table.Cell>
                <Table.Cell><pre>{formatted}</pre></Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    );
  }
}

export default ActionRequestDetailActionsGeneric;
