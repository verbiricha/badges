import { Text } from "@chakra-ui/react";

import { useProfile } from "../nostr";

export default function Bio({ pubkey, ...rest }) {
  const { data } = useProfile({ pubkey });
  const { about } = data || {};

  return (
    <Text as="span" {...rest}>
      {about}
    </Text>
  );
}
