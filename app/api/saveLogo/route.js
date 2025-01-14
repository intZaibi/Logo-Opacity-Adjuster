import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const dirName = path.resolve("public/uploads");

export const POST = async (req) => {
  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const file = (body.file) || null;

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }

    fs.writeFileSync(
      path.resolve(dirName, (body.file).name),
      buffer
    );
  } else {
    return NextResponse.json({
      success: false,
    });
  }

  return NextResponse.json({
    success: true,
    name: (body.file).name,
  });
};