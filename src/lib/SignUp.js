import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { nip19 } from "nostr-tools";
import {
  Flex,
  Button,
  Heading,
  Text,
  Image,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";

import useColors from "./useColors";
import { BadgeStatus } from "./BadgeProfile";
import ActionButton from "./ActionButton";
import useLoggedInUser from "./useLoggedInUser";
import { getPubkey } from "./useNip05";
import { setUser } from "../relaysStore";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [npub, setNpub] = useState("");
  const { highlight, secondary } = useColors();
  const { user, logIn } = useLoggedInUser();

  async function loginWithNpub() {
    // todo: nip-05
    try {
      if (npub.startsWith("npub")) {
        const decoded = nip19.decode(npub);
        if (decoded && decoded.type === "npub") {
          dispatch(setUser(decoded.data));
        }
      } else {
        const pk = await getPubkey(npub);
        if (pk) {
          dispatch(setUser(pk));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (user) {
      navigate(`/p/${user}`);
    }
  }, [user]);

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      width="340px"
      margin="0 auto"
    >
      <Image src="/badges.png" alt="Badges" width="270px" height="280px" />
      <Heading fontSize="2xl" mt={6} mb={4}>
        Manage Nostr Badges
      </Heading>
      <Text color={secondary}>
        Sign up for a new account or enter existing keys to sign in!
      </Text>
      <ActionButton isDisabled mt={4} width="100%">
        Sign up
      </ActionButton>
      {window.nostr && (
        <ActionButton mt={4} width="100%" onClick={logIn}>
          Login with extension
        </ActionButton>
      )}
      <BadgeStatus my={6} state="not-collected">
        or
      </BadgeStatus>
      <FormControl>
        <FormLabel>Sign in with your npub</FormLabel>
        <Input
          type="text"
          placeholder="npub..."
          value={npub}
          onChange={(e) => setNpub(e.target.value)}
        />
        <FormHelperText>
          We recommend using an extension such as{" "}
          <Link isExternal to="https://getalby.com/">
            <Text as="span" color={highlight}>
              Alby
            </Text>
          </Link>{" "}
          to log in.
        </FormHelperText>
      </FormControl>
      <Button mt={4} width="100%" onClick={loginWithNpub}>
        Sign In
      </Button>
    </Flex>
  );
}
