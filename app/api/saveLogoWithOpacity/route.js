// pages/api/saveLogo.js

import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req) {
  if (req.method === 'POST') {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const base64Image = (body.base64Image) || null;
    const fileName = (body.fileName) || null;

    // Create a buffer from the base64 image data
    const base64Data = base64Image.replace('data:image/png;base64,', '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Save the file in the uploads directory
    const filePath = path.resolve('public/uploads', `adjusted-${fileName}`);
    try {
      fs.writeFileSync(filePath, buffer);
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        success: false,
        error: error?.message || "Something went wrong",
      }, { status: 405 });
    }

    // Return the name of the saved file
    return NextResponse.json({ name: 'adjusted-' + fileName }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
}
