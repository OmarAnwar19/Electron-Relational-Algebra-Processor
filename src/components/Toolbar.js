import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { icons } from "../lib/iconsOps"; // import the icons object

// define the type of the Toolbar component
const Toolbar = ({ onClick }) => {
  return (
    <ButtonGroup style={{ width: "100%" }}>
      <Button
        style={{ padding: "8px" }}
        onClick={() => onClick(`${icons.sigma}`)}
      >
        {icons.sigma}
      </Button>
      <Button style={{ padding: "8px" }} onClick={() => onClick(`${icons.pi}`)}>
        {icons.pi}
      </Button>
      <Button
        style={{ padding: "8px" }}
        onClick={() => onClick(`${icons.rho}`)}
      >
        {icons.rho}
      </Button>
      <Button
        style={{ padding: "8px" }}
        onClick={() => onClick(`${icons.union}`)}
      >
        {icons.union}
      </Button>
      <Button
        style={{ padding: "8px" }}
        onClick={() => onClick(`${icons.intersection}`)}
      >
        {icons.intersection}
      </Button>
      <Button
        style={{ padding: "8px" }}
        onClick={() => onClick(`${icons.bowtie}`)}
      >
        {icons.bowtie}
      </Button>
      <Button
        style={{ padding: "8px" }}
        onClick={() => onClick(`${icons.minus}`)}
      >
        {icons.minus}
      </Button>
    </ButtonGroup>
  );
};

export default Toolbar;
