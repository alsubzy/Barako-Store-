
import { NextResponse } from 'next/server';
import { productsStore } from '@/lib/products-store';

export async function GET() {
  const products = productsStore.getAll();
  return NextResponse.json({
    success: true,
    data: products,
    message: "Products retrieved successfully"
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.category || body.price === undefined || body.stock === undefined) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    const newProduct = productsStore.create(body);
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: "Product created successfully"
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
    const deletedCount = productsStore.bulkDelete(ids);
    return NextResponse.json({
      success: true,
      message: `${deletedCount} products deleted successfully`
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Bulk delete failed" }, { status: 500 });
  }
}
