// In-memory storage for upload counts per IP
const uploadCounts = new Map();

// Configuration
const MAX_UPLOADS_PER_IP = 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Get the real IP address from the request
 * Handles proxies like Vercel, Cloudflare, etc.
 */
function getClientIP(req) {
  // Check if req has .headers.get (Request/NextRequest API) or if it's a plain object (Node.js IncomingMessage API)
  const getHeader = (name) => {
    if (typeof req.headers.get === 'function') {
      return req.headers.get(name);
    }
    return req.headers[name.toLowerCase()];
  };

  const forwarded = getHeader('x-forwarded-for');
  const real = getHeader('x-real-ip');
  const cfConnecting = getHeader('cf-connecting-ip');
  
  if (cfConnecting && typeof cfConnecting === 'string') {
    return cfConnecting;
  }
  
  if (forwarded) {
    const forwardedStr = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return forwardedStr.split(',')[0].trim();
  }
  
  if (real && typeof real === 'string') {
    return real;
  }
  
  // Fallback to connection remote address if available
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

/**
 * Check if an IP has exceeded the upload limit
 */
function checkUploadLimit(ip) {
  const now = Date.now();
  const record = uploadCounts.get(ip);

  console.log(`[Check Upload Limit] IP: ${ip} | Record: ${JSON.stringify(record)} | Allowed: ${record ? record.count < MAX_UPLOADS_PER_IP : true}`);
  
  // No record exists, allow upload
  if (!record) {
    return { allowed: true, remaining: MAX_UPLOADS_PER_IP - 1 };
  }
  
  // Check if the time window has expired
  if (now - record.firstUpload > RATE_LIMIT_WINDOW) {
    // Reset the counter
    uploadCounts.delete(ip);
    return { allowed: true, remaining: MAX_UPLOADS_PER_IP - 1 };
  }
  
  // Check if limit exceeded
  if (record.count >= MAX_UPLOADS_PER_IP) {
    const resetTime = new Date(record.firstUpload + RATE_LIMIT_WINDOW);
    return { 
      allowed: false, 
      remaining: 0,
      resetAt: resetTime,
      message: `Upload limit exceeded. Resets at ${resetTime.toLocaleString()}`
    };
  }
  
  // Still within limit
  return { 
    allowed: true, 
    remaining: MAX_UPLOADS_PER_IP - record.count - 1 
  };
}

/**
 * Increment the upload count for an IP
 */
function incrementUploadCount(ip) {
  const now = Date.now();
  const record = uploadCounts.get(ip);
  
  if (!record) {
    uploadCounts.set(ip, {
      count: 1,
      firstUpload: now,
      lastUpload: now
    });
    return 1;
  } else {
    record.count += 1;
    record.lastUpload = now;
    uploadCounts.set(ip, record);
    return record.count;
  }
}

/**
 * Get current upload stats for an IP
 */
function getUploadStats(ip) {
  const record = uploadCounts.get(ip);
  
  if (!record) {
    return {
      count: 0,
      remaining: MAX_UPLOADS_PER_IP,
      resetAt: null
    };
  }
  
  const resetAt = new Date(record.firstUpload + RATE_LIMIT_WINDOW);
  
  return {
    count: record.count,
    remaining: Math.max(0, MAX_UPLOADS_PER_IP - record.count),
    resetAt: resetAt,
    firstUpload: new Date(record.firstUpload),
    lastUpload: new Date(record.lastUpload)
  };
}

/**
 * Cleanup old records (run periodically)
 */
function cleanupOldRecords() {
  const now = Date.now();

  const before = uploadCounts.size;
  
  for (const [ip, record] of uploadCounts.entries()) {
    // if (now - record.firstUpload > RATE_LIMIT_WINDOW) {
      uploadCounts.delete(ip);
    // }
  }
  return {
    before,
    after: uploadCounts.size,
    uploadCounts
  };
}

// // Clean up every hour
// if (typeof window === 'undefined') {
//   setInterval(cleanupOldRecords, 60 * 60 * 1000);
// }


async function getUploadStatsHandler(req,res) {
  const clientIP = getClientIP(req);
  const stats = getUploadStats(clientIP);
  
  return {
    ip: clientIP, // Remove in production for privacy
    ...stats
  };
}

export { 
  getClientIP,
  checkUploadLimit,
  incrementUploadCount,
  getUploadStats,
  cleanupOldRecords,
  getUploadStatsHandler 
};