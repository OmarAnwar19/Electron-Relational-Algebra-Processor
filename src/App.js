import React, { useState } from "react";
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
  const [query, setQuery] = useState("π EID,Name (σ Age<30 (Employees))");
  const [result, setResult] = useState(null);

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

  const extractExpressions = (expression) => {
    let expressions = [expression];
    let stack = [];
    let start = 0;

    for (let i = 0; i < expression.length; i++) {
      if (expression[i] === "(") {
        if (stack.length === 0) {
          start = i;
        }
        stack.push("(");
      } else if (expression[i] === ")") {
        stack.pop();
        if (stack.length === 0) {
          let expr = expression.substring(start + 1, i);
          if (!expressions.includes(expr)) {
            expressions.push(expr);
          }
        }
      }
    }

    // Extract inner expressions from each expression
    for (let expr of expressions) {
      let innerStart = expr.indexOf("(");
      let innerEnd = expr.lastIndexOf(")");
      const newExpr = expr.substring(innerStart + 1, innerEnd);
      if (
        innerStart !== -1 &&
        innerEnd !== -1 &&
        !expressions.includes(newExpr)
      ) {
        expressions.push(newExpr);
      }
    }

    return expressions;
  };

  const handleExecute = () => {
    const tempRelations = [];
    const expressions = extractExpressions(query).reverse();

    for (let i = 0; i < expressions.length; i++) {
      let expr = expressions[i].replace(expressions[i - 1], `Nested${i - 1}`);
      const result = executeQuery(i === 0 ? relations : tempRelations, expr);

      tempRelations.push({
        name: `Nested${i}`,
        attributes: result.attributes,
        tuples: result.tuples,
      });
    }

    setResult(tempRelations[tempRelations.length - 1]);
  };

  return (
    <RelAlgEval
      initialRelations={initialRelations}
      relations={relations}
      handleRelationChange={handleRelationChange}
      query={query}
      setQuery={setQuery}
      handleQueryChange={handleQueryChange}
      handleExecute={handleExecute}
      result={result}
    />
  );
};

export default App;
