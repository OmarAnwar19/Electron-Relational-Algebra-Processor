import React, { useRef } from "react";
import { Container, Button, Form } from "react-bootstrap";
import Toolbar from "./Toolbar";
import { renderTable } from "./Table";

const RelAlgEval = ({
  initialRelations,
  relations,
  handleRelationChange,
  query,
  handleQueryChange,
  handleExecute,
  handleToolbarClick,
  result,
}) => {
  const [value, setValue] = React.useState(
    initialRelations
      .map(
        (relation) =>
          `${relation.name} (${relation.attributes.join(
            ", "
          )}) = {\n${relation.tuples
            .map((tuple) =>
              relation.attributes.map((attr) => tuple[attr]).join(", ")
            )
            .join("\n")}\n}`
      )
      .join("\n\n")
  );

  const queryRef = useRef(null);

  return (
    <Container className="App" style={{ marginTop: "3rem" }}>
      <h1>Electron</h1>
      <i>
        Instructions:
        <br />
        1. Enter relation(s) in the top text-box.
        <br />
        2. Enter a query in the bottom text-box (use the operators toolbar).
        <br />
        3. Click the Execute button.
        <br />
      </i>

      <Form style={{ margin: "1.5rem 0 1rem 0" }}>
        <Form.Group controlId="relation">
          <Form.Control
            as="textarea"
            rows={10}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              handleRelationChange(e.target.value);
            }}
          />
          <Form.Text className="text-muted">Relations</Form.Text>
        </Form.Group>
      </Form>

      <Form style={{ margin: "1rem 0" }}>
        <Toolbar onClick={handleToolbarClick} />
        <Form.Group controlId="query" style={{ marginTop: "0.5rem" }}>
          <Form.Control
            type="text"
            value={query}
            onChange={handleQueryChange}
            ref={queryRef}
          />
          <Form.Text className="text-muted">Query</Form.Text>
        </Form.Group>
      </Form>

      <Button variant="primary" onClick={handleExecute}>
        Execute
      </Button>

      {result && (
        <Form style={{ margin: "1rem 0" }}>{renderTable(result)}</Form>
      )}
    </Container>
  );
};

export default RelAlgEval;
