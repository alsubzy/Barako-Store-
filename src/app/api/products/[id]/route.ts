
import { NextResponse } from 'next/server';
import { productsStore } from '@/lib/products-store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = productsStore.getById(params.id);
  if (!product) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: product });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = productsStore.update(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, message: "Product updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const success = productsStore.delete(params.id);
  if (!success) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Product deleted successfully" });
}
