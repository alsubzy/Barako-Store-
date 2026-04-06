
import { NextResponse } from 'next/server';
import { ordersStore } from '@/lib/orders-store';

export async function GET() {
  const orders = ordersStore.getAll();
  return NextResponse.json({
    success: true,
    data: orders,
    message: "Orders retrieved successfully"
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    
    const result = ordersStore.create(body);
    if ('error' in result) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Order created successfully"
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ success: false, message: "Invalid IDs provided" }, { status: 400 });
    }
    const deletedCount = ordersStore.bulkDelete(ids);
    return NextResponse.json({
      success: true,
      message: `${deletedCount} orders deleted successfully`
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Bulk delete failed" }, { status: 500 });
  }
}
