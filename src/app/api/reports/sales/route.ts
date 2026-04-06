
import { NextResponse } from 'next/server';
import { ordersStore } from '@/lib/orders-store';
import { startOfDay, startOfWeek, startOfMonth, format, subDays } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = (searchParams.get('range') as 'day' | 'week' | 'month') || 'week';
  
  const orders = ordersStore.getAll();
  const salesMap = new Map<string, { totalOrders: number; totalRevenue: number }>();

  // Fill last 7 periods based on range to ensure chart completeness
  const periods = range === 'day' ? 24 : range === 'week' ? 7 : 6;
  
  for (let i = 0; i < periods; i++) {
    let date;
    let key;
    if (range === 'day') {
      // For day, we might do hours, but let's stick to last 7 days for now as "day" context usually means daily trends
      date = subDays(new Date(), i);
      key = format(date, 'MMM dd');
    } else if (range === 'week') {
      date = subDays(new Date(), i);
      key = format(date, 'EEE');
    } else {
      date = subDays(new Date(), i * 30);
      key = format(date, 'MMM');
    }
    salesMap.set(key, { totalOrders: 0, totalRevenue: 0 });
  }

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    let key;
    if (range === 'day' || range === 'week') {
      key = range === 'week' ? format(orderDate, 'EEE') : format(orderDate, 'MMM dd');
    } else {
      key = format(orderDate, 'MMM');
    }

    if (salesMap.has(key)) {
      const current = salesMap.get(key)!;
      salesMap.set(key, {
        totalOrders: current.totalOrders + 1,
        totalRevenue: current.totalRevenue + order.totalAmount
      });
    }
  });

  const data = Array.from(salesMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .reverse();

  return NextResponse.json({
    success: true,
    data,
    message: "Sales report generated"
  });
}
