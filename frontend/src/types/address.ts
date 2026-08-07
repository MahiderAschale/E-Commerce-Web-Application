export interface Address {
    id: string;
    fullName: string;
    phone: string;
    country: string;
    city: string;
    subCity: string;
    woreda?: string;
    houseNumber?: string;
    isDefault: boolean;
  }