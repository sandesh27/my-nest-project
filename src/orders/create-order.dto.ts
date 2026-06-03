/**
 * Data Transfer Object for creating an order
 * This DTO is used in the Orders microservice
 */
export class CreateOrderDto {
  /** User ID who is placing the order */
  userId: number;

  /** Name/description of the product */
  productName: string;

  /** Quantity of items being ordered */
  quantity: number;

  /** Price per unit */
  price: number;
}
