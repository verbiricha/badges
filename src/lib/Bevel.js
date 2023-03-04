import { useColorModeValue, Box } from "@chakra-ui/react";

import Star from "../icons/Star";

export default function Bevel({ width = "360px", children }) {
  const bg = useColorModeValue("", "url(/bg-profile.png)");
  return (
    <Box
      position="relative"
      className="bevel-out"
      background={bg}
      backgroundSize="cover"
      width={width}
      minHeight="360px"
    >
      <Box className="bevel">
        <Box position="absolute" top="36px" left="32px">
          <Star />
        </Box>
        <Box position="absolute" top="36px" right="32px">
          <Star />
        </Box>
        {children}
      </Box>
    </Box>
  );
}
