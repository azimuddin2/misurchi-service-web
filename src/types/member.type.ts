export type TTeamMemberRole = 'team_member' | 'manager' | 'supervisor';

export type TMember = {
  vendor: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  role: TTeamMemberRole;
  speciality: string;
  timeZone: string;
  workHours: string;
  assignTask: string[];
  phone: string;
  isDeleted: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
