
import { NextResponse } from 'next/server';
import { customersStore } from '@/lib/customers-store';

export async function GET() {
  const customers = customersStore.getAll();
  return NextResponse.json({
    success: true,
    data: customers,
    message: "Customers retrieved successfully"
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    const newCustomer = customersStore.create(body);
    return NextResponse.json({
      success: true,
      data: newCustomer,
      message: "Customer created successfully"
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
    const deletedCount = customersStore.bulkDelete(ids);
    return NextResponse.json({
      success: true,
      message: `${deletedCount} customers deleted successfully`
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Bulk delete failed" }, { status: 500 });
  }
}
