import "./Hexagon.css";
import { Flex } from "@chakra-ui/react";

export default function Hexagon({ alt = "", picture, ...rest }) {
  return picture ? (
    <Flex className="hex" {...rest}>
      <img alt={alt} src={picture} />
    </Flex>
  ) : null;
}
