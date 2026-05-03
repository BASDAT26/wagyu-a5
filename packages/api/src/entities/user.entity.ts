export interface UserAccount {
  userId: string;
  username: string;
  password?: string;
}

export interface Role {
  roleId: string;
  roleName: string;
}

export interface AccountRole {
  roleId: string;
  userId: string;
}

export interface Customer {
  customerId: string;
  fullName: string;
  phoneNumber?: string;
  userId: string;
}

export interface Organizer {
  organizerId: string;
  organizerName: string;
  contactEmail?: string;
  userId: string;
}
