
import { NextResponse } from 'next/server';
import { inventoryStore } from '@/lib/inventory-store';

export async function GET() {
  const history = inventoryStore.getHistory();
  return NextResponse.json({
    success: true,
    data: history,
    message: "History retrieved successfully"
  });
}
