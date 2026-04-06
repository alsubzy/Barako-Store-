
import { NextResponse } from 'next/server';
import { customersStore } from '@/lib/customers-store';
import { ordersStore } from '@/lib/orders-store';

export async function GET() {
  const customers = customersStore.getAll();
  const allOrders = ordersStore.getAll();
  
  const data = customers.map(c => {
    const customerOrders = allOrders.filter(o => o.customerName === c.name);
    const lastOrder = customerOrders.length > 0 
      ? customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      : null;

    return {
      id: c.id,
      name: c.name,
      email: c.email,
      totalOrders: c.totalOrders,
      totalSpent: c.totalSpent,
      lastOrderDate: lastOrder?.createdAt
    };
  });

  return NextResponse.json({
    success: true,
    data,
    message: "Customer report generated"
  });
}
