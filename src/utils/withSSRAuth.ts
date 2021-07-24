import { AuthTokenError } from "errors/AuthTokenError";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import decode from 'jwt-decode';
import { validateUserAccess } from "common/utils/validateUserAccess";

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
}

export const withSSRAuth = <P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions) => async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

  const cookies = parseCookies(ctx);

  const token = cookies["ignews:token"];

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (options) {
    const userTokenData = decode<{ permissions: string[], roles: string[] }>(token);

    const { permissions, roles } = options;

    const userHasValidPermissions = validateUserAccess({
      user: userTokenData,
      params: permissions,
      type: "permissions"
    })

    const userHasValidRoles = validateUserAccess({
      user: userTokenData,
      params: roles,
      type: "roles"
    })

    if (!userHasValidPermissions || !userHasValidRoles) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        }
      }
    }
  }

  try {
    return fn(ctx);
  } catch (error) {
    console.log('heey');

    if (error instanceof AuthTokenError) {
      destroyCookie(ctx, 'ignews:token');
      destroyCookie(ctx, 'ignews:refreshToken');

      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }
}