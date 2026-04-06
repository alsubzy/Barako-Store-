
import { NextResponse } from 'next/server';
import { productsStore } from '@/lib/products-store';

export async function GET() {
  const products = productsStore.getAll();
  // Map products to inventory-specific view
  const inventory = products.map(p => ({
    id: p.id,
    productId: p.id,
    productName: p.name,
    stockQuantity: p.stock,
    unit: p.unit,
    category: p.category,
    updatedAt: p.createdAt // In a real DB, this would be a separate 'updatedAt' field
  }));

  return NextResponse.json({
    success: true,
    data: inventory,
    message: "Inventory retrieved successfully"
  });
}
