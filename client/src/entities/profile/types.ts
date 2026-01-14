export interface IProfile {
  firstname: string;
  lastname: string;
  login: string;
  patronymic: string;
  phone: string;
  role: IRole;
}

export type IRole = "admin" | "customer";
