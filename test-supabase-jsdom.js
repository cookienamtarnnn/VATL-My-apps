const { JSDOM } = require('jsdom');

async function test() {
    const dom = new JSDOM(`<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <pre id="output">Initializing...</pre>
    <script>
        document.getElementById('output').textContent = 
            'typeof supabase: ' + typeof supabase + '\n' +
            'typeof window.supabase: ' + typeof window.supabase;
    </script>
</body>
</html>`, {
        runScripts: "dangerously",
        resources: "usable",
        url: "http://localhost:8080/"
    });

    // Wait for scripts to load
    await new Promise(r => setTimeout(r, 5000));
    
    const output = dom.window.document.getElementById('output').textContent;
    console.log("Output:", output);
    console.log("window.supabase type:", typeof dom.window.supabase);
    
    if (typeof dom.window.supabase !== 'undefined') {
        const client = dom.window.supabase.createClient(
            'https://wgzxexklnndethybiipm.supabase.co',
            'sb_publishable_DAC1AlPLDy_pHpc23-ukUw_XQCS5VG7'
        );
        console.log("Client created:", !!client);
        
        try {
            const { data, error } = await client
                .from('web_apps')
                .select('*')
                .order('sort_order', { ascending: true });
            
            if (error) {
                console.log("Fetch error:", error);
            } else {
                console.log("Fetch success! Rows:", data.length);
                console.log("First row:", data[0]?.name);
            }
        } catch (e) {
            console.log("Client error:", e.message);
        }
    }
}

test().catch(console.error);
