import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { nip19 } from "nostr-tools";
import {
  useToast,
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
import { generatePrivateKey, getPublicKey } from "nostr-tools";

import useColors from "./useColors";
import { BadgeStatus } from "./BadgeProfile";
import ActionButton from "./ActionButton";
import useLoggedInUser from "./useLoggedInUser";
import { setUser, setPrivateKey } from "../relaysStore";

export default function SignUp() {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nsec, setNsec] = useState("");
  const { highlight, secondary } = useColors();
  const { user, logIn } = useLoggedInUser();

  async function loginWithNsec() {
    try {
      if (nsec.startsWith("nsec")) {
        const decoded = nip19.decode(nsec);
        if (decoded && decoded.type === "nsec") {
          dispatch(setUser(getPublicKey(decoded.data)));
          dispatch(setPrivateKey(decoded.data));
        }
      } else {
        setNsec("");
        toast({
          title: "Invalid nsec",
          status: "error",
        });
      }
    } catch (error) {
      setNsec("");
      toast({
        title: "Invalid nsec",
        status: "error",
      });
      console.error(error);
    }
  }

  function signUp() {
    const priv = generatePrivateKey();
    const pk = getPublicKey(priv);
    dispatch(setPrivateKey(priv));
    dispatch(setUser(pk));
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
      <ActionButton mt={4} width="100%" onClick={signUp}>
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
        <FormLabel>Sign in with your nsec</FormLabel>
        <Input
          type="text"
          placeholder="nsec..."
          value={nsec}
          onChange={(e) => setNsec(e.target.value)}
        />
        <FormHelperText>
          We recommend using an extension such as{" "}
          <Link to="https://getalby.com/">
            <Text as="span" color={highlight}>
              Alby
            </Text>
          </Link>{" "}
          to log in.
        </FormHelperText>
      </FormControl>
      <Button mt={4} width="100%" onClick={loginWithNsec}>
        Sign In
      </Button>
    </Flex>
  );
}
