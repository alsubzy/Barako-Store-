
import { NextResponse } from 'next/server';
import { ordersStore } from '@/lib/orders-store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const order = ordersStore.getById(params.id);
  if (!order) {
    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: order });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = ordersStore.update(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, message: "Order updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const success = ordersStore.delete(params.id);
  if (!success) {
    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Order deleted successfully" });
}
