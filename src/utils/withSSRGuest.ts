import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export const withSSRGuest = <P>(fn: GetServerSideProps<P>) => async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
  const cookies = parseCookies(ctx);

  if (cookies["ignews:token"]) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return fn(ctx);
}