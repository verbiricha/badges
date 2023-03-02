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
      "#d": [d],
      authors: [pubkey],
      kinds: [k],
    },
  });
  const ev = events?.at(0);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Badge</title>
      </Helmet>
      <Layout>{ev && <BadgeProfile ev={ev} />}</Layout>
    </>
  );
}
