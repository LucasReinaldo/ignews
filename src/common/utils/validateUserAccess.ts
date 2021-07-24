type User = {
  permissions: string[];
  roles: string[];
};

type ValidateUserAccessParams = {
  params: string[];
  user: User;
  type: 'permissions' | 'roles';
}

export function validateUserAccess({ user, params, type }: ValidateUserAccessParams) {

  if (type === 'permissions' && params?.length) {
    if (params.length === 0) return false;
    
    const hasAllPermissions = params.every(permission => user?.permissions.includes(permission));
    if (!hasAllPermissions) return false;
  }

  if (type === 'roles' && params?.length) {
    if (params.length === 0) return false;

    const hasAllRoles = params.some(role => user?.roles.includes(role));
    if (!hasAllRoles) return false;
  }

  return true;
}