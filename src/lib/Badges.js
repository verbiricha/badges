import "./Badges.css";
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
  signEvent,
} from "../nostr";
import Bevel from "./Bevel";
import Hexagon from "./Hexagon";
import Badge from "./Badge";
import Username from "./Username";
import Bio from "./Bio";
import useColors from "./useColors";
import { BADGE_AWARD, BADGE_DEFINITION, PROFILE_BADGES } from "../Const";
import { useAwardedBadges, useAcceptedBadges } from "./useBadges";

function Created({ pubkey }) {
  const { events } = useNostrEvents({
    filter: {
      kinds: [BADGE_DEFINITION],
      authors: [pubkey],
      limit: 1,
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

function Awarded({ pubkey }) {
  const toast = useToast();
  const { publish } = useNostr();
  const { user, badges, privateKey } = useSelector((s) => s.relay);
  const accepted = useAcceptedBadges(pubkey);
  const awarded = useAwardedBadges(pubkey);
  const aTags = accepted.filter((t) => t[0] === "a").map((t) => t[1]);
  const isMe = pubkey === user;

  return (
    <Flex flexDirection="column" className="badge-list">
      {awarded.map(({ badge, award }) => {
        const d = findTag(badge.tags, "d");
        const atag = `${badge.kind}:${badge.pubkey}:${d}`;
        const accept = [
          ["a", atag],
          ["e", award],
        ];
        async function acceptBadge() {
          const ev = {
            kind: PROFILE_BADGES,
            created_at: dateToUnix(),
            pubkey: user,
            tags: [["d", "profile_badges"], ...badges, ...accept],
            content: "",
          };
          try {
            const signed = await signEvent(ev, privateKey);
            publish(signed);
            toast({
              title: "Badge accepted",
              status: "success",
            });
          } catch (error) {
            console.error(error);
          }
        }
        async function rejectBadge() {
          const filteredBadges = chunks(badges, 2)
            .filter(([a, e]) => e[1] !== award)
            .flat();
          const ev = {
            kind: PROFILE_BADGES,
            created_at: dateToUnix(),
            pubkey: user,
            tags: [["d", "profile_badges"], ...filteredBadges],
            content: "",
          };
          try {
            const signed = await signEvent(ev, privateKey);
            publish(signed);
            toast({
              title: "Badge rejected",
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
                <Button
                  isDisabled={aTags.includes(atag)}
                  colorScheme="purple"
                  onClick={acceptBadge}
                >
                  Accept
                </Button>
                <Button
                  isDisabled={!aTags.includes(atag)}
                  onClick={rejectBadge}
                >
                  Hide
                </Button>
              </HStack>
            )}
          </Badge>
        );
      })}
    </Flex>
  );
}

function AcceptedBadge({ user, e, a }) {
  const awards = useNostrEvents({
    filter: {
      ids: [e],
      kinds: [BADGE_AWARD],
      "#a": [a],
      "#p": [user],
    },
  });
  const award = awards.events[0];

  const [k, pubkey, d] = a.split(":");
  const definitions = useNostrEvents({
    filter: {
      kinds: [Number(k)],
      "#d": [d],
      authors: [pubkey],
      limit: 1,
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

function Accepted({ pubkey }) {
  const badges = useAcceptedBadges(pubkey);
  return (
    <Flex flexDirection="column" className="badge-list">
      {chunks(badges, 2).map(([a, e]) => (
        <AcceptedBadge user={pubkey} key={a[1]} a={a[1]} e={e[1]} />
      ))}
    </Flex>
  );
}

export default function Badges({ pubkey }) {
  const { data } = useProfile({ pubkey });
  const { secondary } = useColors();
  return (
    <Flex flexDirection="column" alignItems="center">
      <Bevel>
        <Flex padding={2} alignItems="center" flexDirection="column">
          {data?.picture ? (
            <Hexagon mt={12} alt={data?.name} picture={data.picture} />
          ) : (
            <Hexagon
              mt={12}
              alt={data?.name}
              picture={
                "https://nostr.build/i/nostr.build_ebc4b655ecfed5e51fec816f4e2fd0daf242e29bfe6af70f2cdb524099a601b2.png"
              }
            />
          )}
          <Username
            fontSize="2xl"
            fontWeight={700}
            isHeading={true}
            pubkey={pubkey}
            textAlign="center"
          />
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
      <Tabs mt={4} width="340px">
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
