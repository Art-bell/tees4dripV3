export interface BaseItem {
  id: number;
  name: string;
}

export interface AdminProduct {
  id: number;
  category: string;
  description: string;
  productName: string;
  quantityAvailable: number;
  usd: number;
  sizes: string[];
  colors: string[];
  mainImage: String;
  images: string[];
}

export interface AdminOrder {
  id: number;
  orderNumber: number;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  customerStreetAddress1: string;
  customerStreetAddress2: string;
  customerCity: string;
  customerZipCode: number;
  customerCountry: string;
  hasBeenPaid: boolean;
  createdAt: string;
  products: any[];
  orderTotal: number;
}
