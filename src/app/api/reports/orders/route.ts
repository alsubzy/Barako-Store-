
import { NextResponse } from 'next/server';
import { ordersStore } from '@/lib/orders-store';

export async function GET() {
  const orders = ordersStore.getAll();
  
  // Basic transformation for reporting
  const data = orders.map(o => ({
    id: o.id,
    customerName: o.customerName,
    totalAmount: o.totalAmount,
    status: o.status,
    createdAt: o.createdAt
  }));

  return NextResponse.json({
    success: true,
    data,
    message: "Orders report generated"
  });
}
