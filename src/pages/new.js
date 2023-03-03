import { Helmet } from "react-helmet";

import CreateBadge from "../lib/CreateBadge";
import Layout from "../lib/Layout";

export default function New() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Badges</title>
      </Helmet>
      <Layout>
        <CreateBadge />
      </Layout>
    </>
  );
}
