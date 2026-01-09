import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getClientIP, incrementUploadCount, checkUploadLimit } from "@/lib/uploadLimiterFunction";

const dirName = path.resolve("public/uploads");

export const POST = async (req) => {
  const clientIP = getClientIP(req);
  const { allowed, message } = checkUploadLimit(clientIP);

  if (!allowed) {
    return NextResponse.json({
      success: false,
      error: message || "Upload limit exceeded"
    }, { status: 429 });
  }

  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const file = (body.file) || null;

  if (file) {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName);
        }
    
        fs.writeFileSync(
          path.resolve(dirName, (body.file).name),
          buffer
        );
        incrementUploadCount(clientIP);
    } catch (error) {
        console.log(error);
        return NextResponse.json({
          success: false,
          error: error?.message || "Something went wrong",
        });
    }
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