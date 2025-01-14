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
    console.log(base64Image)

    // Create a buffer from the base64 image data
    const base64Data = base64Image.replace('data:image/png;base64,', '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Save the file in the uploads directory
    const filePath = path.resolve('public/uploads', `new-${fileName}`);

    fs.writeFileSync(filePath, buffer);

    // Return the name of the saved file
    return NextResponse.json({ name: 'new-' + fileName }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
}
