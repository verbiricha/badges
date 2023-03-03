import { Flex, Text, Link } from "@chakra-ui/react";
import useColors from "./useColors";

export default function Footer() {
  const { highlight, secondary } = useColors();
  return (
    <Flex
      color={secondary}
      mt={16}
      padding={4}
      justifyContent="center"
      as="footer"
    >
      <Text textAlign="center" fontSize="sm">
        Made with 💜 by{" "}
        <Link
          color={highlight}
          href="/p/1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411"
        >
          Karnage
        </Link>{" "}
        &{" "}
        <Link
          color={highlight}
          href="/p/7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194"
        >
          verbiricha
        </Link>
      </Text>
    </Flex>
  );
}
