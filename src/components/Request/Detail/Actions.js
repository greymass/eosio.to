import React, { Component } from 'react';
import { Container, Header, Segment, Table } from 'semantic-ui-react';

class ActionRequestDetailActions extends Component {
  render() {
    const {
      actions,
    } = this.props;
    if (!actions) return false;
    return (
      <Segment attached>
        <Header size="small">
          Actions
        </Header>
        <p>This signing request contains {actions.length} action(s).</p>
        <Container style={{ overflowX: 'scroll' }}>
          {actions.map((action, idx) => (
            <Table definition key={idx}>
              <Table.Body>
                {Object.keys(action).map((param) => (
                  <Table.Row key={param}>
                    <Table.Cell collapsing textAlign="right">{param}</Table.Cell>
                    <Table.Cell><pre>{JSON.stringify(action[param], null, 2)}</pre></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>

            </Table>
          ))}
        </Container>
      </Segment>

    );
  }
}

export default ActionRequestDetailActions;
