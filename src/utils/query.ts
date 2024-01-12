import { icons } from "../lib/iconsOps";
import { operations } from "../lib/iconsOps";
import { Relation, Tuple } from "../lib/types";

export function executeQuery(relations: Relation[], query: string) {
  const regex = /[()\s]+/;
  const parts = query.split(regex);

  let operation = "";
  let args: string[] = [];

  for (let part of parts) {
    if (operations.includes(part) || Object.values(icons).includes(part)) {
      operation = part;
    } else if (part !== "") {
      args.push(part);
    }
  }

  let result: Tuple[] = [];

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
            if (evaluateCondition(condition, tuple)) {
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
        const joinCondition = args[1];
        let [attr1, attr2] = joinCondition.split("=");

        let relationName1 = args[0];
        let relationName2 = args[2];
        let otherRelation;

        if (
          relationName1 === relation.name ||
          relationName2 === relation.name
        ) {
          const otherRelationName =
            relationName1 === relation.name ? relationName2 : relationName1;
          otherRelation = getOtherRelation(otherRelationName, relations);

          if (!relation.attributes.includes(attr1)) {
            [attr1, attr2] = [attr2, attr1];
          }

          for (let tuple1 of relation.tuples) {
            for (let tuple2 of otherRelation.tuples) {
              if (tuple1[attr1] === tuple2[attr2]) {
                const combinedTuple = { ...tuple1, ...tuple2 };
                delete combinedTuple[attr1];
                delete combinedTuple[attr2];
                combinedTuple[`${attr1}_${attr2}`] = tuple1[attr1];
                result.push(combinedTuple);
              }
            }
          }
        }

        return {
          name: relation.name,
          attributes: [
            `${attr1}_${attr2}`,
            ...relation.attributes.filter((attr) => attr !== attr1),
            ...(otherRelation?.attributes.filter((attr) => attr !== attr2) ||
              []),
          ],
          tuples: result,
        };
      } else if (operation === "cartesian" || operation === icons.cartesian) {
        let relationName1 = args[0];
        let relationName2 = args[1];
        let otherRelation;

        if (
          relationName1 === relation.name ||
          relationName2 === relation.name
        ) {
          const otherRelationName =
            relationName1 === relation.name ? relationName2 : relationName1;
          otherRelation = getOtherRelation(otherRelationName, relations);

          for (let tuple1 of relation.tuples) {
            for (let tuple2 of otherRelation.tuples) {
              const combinedTuple = { ...tuple1, ...tuple2 };
              result.push(combinedTuple);
            }
          }
        }

        const combinedAttributes = [
          ...relation.attributes,
          ...(otherRelation?.attributes || []),
        ];

        return {
          name: `${relationName1}_${relationName2}`,
          attributes: combinedAttributes,
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
            name: `${relationName1}_${relationName2}`,
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
            matchingRelation2.tuples.some((tuple2) => deepEqual(tuple1, tuple2))
          );
          return {
            name: `${relationName1}_${relationName2}`,
            attributes: matchingRelation1.attributes,
            tuples,
          };
        }
      } else if (operation === "minus" || operation === icons.minus) {
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
              !matchingRelation2.tuples.some((tuple2) =>
                deepEqual(tuple1, tuple2)
              )
          );
          return {
            name: `${relationName1}_${relationName2}`,
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

function createProjection(
  attributes: string[],
  tuple: Tuple,
  selectedAttributes: string[]
) {
  let newTuple: { [key: string]: any } = {};
  for (let attribute of selectedAttributes) {
    newTuple[attribute] = tuple[attribute];
  }
  return newTuple;
}

function getOtherRelation(
  relationName: string,
  relations: Relation[]
): Relation {
  return (
    relations.find((relation) => relation.name === relationName) || {
      name: "",
      attributes: [],
      tuples: [],
    }
  );
}

function evaluateCondition(condition: string, tuple: Tuple): boolean {
  // eslint-disable-next-line no-new-func
  const conditionFunction = new Function("tuple", `return tuple.${condition}`);
  return conditionFunction(tuple);
}

function deepEqual(obj1: any, obj2: any) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
