import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import icons from "../lib/icons"; // import the icons object

// define the type of the Toolbar component
const Toolbar = ({ onClick }) => {
  return (
    <ButtonGroup style={{ width: "100%" }}>
      <Button style={{ padding: "8px" }} onClick={() => onClick("σ")}>
        {icons.sigma}
      </Button>
      <Button style={{ padding: "8px" }} onClick={() => onClick("π")}>
        {icons.pi}
      </Button>
      <Button style={{ padding: "8px" }} onClick={() => onClick("ρ")}>
        {icons.rho}
      </Button>
      <Button style={{ padding: "8px" }} onClick={() => onClick("∪")}>
        {icons.union}
      </Button>
      <Button style={{ padding: "8px" }} onClick={() => onClick("∩")}>
        {icons.intersection}
      </Button>
      <Button style={{ padding: "8px" }} onClick={() => onClick("⋈")}>
        {icons.bowtie}
      </Button>
      <Button style={{ padding: "8px" }} onClick={() => onClick("-")}>
        {icons.dash}
      </Button>
    </ButtonGroup>
  );
};

export default Toolbar;
