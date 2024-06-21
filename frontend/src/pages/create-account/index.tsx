import { useRouter } from "next/router";
import { useEffect } from "react";

import DefaultLayout from "@layouts/DefaultLayout";

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/create-account/0");
  }, [router]);
  return <></>;
};

IndexPage.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default IndexPage;
