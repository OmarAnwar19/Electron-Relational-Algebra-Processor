import { useState, ChangeEvent } from "react";
import { executeQuery } from "./utils/query";
import RelAlgEval from "./components/RelAlgEval";
import { Relation, Tuple } from "./lib/types";
import { binaryOps } from "./lib/iconsOps";

/*
  TODO: fix readme / github
  TODO: record video
*/

const App = () => {
  const initialRelations: Relation[] = [
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
      attributes: ["DID", "DName"],
      tuples: [
        { DID: 1, DName: "File1" },
        { DID: 2, DName: "File2" },
        { DID: 3, DName: "File3" },
      ],
    },
    {
      name: "Papers",
      attributes: ["PID", "PName"],
      tuples: [
        { PID: 1, PName: "Paper1" },
        { PID: 2, PName: "Paper2" },
        { PID: 4, PName: "File3" },
      ],
    },
  ];

  const [relations, setRelations] = useState<Relation[]>(initialRelations);
  const [query, setQuery] = useState<string>(
    "π EID,Name (σ Age<30 (Employees))"
  );
  const [result, setResult] = useState<Relation | null>(null);

  const handleRelationChange = (value: string) => {
    let relationObjects: Relation[] = [];
    const regex = /(\w+)\s*\(([^)]+)\)\s*=\s*\{([^}]*)\}/g;

    let match;
    while ((match = regex.exec(value)) !== null) {
      const name = match[1];
      const attributes = match[2].split(",").map((attr) => attr.trim());
      const tuples = match[3]
        .split("\n")
        .map((line) => line.split(",").map((value) => value.trim()));

      let relationObject: Relation = {
        name: name,
        attributes: attributes,
        tuples: tuples.map((values) => {
          let tuple: Tuple = {};
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

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const extractExpressions = (expression: string): string[] => {
    let expressions: string[] = [expression];
    let stack: string[] = [];
    let start = 0;
    let lastOperatorIndex = -1;

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
          if (lastOperatorIndex !== -1) {
            let operatorExpr = expression
              .substring(lastOperatorIndex + 1, i + 1)
              .trim();
            if (!expressions.includes(operatorExpr)) {
              expressions.push(operatorExpr);
            }
          }
        }
      } else if (
        binaryOps.includes(expression[i]) ||
        Object.values(binaryOps).includes(expression[i])
      ) {
        lastOperatorIndex = i;
      }
    }

    return expressions;
  };

  const handleExecute = () => {
    const tempRelations: Relation[] = [...relations];
    const expressions = extractExpressions(query).reverse();

    for (let i = 0; i < expressions.length; i++) {
      let expr = expressions[i].replace(expressions[i - 1], `Result_${i - 1}`);
      const result = executeQuery(i === 0 ? relations : tempRelations, expr);

      tempRelations.push({
        name:
          result.name !== "No matching relation" ? `Result_${i}` : result.name,
        attributes: result.attributes,
        tuples: result.tuples,
      });
    }

    console.log({ expressions, tempRelations });

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
