import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';

/**
 * OrdersModule
 * Feature module for handling orders
 * Demonstrates how to structure a microservice-ready module
 * Provides Repository<Order> for database access
 */
@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // Export for other modules that might need it
})
export class OrdersModule {}
