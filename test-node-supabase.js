const https = require('https');
const http = require('http');

// Simple test to check if Supabase CDN is accessible and has expected global
async function testSupabaseClient() {
    console.log("Testing Supabase client initialization...");
    
    // Download the UMD bundle
    const supabaseJs = await fetch('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js');
    const code = await supabaseJs.text();
    
    console.log(`Downloaded ${code.length} bytes`);
    
    // Create a mock browser environment
    const mockWindow = {};
    const mockSelf = {};
    const mockGlobal = {};
    const mockDocument = { addEventListener: () => {} };
    
    // Execute the UMD bundle in a mock context
    const fn = new Function('window', 'self', 'global', 'document', `
        ${code}
        return typeof supabase !== 'undefined' ? supabase : undefined;
    `);
    
    const result = fn(mockWindow, mockSelf, mockGlobal, mockDocument);
    console.log("Supabase global type:", typeof result);
    console.log("Has createClient:", typeof result?.createClient);
    
    if (result?.createClient) {
        console.log("\nAttempting to create client...");
        try {
            const client = result.createClient(
                'https://wgzxexklnndethybiipm.supabase.co',
                'sb_publishable_DAC1AlPLDy_pHpc23-ukUw_XQCS5VG7'
            );
            console.log("Client created:", typeof client);
        } catch (e) {
            console.log("Error creating client:", e.message);
        }
    }
}

async function fetch(url) {
    return new Promise((resolve, reject) => {
        const mod = url.startsWith('https') ? https : http;
        mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetch(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ text: () => Promise.resolve(data) }));
        }).on('error', reject);
    });
}

testSupabaseClient().catch(console.error);
