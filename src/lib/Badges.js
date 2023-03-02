import "./Badges.css";
import {
  Flex,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import { useNostrEvents, useProfile } from "../nostr";
import Bevel from "./Bevel";
import Hexagon from "./Hexagon";
import Badge from "./Badge";
import Username from "./Username";
import Bio from "./Bio";
import useColors from "./useColors";

const BADGE_AWARD = 8;
const BADGE_DEFINITION = 30009;
const PROFILE_BADGES = 30008;

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
      //"#p": [pubkey],
    },
  });
  return events;
}

function Awarded({ pubkey }) {
  const awarded = useAwardedBadges(pubkey);
  return (
    <Flex flexDirection="column" className="badge-list">
      {JSON.stringify(awarded.events)}
    </Flex>
  );
}

function useProfileBadges(pubkey) {
  const profile = useNostrEvents({
    filter: {
      kinds: [PROFILE_BADGES],
      "#d": ["profile_badges"],
      authors: [pubkey],
    },
  });
  return profile.events;
}

function Accepted({ pubkey }) {
  const profile = useProfileBadges(pubkey);
  return (
    <Flex flexDirection="column" className="badge-list">
      {JSON.stringify(profile.events)}
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
          <Tab>Created</Tab>
          <Tab>Awarded</Tab>
          <Tab>Accepted</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <Created pubkey={pubkey} />
          </TabPanel>
          <TabPanel px={0}>
            <Awarded pubkey={pubkey} />
          </TabPanel>
          <TabPanel px={0}>
            <Accepted pubkey={pubkey} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
