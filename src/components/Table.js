import React from "react";
import Table from "react-bootstrap/Table";

// A helper function that renders a table from a relation
export const renderTable = (relation) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {relation.attributes.map((attribute) => (
            <th key={attribute}>{attribute}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {relation.tuples.map((tuple, index) => (
          <tr key={index}>
            {relation.attributes.map((attribute) => (
              <td key={attribute}>{tuple[attribute]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
