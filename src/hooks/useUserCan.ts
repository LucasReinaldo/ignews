import { validateUserAccess } from "common/utils/validateUserAccess";
import { useAuth } from "context/AuthContext";

type UseUserCanProps = {
  permissions?: string[];
  roles?: string[];
}

export function useUserCan({ permissions, roles }: UseUserCanProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserAccess({
    user,
    params: permissions,
    type: "permissions"
  })
  
  const userHasValidRoles = validateUserAccess({
    user,
    params: roles,
    type: "roles"
  })

  return userHasValidRoles || userHasValidPermissions;
}