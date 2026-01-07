export interface UserClient extends ShortUser {
  login: string;
}

export interface ShortUser {
  login: string;
  id: string;
}
