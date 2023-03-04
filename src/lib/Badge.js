import { Link } from "react-router-dom";
import { Box, Flex, Image, Heading, Text } from "@chakra-ui/react";

import { encodeNaddr, findTag } from "../nostr";

import Username from "./Username";
import useColors from "./useColors";

export default function Badge({ ev, children, ...rest }) {
  const d = findTag(ev.tags, "d");
  const { surface, border, secondary, highlight } = useColors();
  const name = findTag(ev.tags, "name");
  const description = findTag(ev.tags, "description");
  const image = findTag(ev.tags, "image");
  const thumb = findTag(ev.tags, "thumb");
  const href = `/b/${encodeNaddr(ev)}`;
  return (
    <Flex
      flexDirection="column"
      background={surface}
      borderRadius="23px"
      border="2px solid"
      maxWidth="420px"
      padding={4}
      borderColor={border}
      {...rest}
    >
      <Flex flexDirection="row" alignItems="flex-start">
        <Link to={href}>
          <Box mr={2}>
            <Image
              src={image || thumb}
              alt={name}
              maxWidth="60px"
              fallbackSrc="https://via.placeholder.com/60"
            />
          </Box>
        </Link>
        <Flex alignItems="flex-start" flexDirection="column">
          <Link to={href}>
            <Heading fontSize="16px" fontWeight={700} lineHeight="23px">
              {name || d}
            </Heading>
          </Link>
          <Flex color={secondary} pt={0}>
            <Text fontSize="13px" fontWeight={500} lineHeight="19px">
              {description}
            </Text>
          </Flex>
          <Text mt={1} fontSize="xs">
            By: <Username color={highlight} pubkey={ev.pubkey} />
          </Text>
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}
