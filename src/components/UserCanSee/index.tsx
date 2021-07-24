import { useUserCan } from "hooks/useUserCan";
import { ReactNode } from "react";

type UserCanSeeProps = {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
};

export function UserCanSee({
  children,
  permissions,
  roles,
}: UserCanSeeProps) {
  const enabled = useUserCan({ permissions, roles });

  if (!enabled) return null;

  return <>{children}</>;
}
