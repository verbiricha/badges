import { Link } from "react-router-dom";
import { Button, Box, Flex, Image, Heading, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";

import { useNostrEvents, encodeNaddr, findTag } from "../nostr";

import Hexagon from "./Hexagon";
import Bevel from "./Bevel";
import Username from "./Username";
import useColors from "./useColors";

function BadgeStatus({ state, children, ...rest }) {
  const color = (() => {
    switch (state) {
      case "collected":
        return "#85EFBC";
      case "not-collected":
        return "#9F9FC9";
      default:
        return "#cF85EF";
    }
  })();
  return (
    <Text
      textTransform="uppercase"
      fontWeight={500}
      lineHeight="24px"
      fontSize="13px"
      color={color}
      {...rest}
    >
      {children}
    </Text>
  );
}

export default function BadgeProfile({ ev, ...rest }) {
  const { user } = useSelector((s) => s.relay);
  const isMine = user === ev.pubkey;
  const collected = false;
  const { fg, surface, border, secondary, highlight } = useColors();
  const d = findTag(ev.tags, "d");
  const awards = useNostrEvents({
    filter: {
      kind: 8,
      "#a": [`30009:${ev.pubkey}:${d}`],
    },
  });
  const name = findTag(ev.tags, "name");
  const description = findTag(ev.tags, "description");
  const image = findTag(ev.tags, "image");
  const thumb = findTag(ev.tags, "thumb");
  return (
    <Flex flexDirection="column" alignItems="center">
      <Bevel>
        <Flex padding={2} alignItems="center" flexDirection="column">
          {image && (
            <Image
              mt={12}
              alt={name}
              src={image}
              width="210px"
              height="210px"
            />
          )}
          {isMine && <BadgeStatus mt={2}>Created by you</BadgeStatus>}
          {!isMine && !collected && (
            <BadgeStatus mt={2} state="not-collected">
              Not collected
            </BadgeStatus>
          )}
          {!isMine && collected && (
            <BadgeStatus mt={2} state="collected">
              Collected
            </BadgeStatus>
          )}
          <Heading fontSize="3xl">{name}</Heading>
        </Flex>
      </Bevel>
      <Flex color={secondary} width="260px">
        <Text
          color={secondary}
          fontSize="16px"
          fontWeight={500}
          lineHeight="24px"
          textAlign="center"
        >
          {description}
        </Text>
      </Flex>
      <Flex
        mt={3}
        color={secondary}
        width="260px"
        justifyContent="space-between"
      >
        <Text>Date Created</Text>
        <Text>
          {new Intl.DateTimeFormat("en-US").format(
            new Date(ev.created_at * 1000)
          )}
        </Text>
      </Flex>
      <Flex
        mt={3}
        color={secondary}
        width="260px"
        justifyContent="space-between"
      >
        <Text>Created by</Text>
        <Username color={highlight} pubkey={ev.pubkey} />
      </Flex>
      <Flex
        mt={3}
        mb={6}
        color={secondary}
        width="260px"
        justifyContent="space-between"
      >
        <Text>Times awarded</Text>
        <Text>{awards.events.length}</Text>
      </Flex>
      {!isMine && !collected && (
        <Text
          color={secondary}
          fontWeight={600}
          fontSize="13px"
          lineHeight="19px"
        >
          You have not collected this badge yet.
        </Text>
      )}
      {isMine && (
        <Button
          mt={12}
          width="260px"
          color="white"
          background="var(--gradient)"
        >
          Award badge
        </Button>
      )}
    </Flex>
  );
}
