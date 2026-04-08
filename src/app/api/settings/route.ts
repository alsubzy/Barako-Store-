
import { NextResponse } from 'next/server';
import { getSettings, updateSettings, SystemSettings } from '@/data/settingsData';

export async function GET() {
  const settings = getSettings();
  return NextResponse.json({
    success: true,
    data: settings
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({
        success: false,
        message: "Missing section or data"
      }, { status: 400 });
    }

    const updatedSettings = updateSettings(section as keyof SystemSettings, data);

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully.`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}
