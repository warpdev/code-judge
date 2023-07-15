export interface IStatus {
  id: number;
  description: string;
}

export interface IJudgeStatus {
  status: IStatus;
  token: string;
}

export interface IJudgeFullStatus {
  status: IStatus;
  token: string;
  time: number;
  stdout: string;
  stdin: string;
  memory: number;
}
