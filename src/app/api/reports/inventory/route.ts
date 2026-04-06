
import { NextResponse } from 'next/server';
import { productsStore } from '@/lib/products-store';

export async function GET() {
  const products = productsStore.getAll();
  
  const data = products.map(p => {
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (p.stock === 0) status = 'Out of Stock';
    else if (p.stock < 10) status = 'Low Stock';

    return {
      productId: p.id,
      name: p.name,
      category: p.category,
      stock: p.stock,
      unit: p.unit,
      status
    };
  });

  return NextResponse.json({
    success: true,
    data,
    message: "Inventory report generated"
  });
}
