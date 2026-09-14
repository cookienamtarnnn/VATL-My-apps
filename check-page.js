const https = require('https');
const http = require('http');

async function fetch(url) {
    return new Promise((resolve, reject) => {
        const mod = url.startsWith('https') ? https : http;
        mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetch(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ 
                status: res.statusCode, 
                data,
                headers: Object.fromEntries(Object.entries(res.headers))
            }));
        }).on('error', reject);
    });
}

async function main() {
    const result = await fetch('http://localhost:8080/');
    console.log('Status:', result.status);
    console.log('Content-Type:', result.headers['content-type']);
    console.log('Content length:', result.data.length);
    
    // Check key elements
    const checks = [
        ['DOCTYPE', result.data.includes('<!DOCTYPE html>')],
        ['Bootstrap CSS', result.data.includes('bootstrap.min.css')],
        ['Bootstrap JS', result.data.includes('bootstrap.bundle.min.js')],
        ['SortableJS', result.data.includes('Sortable.min.js')],
        ['Supabase CDN', result.data.includes('@supabase/supabase-js')],
        ['SUPABASE_URL', result.data.includes('https://wgzxexklnndethybiipm.supabase.co')],
        ['SUPABASE_KEY', result.data.includes('sb_publishable_DAC1AlPLDy_pHpc23-ukUw_XQCS5VG7')],
        ['createClient', result.data.includes('createClient')],
        ['web_apps table', result.data.includes('web_apps')],
        ['container-main', result.data.includes('id="container-main"')],
        ['container-chonburi', result.data.includes('id="container-chonburi"')],
        ['fetchAppsFromSupabase', result.data.includes('fetchAppsFromSupabase')],
        ['renderApps', result.data.includes('renderApps')],
    ];
    
    console.log('\n=== Content Checks ===');
    let allPassed = true;
    for (const [name, passed] of checks) {
        console.log(`${passed ? 'PASS' : 'FAIL'}: ${name}`);
        if (!passed) allPassed = false;
    }
    
    console.log(`\n${allPassed ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}`);
}

main().catch(console.error);
