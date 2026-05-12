export type TNote = {
  text: string;
  status: string;
  createdAt: Date;
};

export type TTask = {
  _id: string;
  vendor: string;
  title: string;
  description: string;
  date: string;
  time: string;
  assignTeamMember: string;
  status: string;
  notes?: TNote[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
