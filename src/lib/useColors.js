import { useColorModeValue } from "@chakra-ui/react";

export default function useColors() {
  const fg = useColorModeValue("#1C1A38", "white");
  const bg = useColorModeValue("white", "#1C1A38");
  const surface = useColorModeValue("#F3E7CF", "rgba(43, 40, 83, 0.8);");
  const border = useColorModeValue("#F3E7CF", "#3A3767");
  const secondary = useColorModeValue("#666666", "#CCCCF8");
  const highlight = useColorModeValue("#3A3767", "#03D1FF");
  const subtleGradient = useColorModeValue(
    "linear-gradient(180deg, rgba(255,255,255,.3), rgba(255,255,255,0))",
    "linear-gradient(180deg, rgba(0,0,0,.3), rgba(0,0,0,0))"
  );

  return {
    fg,
    bg,
    subtleGradient,
    secondary,
    surface,
    highlight,
    border,
  };
}
