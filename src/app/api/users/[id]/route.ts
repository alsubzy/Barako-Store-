
import { NextResponse } from 'next/server';
import { usersStore } from '@/lib/users-store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = usersStore.getById(params.id);
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: user });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = usersStore.update(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, message: "User updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const success = usersStore.delete(params.id);
  if (!success) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "User deleted successfully" });
}
