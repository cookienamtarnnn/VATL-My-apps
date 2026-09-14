const fs = require('fs');

// อ่านไฟล์ index.html (หรือไฟล์ต้นฉบับที่คุณใช้)
let html = fs.readFileSync('./index.html', 'utf8');

// ดึง Environment Variables ตามชื่อจริงที่ตั้งไว้ใน Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_Myapps_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_Myapps_SUPABASE_PUBLISHABLE_KEY || '';

// ตรวจสอบสถานะใน Build Log
console.log('URL status:', supabaseUrl ? 'Found' : 'Missing');
console.log('KEY status:', supabaseAnonKey ? 'Found' : 'Missing');

// แทนที่ Placeholders ด้วยค่าจริง
html = html.replace('__SUPABASE_URL__', supabaseUrl);
html = html.replace('__SUPABASE_ANON_KEY__', supabaseAnonKey);

// เขียนไฟล์ผลลัพธ์เพื่อนำไปแสดงผล
fs.writeFileSync('./index.html', html);
console.log('Build completed successfully!');
