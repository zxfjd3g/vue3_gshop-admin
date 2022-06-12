import pinia from "@/stores"
import { useUserInfoStore } from "@/stores/userInfo"

const userInfoStore = useUserInfoStore(pinia)

/**
 * 判断当前用户是否有此按钮权限
 * @param {按钮权限字符串} permission 
 */
export function hasBtnPermission(permission: string) {
  return userInfoStore.authBtnList.includes(permission)
}
