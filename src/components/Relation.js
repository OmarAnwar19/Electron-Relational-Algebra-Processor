// Import React and useState
import React, { useRef, useState } from "react";

// Import React Bootstrap
import { Container, Button, Form } from "react-bootstrap";

import Toolbar from "./Toolbar";

// Import the executeQuery function
import { executeQuery } from "../utils/query";

// Import the renderTable function
import { renderTable } from "./Table";

// Create the Relation component
function Relation() {
  // Use a state variable to store the array of relation objects
  const [relations, setRelations] = useState([
    {
      name: "Employees",
      attributes: ["EID", "Name", "Age"],
      tuples: [
        { EID: "E1", Name: "John", Age: 32 },
        { EID: "E2", Name: "Alice", Age: 28 },
        { EID: "E3", Name: "Bob", Age: 29 },
      ],
    },
    {
      name: "Documents",
      attributes: ["ID", "FName"],
      tuples: [
        { ID: 1, FName: "File1" },
        { ID: 2, FName: "File2" },
        { ID: 3, FName: "File3" },
      ],
    },
  ]);

  // Use a state variable to store the input value
  const [value, setValue] = useState(
    relations
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

  // Use a state variable to store the query
  const [query, setQuery] = useState("select tuple.Age>30(Employees)");

  // Use a state variable to store the result of the query
  const [result, setResult] = useState(null);

  // A handler function that updates the input value and the array of relation objects
  function handleRelationChange(e) {
    // Get the input value
    const value = e.target.value;

    // Define a regular expression to match the relation syntax
    const regex = /(\w+)\s*\(([^)]+)\)\s*=\s*\{([^}]*)\}/g;

    // Initialize an empty array for the relation objects
    let relationObjects = [];

    // Loop through the matches of the regular expression on the input value
    let match;
    while ((match = regex.exec(value)) !== null) {
      const name = match[1];
      const attributes = match[2].split(",").map((attr) => attr.trim());
      const tuples = match[3]
        .split("\n")
        .map((line) => line.split(",").map((value) => value.trim()));

      // Create a relation object from the extracted parts
      let relationObject = {
        name: name,
        attributes: attributes,
        tuples: tuples.map((values) => {
          let tuple = {};
          for (let i = 0; i < attributes.length; i++) {
            tuple[attributes[i]] = values[i];
          }
          return tuple;
        }),
      };

      // Add the relation object to the array
      relationObjects.push(relationObject);
    }

    // Log the relation objects (for debugging purposes)
    console.log("Relation Objects:", relationObjects);

    // Update the state variables with the input value and the array of relation objects
    setValue(value);
    setRelations(relationObjects);

    console.log("Relations: ", relations);
  }

  // A handler function that updates the query
  function handleQueryChange(e) {
    setQuery(e.target.value);
  }

  function handleExecute() {
    // Execute the query and set the result
    setResult(executeQuery(relations, query));
  }

  const queryRef = useRef(null);

  function handleToolbarClick(icon) {
    const cursorPosition = queryRef.current.selectionStart;
    setQuery(
      query.slice(0, cursorPosition).concat(icon, query.slice(cursorPosition))
    );
  }

  // Return the JSX code for the component
  return (
    <Container className="App" style={{ marginTop: "3rem" }}>
      <h1>Relax--</h1>
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

      <Form style={{ margin: "1rem 0" }}>
        <Form.Group controlId="relation">
          <Form.Control
            as="textarea"
            rows={10}
            value={value}
            onChange={handleRelationChange}
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
}

// Export the Relation component
export default Relation;
