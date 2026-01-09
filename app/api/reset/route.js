import { cleanupOldRecords } from "@/lib/uploadLimiterFunction";

export async function POST(req) {
    const { password } = await req.json();
    if (password !== process.env.ADMIN_PASSWORD) {
        return new Response('Unauthorized', { status: 401 });
    }
    const uploadCounts = cleanupOldRecords();
    console.log("Reseting upload limits: ", uploadCounts);
    return new Response('OK');
}