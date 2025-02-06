export interface Product {
    id: number;
    name: string;
    stock: number;
    description: string;
    price: number;
    picture: string;
    availableStock: number;
    skin: string;
    aromas: string;
    ingredients: string;
    varieties: number;
  }

  export type OrderLines = {
    id: number;
    product: {
      id: number;
      name: string;
      description: string;
      price: number;
      picture: string;
    };
    quantity: number;
  };

export interface Order {
  id: number;
  firstname: string;
  lastname: string;
  address: string;
  zipCode: string;
  city: string;
  date: string;
  validated: boolean;
  orderLines: OrderLine[];
}