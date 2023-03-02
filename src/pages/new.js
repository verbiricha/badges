import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import CreateBadge from "../lib/CreateBadge";
import Layout from "../lib/Layout";

export default function New() {
  const { user } = useSelector((s) => s.relay);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Badge</title>
      </Helmet>
      <Layout>
        <CreateBadge />
      </Layout>
    </>
  );
}
