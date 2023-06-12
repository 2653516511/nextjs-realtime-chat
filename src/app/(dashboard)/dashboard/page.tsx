import Button from "@/components/ui/Button";
import { getServerSession } from "next-auth";
import { FC } from "react";
import { authOptions } from "@/lib/auth";

interface pageProps {}

const page = async ({}) => {
  const session = await getServerSession(authOptions);

  return <pre>{JSON.stringify(session)}</pre>;
};

export default page;
