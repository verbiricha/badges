import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import Layout from "../lib/Layout";
import Badges from "../lib/Badges";
import useNip05 from "../lib/useNip05";

export default function Profile() {
  const { p } = useParams();
  const pubkey = useNip05(p);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Habla</title>
      </Helmet>
      <Layout>
        <Badges key={pubkey} pubkey={pubkey} />
      </Layout>
    </>
  );
}
