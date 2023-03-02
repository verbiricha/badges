import "./Badges.css";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useToast,
  Button,
  Flex,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import {
  dateToUnix,
  useNostr,
  useNostrEvents,
  useProfile,
  findTag,
  sign,
} from "../nostr";
import Bevel from "./Bevel";
import Hexagon from "./Hexagon";
import Badge from "./Badge";
import Username from "./Username";
import Bio from "./Bio";
import useColors from "./useColors";
import { BADGE_AWARD, BADGE_DEFINITION, PROFILE_BADGES } from "../Const";

function Created({ pubkey }) {
  const { events } = useNostrEvents({
    filter: {
      kinds: [BADGE_DEFINITION],
      authors: [pubkey],
    },
  });
  return (
    <Flex flexDirection="column" className="badge-list">
      {events.map((ev) => (
        <Badge width="340px" key={ev.id} mb={3} ev={ev} />
      ))}
    </Flex>
  );
}

function useAwardedBadges(pubkey) {
  const { events } = useNostrEvents({
    filter: {
      kinds: [BADGE_AWARD],
      "#p": [pubkey],
    },
  });

  const dTags = useMemo(() => {
    return events.map((ev) => findTag(ev.tags, "a")?.split(":").at(2));
  }, [events]);

  const dTagsById = useMemo(() => {
    const dAndId = events.map((ev) => [
      findTag(ev.tags, "a")?.split(":").at(2),
      ev.id,
    ]);
    return dAndId.reduce((acc, [d, id]) => {
      return { ...acc, [d]: id };
    }, {});
  }, [events]);

  const badges = useNostrEvents({
    filter: {
      kinds: [BADGE_DEFINITION],
      "#d": dTags,
    },
  });

  return badges.events.map((b) => {
    const d = findTag(b.tags, "d");
    const award = dTagsById[d];
    return {
      badge: b,
      award,
    };
  });
}

function Awarded({ pubkey }) {
  const toast = useToast();
  const { publish } = useNostr();
  const { user, badges } = useSelector((s) => s.relay);
  const accepted = useAcceptedBadges(pubkey);
  const awarded = useAwardedBadges(pubkey);
  const aTags = accepted.filter((t) => t[0] === "a").map((t) => t[1]);
  const isMe = pubkey === user;

  return (
    <Flex flexDirection="column" className="badge-list">
      {awarded.map(({ badge, award }) => {
        const d = findTag(badge.tags, "d");
        const atag = `${badge.kind}:${badge.pubkey}:${d}`;
        // todo: accept/reject
        if (isMe && aTags.includes(atag)) {
          return null;
        }
        const accept = [
          ["a", atag],
          ["e", award],
        ];
        async function acceptBadge() {
          if (!isMe) {
            return;
          }
          const ev = {
            kind: PROFILE_BADGES,
            created_at: dateToUnix(),
            tags: [["d", "profile_badges"], ...badges, ...accept],
            content: "",
          };
          try {
            const signed = await sign(ev);
            publish(signed);
            toast({
              title: "Badge accepted",
              status: "success",
            });
          } catch (error) {
            console.error(error);
          }
        }
        return (
          <Badge width="340px" key={badge.id} mb={3} ev={badge}>
            {isMe && (
              <HStack mt={2} spacing={2}>
                <Button colorScheme="green" onClick={acceptBadge}>
                  Accept
                </Button>
                <Button isDisabled>Reject</Button>
              </HStack>
            )}
          </Badge>
        );
      })}
    </Flex>
  );
}

function AcceptedBadge({ e, a }) {
  const awards = useNostrEvents({
    filter: {
      ids: [e],
      kinds: [BADGE_AWARD],
    },
  });
  const award = awards.events[0];

  const [k, pubkey, d] = a.split(":");
  const definitions = useNostrEvents({
    filter: {
      kinds: [Number(k)],
      "#d": [d],
      authors: [pubkey],
    },
  });
  const badge = definitions.events[0];

  return (
    badge &&
    award &&
    badge.pubkey === award.pubkey && <Badge mb={3} width="340px" ev={badge} />
  );
}

function chunks(array, chunkSize) {
  let result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

function useAcceptedBadges(pubkey) {
  const { events } = useNostrEvents({
    filter: {
      kinds: [PROFILE_BADGES],
      "#d": ["profile_badges"],
      authors: [pubkey],
    },
  });
  const ev = events[0];
  return (ev?.tags ?? []).filter((t) => t[0] === "a" || t[0] === "e");
}

function Accepted({ pubkey }) {
  const badges = useAcceptedBadges(pubkey);
  return (
    <Flex flexDirection="column" className="badge-list">
      {chunks(badges, 2).map(([a, e]) => (
        <AcceptedBadge a={a[1]} e={e[1]} />
      ))}
    </Flex>
  );
}

export default function Badges({ pubkey }) {
  const { data } = useProfile({ pubkey });
  const { user } = useSelector((s) => s.relay);
  const { secondary } = useColors();
  return (
    <Flex flexDirection="column" alignItems="center">
      <Bevel>
        <Flex padding={2} alignItems="center" flexDirection="column">
          {data?.picture && (
            <Hexagon mt={8} alt={data?.name} picture={data.picture} />
          )}
          <Username isHeading={true} pubkey={pubkey} />
          <Bio
            color={secondary}
            mt={2}
            fontSize="16px"
            fontWeight={500}
            lineHeight="22px"
            textAlign="center"
            pubkey={pubkey}
          />
        </Flex>
      </Bevel>
      <Tabs width="340px">
        <TabList justifyContent="space-around" borderBottom="none">
          <Tab>Accepted</Tab>
          <Tab>Awarded</Tab>
          <Tab>Created</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <Accepted pubkey={pubkey} />
          </TabPanel>
          <TabPanel px={0}>
            <Awarded pubkey={pubkey} />
          </TabPanel>
          <TabPanel px={0}>
            <Created pubkey={pubkey} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
