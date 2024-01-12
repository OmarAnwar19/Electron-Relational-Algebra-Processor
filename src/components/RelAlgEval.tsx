import { useRef, useState, FC } from "react";
import { Container, Button, Form } from "react-bootstrap";
import Toolbar from "./Toolbar";
import { renderTable } from "./Table";
import { RelAlgEvalProps } from "../lib/types";

const RelAlgEval: FC<RelAlgEvalProps> = ({
  initialRelations,
  relations,
  handleRelationChange,
  query,
  setQuery,
  handleQueryChange,
  handleExecute,
  result,
}) => {
  const [value, setValue] = useState(
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

  const queryRef = useRef<HTMLInputElement>(null);

  const handleToolbarClick = (icon: string) => {
    const cursorPosition = queryRef.current?.selectionStart || 0;
    setQuery(
      query.slice(0, cursorPosition).concat(icon, query.slice(cursorPosition))
    );
  };

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
        <Form style={{ margin: "2rem 0" }}>
          <hr />
          <Form.Text>{result.name}</Form.Text>
          {renderTable({ relation: result })}
        </Form>
      )}
    </Container>
  );
};

export default RelAlgEval;
