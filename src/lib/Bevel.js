import "./Bevel.css";

import { useColorModeValue, Box } from "@chakra-ui/react";

import useColors from "./useColors";

export default function Bevel({
  height = "360px",
  width = "360px",
  border = "1px",
  children,
}) {
  const { bg } = useColors();
  const [from, to] = useColorModeValue(
    ["rgba(0,0,0,.3)", "rgba(0,0,0,0)"],
    ["rgba(255,255,255,.3)", "rgba(255,255,255,0)"]
  );
  return (
    <Box
      style={{ "--width": "360px", "--height": height, "--border": "1px" }}
      className="bevel-out"
      background={`linear-gradient(180deg, ${from}, ${to});`}
    >
      <Box className="bevel" background={bg}>
        {children}
      </Box>
    </Box>
  );
}
