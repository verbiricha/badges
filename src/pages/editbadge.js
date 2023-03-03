import { Helmet } from "react-helmet";

import { useParams } from "react-router-dom";

import { useNostrEvents, decodeNaddr } from "../nostr";
import EditBadge from "../lib/EditBadge";
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
        <title>Edit badge</title>
      </Helmet>
      <Layout>{ev && <EditBadge ev={ev} />}</Layout>
    </>
  );
}
