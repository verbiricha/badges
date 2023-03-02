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
          href="nostr:npub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac"
          isExternal
        >
          Karnage
        </Link>{" "}
        &{" "}
        <Link
          color={highlight}
          href="nostr:npub107jk7htfv243u0x5ynn43scq9wrxtaasmrwwa8lfu2ydwag6cx2quqncxg"
          isExternal
        >
          verbiricha
        </Link>
      </Text>
    </Flex>
  );
}
