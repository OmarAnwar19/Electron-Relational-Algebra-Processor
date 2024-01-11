import icons from "../lib/icons";

export function executeQuery(relations, query) {
  const parts = query.split(/[()\s]+/);
  const operation = parts[0];
  const args = parts.slice(1);
  let result = [];

  for (let relation of relations) {
    if (query.includes(relation.name)) {
      if (operation === "select" || operation === icons.sigma) {
        const condition = args[0];
        const relationName = args[1];

        console.log({ condition, relationName });

        if (relationName === relation.name) {
          for (let tuple of relation.tuples) {
            const scope = createScope(relation.attributes, tuple);

            if (eval(`tuple.${condition}`, scope)) {
              result.push(tuple);
            }
          }
        }

        return {
          name: relation.name,
          attributes: relation.attributes,
          tuples: result,
        };
      } else if (operation === "project" || operation === icons.pi) {
        const attributeList = args[0].split(",");
        const relationNameProj = args[1];

        if (relationNameProj === relation.name) {
          for (let tuple of relation.tuples) {
            let newTuple = createProjection(
              relation.attributes,
              tuple,
              attributeList
            );
            result.push(newTuple);
          }
        }

        return {
          name: relation.name,
          attributes: attributeList,
          tuples: result,
        };
      } else if (operation === "join" || operation === icons.bowtie) {
        let relationName1 = args[0];
        let relationName2 = args[1];
        const joinCondition = args[2];

        if (
          relationName1 === relation.name ||
          relationName2 === relation.name
        ) {
          for (let tuple of relation.tuples) {
            const scope = createScope(relation.attributes, tuple);

            if (eval(joinCondition, scope)) {
              result.push(tuple);
            }
          }
        }

        return {
          name: relation.name,
          attributes: relation.attributes,
          tuples: result,
        };
      } else if (
        operation === "union" ||
        operation === icons.union ||
        operation === "intersect" ||
        operation === icons.intersection ||
        operation === "minus" ||
        operation === icons.dash
      ) {
        let relationName1 = args[0];
        let relationName2 = args[1];

        if (relationName1 + operation + relationName2 === relation.name) {
          return relation;
        }
      } else {
        throw new Error("Invalid operation: " + operation);
      }
    }
  }

  return {
    name: "No matching relation",
    attributes: [],
    tuples: [],
  };
}

function createScope(attributes, tuple) {
  const scope = {};
  for (let attribute of attributes) {
    scope[attribute] = tuple[attribute];
  }
  return scope;
}

function createProjection(attributes, tuple, selectedAttributes) {
  let newTuple = {};
  for (let attribute of selectedAttributes) {
    newTuple[attribute] = tuple[attribute];
  }
  return newTuple;
}
