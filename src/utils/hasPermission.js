import store from '../store'

export function hasPermission(permission) {
  let myPermissions = store.getters.permissions;
  console.log(myPermissions)
  return myPermissions.indexOf(permission) > -1;
}
