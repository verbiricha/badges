import { useSelector } from "react-redux";
import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { useNostrEvents } from "../nostr";
import CreateBadge from "../lib/CreateBadge";
import Badge from "../lib/Badge";
import Layout from "../lib/Layout";

export default function Home() {
  const { user } = useSelector((s) => s.relay);
  const { events } = useNostrEvents({
    filter: {
      kinds: [30009],
      limit: 42,
    },
  });
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Badge</title>
      </Helmet>
      <Layout>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          margin="0 auto"
          width="360px"
        >
          {events.map((ev) => (
            <Badge width="340px" key={ev.id} mb={3} ev={ev} />
          ))}
        </Flex>
      </Layout>
    </>
  );
}
