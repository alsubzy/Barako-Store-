
import { NextResponse } from 'next/server';
import { inventoryStore } from '@/lib/inventory-store';

export async function POST(request: Request) {
  try {
    const { productId, action, quantity } = await request.json();
    
    if (!productId || !action || quantity === undefined) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const result = inventoryStore.updateStock(productId, action, Number(quantity));
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}
