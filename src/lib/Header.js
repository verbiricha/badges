import { Link } from "react-router-dom";
import { Flex, Heading } from "@chakra-ui/react";

import Login from "./Login";

export default function Header() {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      as="header"
      p={4}
      height="80px"
    >
      <Link to="/">
        <Heading as="h1">Badges</Heading>
      </Link>
      <Login />
    </Flex>
  );
}
