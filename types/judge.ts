export interface IStatus {
  id: number;
  description: string;
}

export interface IJudgeStatus {
  status: IStatus;
  token: string;
}
