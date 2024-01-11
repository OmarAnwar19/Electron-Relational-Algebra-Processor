import React, { useState, useRef } from "react";
import { executeQuery } from "./utils/query";
import RelAlgEval from "./components/RelAlgEval";

const App = () => {
  const initialRelations = [
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
  ];

  const [relations, setRelations] = useState(initialRelations);
  const [query, setQuery] = useState("select tuple.Age>30(Employees)");
  const [result, setResult] = useState(null);
  const queryRef = useRef(null);

  const handleRelationChange = (value) => {
    let relationObjects = [];
    const regex = /(\w+)\s*\(([^)]+)\)\s*=\s*\{([^}]*)\}/g;

    let match;
    while ((match = regex.exec(value)) !== null) {
      const name = match[1];
      const attributes = match[2].split(",").map((attr) => attr.trim());
      const tuples = match[3]
        .split("\n")
        .map((line) => line.split(",").map((value) => value.trim()));

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

      relationObjects.push(relationObject);
    }

    setRelations(relationObjects);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleExecute = () => {
    setResult(executeQuery(relations, query));
  };

  const handleToolbarClick = (icon) => {
    const cursorPosition = queryRef.current.selectionStart;
    setQuery(
      query.slice(0, cursorPosition).concat(icon, query.slice(cursorPosition))
    );
  };

  return (
    <RelAlgEval
      initialRelations={initialRelations}
      relations={relations}
      handleRelationChange={handleRelationChange}
      query={query}
      handleQueryChange={handleQueryChange}
      handleExecute={handleExecute}
      handleToolbarClick={handleToolbarClick}
      result={result}
    />
  );
};

export default App;
