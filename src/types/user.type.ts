export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    accountType: 'service provider' | 'user' | 'admin';
    image?: string;
    country?: string;
    status: 'ongoing' | 'confirmed';
    isDeleted: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}