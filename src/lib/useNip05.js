import { useState, useEffect } from "react";
import { nip19 } from "nostr-tools";
import { getKey, setKey } from "../storage";

export async function getPubkey(nip05) {
  const [username, domain] = nip05.split("@");
  try {
    const { names } = await fetch(
      `https://${domain}/.well-known/nostr.json?name=${encodeURIComponent(
        username
      )}`
    ).then((r) => r.json());
    if (names) {
      return names[username.toLowerCase()];
    }
  } catch (error) {
    console.error(error);
  }
}

export default function useNip05(s) {
  const [pubkey, setPubkey] = useState(() => {
    if (!s) {
      return;
    } else if (s.startsWith("npub")) {
      const decoded = nip19.decode(s);
      if (decoded.type === "npub") {
        return decoded.data;
      }
    } else if (s.match(/[0-9A-Fa-f]{64}/g)) {
      return s;
    } else {
      const key = !s.includes("@") ? `_@${s}` : s;
      const cached = getKey(key);
      if (cached) {
        return cached;
      }
      getPubkey(key).then((pk) => {
        if (pk) {
          setPubkey(pk);
          setKey(key, pk);
        }
      });
    }
  });

  useEffect(() => {
    if (s.match(/[0-9A-Fa-f]{64}/g)) {
      setPubkey(s);
    } else if (s.startsWith("npub")) {
      const decoded = nip19.decode(s);
      if (decoded.type === "npub") {
        setPubkey(decoded.data);
      }
    } else {
      const key = !s.includes("@") ? `_@${s}` : s;
      const cached = getKey(key);
      if (cached) {
        setPubkey(s);
        return;
      }
      getPubkey(key).then((pk) => {
        if (pk) {
          setPubkey(pk);
          setKey(key, pk);
        }
      });
    }
  }, [s]);

  return pubkey;
}
