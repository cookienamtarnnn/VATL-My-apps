const fs = require('fs');
const path = require('path');

// 1. อ่านไฟล์ index.html ต้นฉบับ
let html = fs.readFileSync('./index.html', 'utf8');

// 2. ดึง Environment Variables จาก Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_Myapps_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_Myapps_SUPABASE_PUBLISHABLE_KEY || '';

// 3. แทนที่ Placeholders
html = html.replace('__SUPABASE_URL__', supabaseUrl);
html = html.replace('__SUPABASE_ANON_KEY__', supabaseAnonKey);

// 4. สร้างโฟลเดอร์ public ถ้ายังไม่มี
const outputDir = path.join(__dirname, 'public');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 5. เขียนไฟล์ลงใน public/index.html
fs.writeFileSync(path.join(outputDir, 'index.html'), html);
console.log('Successfully generated public/index.html');
