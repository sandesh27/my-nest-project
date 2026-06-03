/**
 * Data Transfer Object for creating an order
 * This DTO is used in the Orders microservice
 */
export class CreateOrderDto {
  userId: number;
  productName: string;
  quantity: number;
  price: number;
}
