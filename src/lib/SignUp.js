import { Link } from "react-router-dom";
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

import useColors from "./useColors";
import { BadgeStatus } from "./BadgeProfile";
import ActionButton from "./ActionButton";

export default function SignUp() {
  const { highlight, secondary } = useColors();
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
      <ActionButton mt={4} width="100%">
        Sign up
      </ActionButton>
      <ActionButton mt={4} width="100%">
        Login with extension
      </ActionButton>
      <BadgeStatus my={6} state="not-collected">
        or
      </BadgeStatus>
      <FormControl>
        <FormLabel>Sign in with your npub</FormLabel>
        <Input type="text" placeholder="npub..." />
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
      <Button mt={4} width="100%">
        Sign In
      </Button>
    </Flex>
  );
}
