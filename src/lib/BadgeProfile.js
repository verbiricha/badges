import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useToast,
  Flex,
  Image,
  Heading,
  Text,
  FormControl,
  Button,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { nip19 } from "nostr-tools";

import {
  signEvent,
  dateToUnix,
  useNostr,
  useNostrEvents,
  findTag,
  encodeNaddr,
} from "../nostr";

import { BADGE_AWARD, BADGE_DEFINITION, CONTACT_LIST } from "../Const";
import { getPubkey } from "./useNip05";
import ActionButton from "./ActionButton";
import User from "./User";
import Bevel from "./Bevel";
import Markdown from "./Markdown";
import Username from "./Username";
import useColors from "./useColors";

export function BadgeStatus({ state, children, ...rest }) {
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

function AwardBadge({ ev, ...rest }) {
  const { user, privateKey } = useSelector((s) => s.relay);
  const toast = useToast();
  const d = findTag(ev.tags, "d");
  const { publish } = useNostr();
  const [value, setValue] = useState("");
  const [hexValue, setHexValue] = useState("");
  const [ps, setPs] = useState([]);
  const { secondary } = useColors();

  async function bulkAdd() {
    const newPs = hexValue
      .split(/\s+/)
      .map((p) => {
        if (p.startsWith("npub")) {
          try {
            const decoded = nip19.decode(p);
            return decoded.data;
          } catch (error) {
            console.error(error);
            return p;
          }
        } else {
          return p;
        }
      })
      .filter((p) => p.match(/[0-9A-Fa-f]{64}/g));
    setPs([...new Set([...ps, ...newPs])]);
    setHexValue("");
  }

  async function addUser() {
    try {
      const pk = await getPubkey(value);
      if (pk) {
        setPs((_ps) => ps.concat([pk]));
        setValue("");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function awardBadge() {
    const award = {
      kind: BADGE_AWARD,
      created_at: dateToUnix(),
      content: "",
      pubkey: user,
      tags: [
        ["a", `${BADGE_DEFINITION}:${ev.pubkey}:${d}`],
        ...ps.map((p) => ["p", p]),
      ],
    };
    try {
      const signed = await signEvent(award, privateKey);
      publish(signed);

      toast({
        title: "Badge awarded",
        status: "success",
      });

      setPs([]);
      setValue("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Flex alignItems="flex-start" flexDirection="column" {...rest}>
      <Heading fontSize="2xl" mb={4}>
        Award Badge
      </Heading>
      <Text color={secondary}>Add users by their npub or NIP-05:</Text>
      <FormControl mt={3}>
        <FormLabel>NIP-05</FormLabel>
        <Flex alignItems="center">
          <Input
            type="text"
            placeholder="NIP-05"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            isDisabled={value.trim().length === 0}
            ml={2}
            onClick={addUser}
          >
            Add
          </Button>
        </Flex>
      </FormControl>
      <FormControl mt={3}>
        <FormLabel>npub or HEX keys</FormLabel>
        <Flex alignItems="center">
          <Textarea
            placeholder="one or more npub/HEX keys"
            value={hexValue}
            onChange={(e) => setHexValue(e.target.value)}
          />
          <Button
            isDisabled={hexValue.trim().length === 0}
            ml={2}
            onClick={bulkAdd}
          >
            Add
          </Button>
        </Flex>
      </FormControl>
      <Flex flexDirection="column" mt={3}>
        {ps.map((p) => (
          <User showNip={false} key={p} mb={2} pubkey={p} />
        ))}
      </Flex>
      <ActionButton
        mt={12}
        width="100%"
        isDisabled={ps.length === 0}
        onClick={awardBadge}
      >
        Award badge
      </ActionButton>
    </Flex>
  );
}

export default function BadgeProfile({ ev, ...rest }) {
  const { user, badges, privateKey } = useSelector((s) => s.relay);
  const { publish } = useNostr();
  const toast = useToast();
  const isMine = user === ev.pubkey;
  const d = findTag(ev.tags, "d");
  const addr = `${BADGE_DEFINITION}:${ev.pubkey}:${d}`;
  const collected = badges.find((t) => t[0] === "a" && t[1] === addr);
  const { secondary, highlight } = useColors();
  const awards = useNostrEvents({
    filter: {
      kinds: [BADGE_AWARD],
      "#a": [addr],
      authors: [ev.pubkey],
    },
  });

  const following = useNostrEvents({
    filter: {
      kinds: [CONTACT_LIST],
      authors: [user],
    },
  });

  const name = findTag(ev.tags, "name");
  const description = findTag(ev.tags, "description");
  const image = findTag(ev.tags, "image");
  const naddr = encodeNaddr(ev);
  //const thumb = findTag(ev.tags, "thumb");
  async function followPubKeys(awardEvents) {
    const followEvent = {
      kind: CONTACT_LIST,
      tags: [],
      created_at: dateToUnix(),
      pubkey: user,
    };
    const pubkeysToAdd = awardEvents.reduce((accumulator, a) => {
      return accumulator.concat(
        a.tags
          .filter((t) => t[0] === "p" && t[1]?.match(/[0-9A-Fa-f]{64}/g))
          .map((t) => t[1])
      );
    }, []);
    const kind3Event = following.events[0];
    let existingPubKeys = kind3Event?.tags?.map((t) => t[1]);
    if (!existingPubKeys) {
      toast({
        title: "Could not fetch contact list",
        status: "warning",
      });
      return;
    }
    followEvent.content = kind3Event.content;
    const temp = new Set(existingPubKeys);
    for (const pubKey of pubkeysToAdd) {
      temp.add(pubKey);
    }
    for (const pk of temp) {
      if (pk.length !== 64) {
        continue;
      }
      followEvent.tags.push(["p", pk]);
    }
    try {
      const signed = await signEvent(followEvent, privateKey);
      publish(signed);

      toast({
        title: "Followed All Awardees",
        status: "success",
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Flex flexDirection="column" alignItems="center">
      <Bevel>
        <Flex padding={2} alignItems="center" flexDirection="column">
          {image && (
            <Image mt={16} alt={name} src={image} width="auto" height="210px" />
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
          <Heading textAlign="center" fontSize="2xl">
            {name}
          </Heading>
        </Flex>
      </Bevel>
      <Flex
        color={secondary}
        flexDirection="column"
        width="260px"
        fontSize="md"
        fontWeight={500}
        textAlign="center"
        className="badge-description"
      >
        <Markdown content={description} />
      </Flex>
      <Flex
        mt={8}
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
      {isMine && (
        <Link to={`/b/${naddr}/edit`}>
          <Button mt={4}>Edit</Button>
        </Link>
      )}
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
      {isMine && <AwardBadge mt={4} mb={6} ev={ev} />}
      <Button
        onClick={() => {
          followPubKeys(awards.events.reverse());
        }}
      >
        Follow All Awardees
      </Button>
      {awards.events.reverse().map((a) => {
        return (
          <Flex
            width="280px"
            alignItems="flex-start"
            flexDirection="column"
            key={a.id}
            overflow="hidden"
          >
            <Heading fontSize="xl" my={4}>
              Award
            </Heading>
            {a.tags
              .filter((t) => t[0] === "p" && t[1]?.match(/[0-9A-Fa-f]{64}/g))
              .map((t) => {
                return <User showNip={false} mb={2} pubkey={t[1]} />;
              })}
          </Flex>
        );
      })}
    </Flex>
  );
}
