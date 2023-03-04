import { useMemo } from "react";
import { useNostrEvents, findTag } from "../nostr";
import { BADGE_AWARD, BADGE_DEFINITION, PROFILE_BADGES } from "../Const";

export function useAwardedBadges(pubkey) {
  const { events } = useNostrEvents({
    filter: {
      kinds: [BADGE_AWARD],
      "#p": [pubkey],
    },
  });

  const dTags = useMemo(() => {
    return events.map((ev) => findTag(ev.tags, "a")?.split(":").at(2));
  }, [events]);

  const pubkeys = useMemo(() => {
    return events.map((ev) => findTag(ev.tags, "a")?.split(":").at(1));
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
      authors: pubkeys,
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

export function useAcceptedBadges(pubkey) {
  const { events } = useNostrEvents({
    filter: {
      kinds: [PROFILE_BADGES],
      "#d": ["profile_badges"],
      authors: [pubkey],
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
