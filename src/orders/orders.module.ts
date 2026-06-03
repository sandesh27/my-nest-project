import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

/**
 * OrdersModule
 * Feature module for handling orders
 * Demonstrates how to structure a microservice-ready module
 */
@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // Export for other modules that might need it
})
export class OrdersModule {}
