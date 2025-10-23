export type TFollow = {
  _id?: string;
  follower: string; // userId who follows
  vendor: string; // vendorId being followed
  createdAt?: string;
  updatedAt?: string;
};

export type TVendorFollowersResponse = {
  vendorId: string;
  followersCount: number;
  isFollowing: boolean;
};
