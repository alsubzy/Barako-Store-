
import { NextResponse } from 'next/server';
import { customersStore } from '@/lib/customers-store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const customer = customersStore.getById(params.id);
  if (!customer) {
    return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: customer });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = customersStore.update(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, message: "Customer updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const success = customersStore.delete(params.id);
  if (!success) {
    return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Customer deleted successfully" });
}
