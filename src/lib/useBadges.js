import { useMemo } from "react";
import { useNostrEvents, findTag, uniqByFn, getEventId } from "../nostr";
import { BADGE_AWARD, BADGE_DEFINITION, PROFILE_BADGES } from "../Const";

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

  const pubkeysWithEmptyDTag = useMemo(() => {
    return events
      .filter((ev) => findTag(ev.tags, "a")?.split(":").at(2).length === 0)
      .map((ev) => findTag(ev.tags, "a")?.split(":").at(1));
  }, [events]);

  const awardsById = useMemo(() => {
    const dAndEv = events
      .reverse()
      .map((ev) => [findTag(ev.tags, "a")?.split(":").at(2), ev.pubkey, ev]);
    return dAndEv.reduce((acc, [d, pubkey, ev]) => {
      return { ...acc, [`${pubkey}:${d}`]: ev };
    }, {});
  }, [events]);

  const badges = useNostrEvents({
    filter: {
      kinds: [BADGE_DEFINITION],
      "#d": dTags.filter((d) => d.length > 0),
      authors: pubkeys,
    },
    enabled: dTags.filter((d) => d.length > 0).length > 0 && pubkeys.length > 0,
  });

  const badgesWithEmptyDTag = useNostrEvents({
    filter: {
      kinds: [BADGE_DEFINITION],
      authors: pubkeysWithEmptyDTag,
    },
    enabled: pubkeysWithEmptyDTag.length > 0,
  });

  return uniqByFn([...badges.events, ...badgesWithEmptyDTag.events], getEventId)
    .map((b) => {
      const d = findTag(b.tags, "d");
      const award = awardsById[`${b.pubkey}:${d}`];
      return {
        badge: b,
        award,
      };
    })
    .filter(({ award }) => award)
    .sort((a, b) => b.award.created_at - a.award.created_at);
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

  const tags = useMemo(() => {
    return (ev?.tags ?? []).filter((t) => t[0] === "a" || t[0] === "e");
  }, [ev]);

  const dTags = useMemo(() => {
    return tags
      .filter((t) => t[0] === "a")
      .map((t) => t[1]?.split(":").at(2))
      .filter((e) => e !== undefined);
  }, [tags]);

  const pubkeys = useMemo(() => {
    return tags
      .filter((t) => t[0] === "a")
      .map((t) => t[1]?.split(":").at(1))
      .filter((e) => e !== undefined);
  }, [tags]);

  const pubkeysWithEmptyDTag = useMemo(() => {
    return tags
      .filter((t) => t[0] === "a")
      .filter((t) => t[1]?.split(":").at(2).length === 0)
      .map((t) => t[1]?.split(":").at(1))
      .filter((e) => e !== undefined);
  }, [tags]);

  const awardIds = useMemo(() => {
    return tags
      .filter((t) => t[0] === "e")
      .map((t) => t[1])
      .filter((e) => e !== undefined);
  }, [tags]);

  const awards = useNostrEvents({
    filter: {
      kinds: [BADGE_AWARD],
      ids: awardIds,
    },
    enabled: awardIds.length > 0,
  });

  const badges = useNostrEvents({
    filter: {
      kinds: [BADGE_DEFINITION],
      "#d": dTags.filter((d) => d.length > 0),
      authors: pubkeys,
    },
    enabled: dTags.filter((d) => d.length > 0).length > 0 && pubkeys.length > 0,
  });

  const badgesWithEmptyDTag = useNostrEvents({
    filter: {
      kinds: [BADGE_DEFINITION],
      authors: pubkeysWithEmptyDTag,
    },
    enabled: pubkeysWithEmptyDTag.length > 0,
  });

  return uniqByFn([...badges.events, ...badgesWithEmptyDTag.events], getEventId)
    .map((b) => {
      const d = findTag(b.tags, "d");
      const award = awards.events.find((ev) => {
        if (ev.pubkey === b.pubkey) {
          const ref = findTag(ev.tags, "a");
          if (ref) {
            const [kind, pubkey, awardD] = ref.split(":");
            return awardD === d;
          }
        }
      });
      return {
        badge: b,
        award,
      };
    })
    .filter(({ award }) => award)
    .sort((a, b) => b.award.created_at - a.award.created_at);
}
