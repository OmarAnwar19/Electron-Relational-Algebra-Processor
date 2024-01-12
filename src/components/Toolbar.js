import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { icons } from "../lib/iconsOps"; // import the icons object

// define the type of the Toolbar component
const Toolbar = ({ onClick }) => {
  const buttonStyle = {
    padding: "8px",
    fontSize: "16px",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <ButtonGroup style={{ width: "100%" }}>
      <Button style={buttonStyle} onClick={() => onClick(`${icons.sigma}`)}>
        {icons.sigma}
      </Button>
      <Button style={buttonStyle} onClick={() => onClick(`${icons.pi}`)}>
        {icons.pi}
      </Button>
      <Button style={buttonStyle} onClick={() => onClick(`${icons.rho}`)}>
        {icons.rho}
      </Button>
      <Button
        style={{ padding: "0px 2px 4px 2px", fontSize: "24px" }}
        onClick={() => onClick(`${icons.union}`)}
      >
        {icons.union}
      </Button>
      <Button
        style={buttonStyle}
        onClick={() => onClick(`${icons.intersection}`)}
      >
        {icons.intersection}
      </Button>
      <Button style={buttonStyle} onClick={() => onClick(`${icons.bowtie}`)}>
        {icons.bowtie}
      </Button>
      <Button style={buttonStyle} onClick={() => onClick(`${icons.minus}`)}>
        {icons.minus}
      </Button>
    </ButtonGroup>
  );
};

export default Toolbar;
