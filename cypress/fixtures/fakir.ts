import { faker } from '@faker-js/faker';

export const commandes = Array.from({ length: 5 }, () => ({
  id: faker.string.uuid(),
  productId: faker.string.uuid(),
  quantity: faker.number.int({ min: 1, max: 5 }),
  totalPrice: faker.commerce.price(),
}));

export const produits = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
  stock: faker.datatype.boolean(),
}));

export const produitMocké = {
  id: 'mock-id-123',
  name: 'Produit Mocké',
  price: '29.99',
  stock: true,
};
