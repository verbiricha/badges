import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Flex,
  Heading,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import ArrowDownIcon from "../icons/ArrowDown";
import Login from "./Login";
import { RelayFavicon } from "./Relays";
import useRelays from "./useRelays";
import useColors from "./useColors";

export default function Header() {
  return (
    <Flex alignItems="center" justifyContent="space-between" as="header" p={4}>
      <Link to="/">
        <Heading as="h1" display={["none", "none", "block"]}>
          Badge
        </Heading>
      </Link>
      <Login />
    </Flex>
  );
}
