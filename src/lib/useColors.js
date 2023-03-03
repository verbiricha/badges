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
  const gradient = useColorModeValue(
    "linear-gradient(90deg, #E09641 0%, #F07157 25.52%, #EA537C 50%, #DC4A92 72.92%, #B04EB6 100%)",
    "linear-gradient(90deg, #3145FF 0%, #9A23DF 26.04%, #DD00A3 53.65%, #F30274 77.6%, #F22755 100%)"
  );

  return {
    fg,
    bg,
    subtleGradient,
    gradient,
    secondary,
    surface,
    highlight,
    border,
  };
}
