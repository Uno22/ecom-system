import { OrderCartDto } from '../dto';
import { IOrderCartRpc } from '../order.interface';

export class OrderCartRpc implements IOrderCartRpc {
  getCartByUserId(userId: string): Promise<OrderCartDto | null> {
    throw new Error('Method not implemented.');
  }
  deleteCartById(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
