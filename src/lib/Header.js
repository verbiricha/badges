import { Link } from "react-router-dom";
import { Flex, Heading } from "@chakra-ui/react";

import Login from "./Login";

export default function Header() {
  return (
    <Flex alignItems="center" justifyContent="space-between" as="header" p={4}>
      <Link to="/">
        <Heading as="h1">Badge</Heading>
      </Link>
      <Login />
    </Flex>
  );
}
