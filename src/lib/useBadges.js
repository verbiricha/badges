import { useMemo } from "react";
import { useNostrEvents, findTag } from "../nostr";
import { BADGE_AWARD, BADGE_DEFINITION, PROFILE_BADGES } from "../Const";
import { chunks } from "./Util";

export function useAwardedBadges(pubkey) {
  const { events } = useNostrEvents({
    filter: {
      kinds: [BADGE_AWARD],
      "#p": [pubkey],
    },
  });

  const dTags = useMemo(() => {
    return events
      .map((ev) => findTag(ev.tags, "a")?.split(":").at(2))
      .filter((e) => e !== undefined);
  }, [events]);

  const pubkeys = useMemo(() => {
    return events.map((ev) => findTag(ev.tags, "a")?.split(":").at(1));
  }, [events]);

  const dTagsById = useMemo(() => {
    const dAndId = events
      .reverse()
      .map((ev) => [findTag(ev.tags, "a")?.split(":").at(2), ev.pubkey, ev.id]);
    return dAndId.reduce((acc, [d, pubkey, id]) => {
      return { ...acc, [`${pubkey}:${d}`]: id };
    }, {});
  }, [events]);

  const badges = useNostrEvents({
    filter: {
      kinds: [BADGE_DEFINITION],
      "#d": dTags.filter((d) => d.length > 0),
      authors: pubkeys,
    },
  });

  return badges.events
    .map((b) => {
      const d = findTag(b.tags, "d");
      const award = dTagsById[`${b.pubkey}:${d}`];
      return {
        badge: b,
        award,
      };
    })
    .filter(({ award }) => award);
}

export function useAcceptedBadges(pubkey) {
  const { events } = useNostrEvents({
    filter: {
      kinds: [PROFILE_BADGES],
      "#d": ["profile_badges"],
      authors: [pubkey],
      limit: 1,
    },
  });
  const sorted = useMemo(() => {
    const sorted = [...events];
    sorted.sort((a, b) => b.created_at - a.created_at);
    return sorted;
  }, [events]);
  const ev = sorted[0];
  return (ev?.tags ?? []).filter((t) => t[0] === "a" || t[0] === "e");
}
