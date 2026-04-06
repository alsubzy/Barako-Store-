
import { NextResponse } from 'next/server';
import { usersStore } from '@/lib/users-store';

export async function GET() {
  const users = usersStore.getAll();
  return NextResponse.json({
    success: true,
    data: users,
    message: "Users retrieved successfully"
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    const newUser = usersStore.create(body);
    return NextResponse.json({
      success: true,
      data: newUser,
      message: "User created successfully"
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
    const deletedCount = usersStore.bulkDelete(ids);
    return NextResponse.json({
      success: true,
      message: `${deletedCount} users deleted successfully`
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Bulk delete failed" }, { status: 500 });
  }
}
