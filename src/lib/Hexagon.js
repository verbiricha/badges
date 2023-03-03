import "./Hexagon.css";
import { Flex } from "@chakra-ui/react";
import useColors from "./useColors";

export default function Hexagon({ alt = "", picture, ...rest }) {
  const { gradient } = useColors();
  return picture ? (
    <Flex className="hex" background={gradient} {...rest}>
      <img alt={alt} src={picture} />
    </Flex>
  ) : null;
}
