export const unaryOps: string[] = ["select", "project", "rename"];
export const unaryIcons: { [key: string]: string } = {
  sigma: "σ",
  pi: "π",
  rho: "ρ",
};

export const binaryOps: string[] = ["union", "intersect", "minus", "join"];
export const binaryIcons: { [key: string]: string } = {
  bowtie: "⋈",
  cartesian: "×",
  union: "∪",
  intersection: "∩",
  minus: "-",
};

export const icons: { [key: string]: string } = {
  ...unaryIcons,
  ...binaryIcons,
};

export const operations: string[] = [...unaryOps, ...binaryOps];
