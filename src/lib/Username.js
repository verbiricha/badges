import { Link } from "react-router-dom";

import { Heading, Text } from "@chakra-ui/react";

import { useProfile } from "../nostr";

export default function Username({ isHeading = false, pubkey, ...rest }) {
  const { data } = useProfile({ pubkey });
  const { name } = data || {};
  const href = `/p/${pubkey}`;
  const shortPubkey = pubkey && `${pubkey.slice(0, 6)}:${pubkey.slice(-6)}`;

  return (
    <Link to={href}>
      {isHeading ? (
        <Heading {...rest}>{name || shortPubkey}</Heading>
      ) : (
        <Text as="span" {...rest}>
          {name || shortPubkey}
        </Text>
      )}
    </Link>
  );
}
