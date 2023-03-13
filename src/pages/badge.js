import { Helmet } from "react-helmet";

import { useParams } from "react-router-dom";

import { useNostrEvents, decodeNaddr } from "../nostr";
import BadgeProfile from "../lib/BadgeProfile";
import Layout from "../lib/Layout";

export default function Profile() {
  const { naddr } = useParams();
  const { d, pubkey, k } = decodeNaddr(naddr);
  const { events } = useNostrEvents({
    filter: {
      "#d": d ? [d] : undefined,
      authors: [pubkey],
      kinds: [k],
    },
  });
  const ev = events?.find(
    (ev) => ev.tags.find((t) => t[0] === "d")?.at(1) === d
  );

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Badges</title>
      </Helmet>
      <Layout>{ev && <BadgeProfile ev={ev} />}</Layout>
    </>
  );
}
