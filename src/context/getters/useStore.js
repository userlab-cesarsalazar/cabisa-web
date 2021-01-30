export const useStore = state => ({
  hasPermissions: permissions => permissions.every(perm => state.auth.permissions.some(v => v === perm))
})