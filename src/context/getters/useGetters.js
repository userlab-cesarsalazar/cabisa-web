import { Cache } from 'aws-amplify'

export const useGetters = state => ({
  userCan: permissions => {
    const currentSessionPermissions =
      state.auth.userPermissions?.length > 0
        ? state.auth.userPermissions
        : Cache.getItem('currentSession').userPermissions

    // if()
    return permissions.every(perm =>
      currentSessionPermissions.some(v => v === perm)
    )
  },
})
