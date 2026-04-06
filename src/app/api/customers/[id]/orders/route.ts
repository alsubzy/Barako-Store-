
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Mock order history for a specific customer
  const mockOrders = [
    { id: 'ORD-1234', date: new Date(Date.now() - 5 * 86400000).toISOString(), total: 45.50, status: 'Completed', itemsCount: 3 },
    { id: 'ORD-5678', date: new Date(Date.now() - 12 * 86400000).toISOString(), total: 120.00, status: 'Completed', itemsCount: 8 },
    { id: 'ORD-9012', date: new Date(Date.now() - 2 * 86400000).toISOString(), total: 15.20, status: 'Processing', itemsCount: 1 },
  ];

  return NextResponse.json({
    success: true,
    data: mockOrders,
    message: "Order history retrieved"
  });
}
