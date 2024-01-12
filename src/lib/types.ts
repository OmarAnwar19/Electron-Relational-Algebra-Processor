import { ChangeEvent } from "react";

export type Tuple = {
  [key: string]: string | number;
};

export type Relation = {
  name: string;
  attributes: string[];
  tuples: Tuple[];
};

export type RelAlgEvalProps = {
  initialRelations: Relation[];
  relations: Relation[];
  handleRelationChange: (value: string) => void;
  query: string;
  setQuery: (query: string) => void;
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleExecute: () => void;
  result: Relation | null;
};

export type ToolbarProps = {
  onClick: (icon: string) => void;
};
