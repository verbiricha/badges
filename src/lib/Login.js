import { Link } from "react-router-dom";
import { useColorMode, Flex, Button } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import ActionButton from "./ActionButton";
import User from "./User";
import useLoggedInUser from "./useLoggedInUser";

export default function Login() {
  const { user, logIn } = useLoggedInUser();
  const { colorMode, toggleColorMode } = useColorMode();

  const themeSelector = (
    <Button variant="unstyled" onClick={toggleColorMode}>
      {colorMode === "light" ? (
        <MoonIcon color="secondary.500" />
      ) : (
        <SunIcon color="warning.500" />
      )}
    </Button>
  );

  return user ? (
    <Flex alignItems="center">
      {themeSelector}
      <Link to="/new">
        <ActionButton mr={2}>New</ActionButton>
      </Link>
      <User size={["sm", "sm", "md"]} showUsername={false} pubkey={user} />
    </Flex>
  ) : (
    <Flex>
      {themeSelector}
      {window.nostr && (
        <Button size="md" onClick={logIn}>
          Login
        </Button>
      )}
    </Flex>
  );
}
