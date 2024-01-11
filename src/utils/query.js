import { icons } from "../lib/iconsOps";
import { operations } from "../lib/iconsOps";

export function executeQuery(relations, query) {
  const regex = /[()\s]+/;
  const parts = query.split(regex);

  let operation = "";
  let args = [];

  for (let part of parts) {
    if (operations.includes(part) || Object.values(icons).includes(part)) {
      operation = part;
    } else if (part !== "") {
      args.push(part);
    }
  }

  let result = [];

  for (let relation of relations) {
    if (query.includes(relation.name)) {
      if (operation === "") {
        const relationName = args[0];

        if (relationName === relation.name) {
          return {
            name: relation.name,
            attributes: relation.attributes,
            tuples: relation.tuples,
          };
        }
      } else if (operation === "select" || operation === icons.sigma) {
        const condition = args[0];
        const relationName = args[1];

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
        const joinCondition = args[0];
        const [attr1, attr2] = joinCondition.split("=");

        let relationName1 = args[1].replace(",", "");
        let relationName2 = args[2].replace(",", "");

        if (
          relationName1 === relation.name ||
          relationName2 === relation.name
        ) {
          const otherRelationName =
            relationName1 === relation.name ? relationName2 : relationName1;
          const otherRelation = getOtherRelation(otherRelationName, relations);

          for (let tuple1 of relation.tuples) {
            for (let tuple2 of otherRelation.tuples) {
              if (tuple1[attr1] === tuple2[attr2]) {
                const combinedTuple = { ...tuple1, ...tuple2 };
                const formattedTuple = {};

                for (let key in combinedTuple) {
                  formattedTuple[key] = combinedTuple[key];
                }

                result.push(formattedTuple);
              }
            }
          }
        }

        return {
          name: relation.name,
          attributes: relation.attributes,
          tuples: result,
        };
      } else if (operation === "rename" || operation === icons.rho) {
        const newName = args[0];
        const relationName = args[1];

        if (relationName === relation.name) {
          return {
            name: newName,
            attributes: relation.attributes,
            tuples: relation.tuples,
          };
        }
      } else if (operation === "union" || operation === icons.union) {
        let relationName1 = args[0];
        let relationName2 = args[1];

        if (
          relationName1 === relation.name ||
          relationName2 === relation.name
        ) {
          const matchingRelation1 = relations.find(
            (rel) => rel.name === relationName1
          );
          const matchingRelation2 = relations.find(
            (rel) => rel.name === relationName2
          );

          if (!matchingRelation1 || !matchingRelation2) {
            break;
          }

          return {
            name: relation.name,
            attributes: matchingRelation1.attributes,
            tuples: [...matchingRelation1.tuples, ...matchingRelation2.tuples],
          };
        }
      } else if (
        operation === "intersect" ||
        operation === icons.intersection
      ) {
        let relationName1 = args[0];
        let relationName2 = args[1];

        if (
          relationName1 === relation.name ||
          relationName2 === relation.name
        ) {
          const matchingRelation1 = relations.find(
            (rel) => rel.name === relationName1
          );
          const matchingRelation2 = relations.find(
            (rel) => rel.name === relationName2
          );

          if (!matchingRelation1 || !matchingRelation2) {
            break;
          }

          const tuples = matchingRelation1.tuples.filter((tuple1) =>
            matchingRelation2.tuples.some(
              (tuple2) => JSON.stringify(tuple1) === JSON.stringify(tuple2)
            )
          );
          return {
            name: relation.name,
            attributes: matchingRelation1.attributes,
            tuples,
          };
        }
      } else if (operation === "minus" || operation === icons.dash) {
        let relationName1 = args[0];
        let relationName2 = args[1];

        if (
          relationName1 === relation.name ||
          relationName2 === relation.name
        ) {
          const matchingRelation1 = relations.find(
            (rel) => rel.name === relationName1
          );
          const matchingRelation2 = relations.find(
            (rel) => rel.name === relationName2
          );

          if (!matchingRelation1 || !matchingRelation2) {
            break;
          }

          const tuples = matchingRelation1.tuples.filter(
            (tuple1) =>
              !matchingRelation2.tuples.some(
                (tuple2) => JSON.stringify(tuple1) === JSON.stringify(tuple2)
              )
          );
          return {
            name: relation.name,
            attributes: matchingRelation1.attributes,
            tuples,
          };
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

// Add the following helper function outside of executeQuery
function getOtherRelation(relationName, relations) {
  return relations.find((relation) => relation.name === relationName) || {};
}
