export interface loginResponseModel {
  token: string
}

export interface userInfoResponseModel {
  name: string
  avatar: string
  
  buttons: string[]
  roles: string[]
  routes: string[]
}