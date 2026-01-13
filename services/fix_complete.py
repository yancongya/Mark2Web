#!/usr/bin/env python
# Complete fix for llmService.ts

with open('llmService.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the exact function with correct formatting
new_function = '''export const fetchProviderModels = async (provider: LLMProviderConfig): Promise<{ models: string[], log: string }> => {
    let log = `Fetching models for ${provider.label}...\\n`;
    try {
        if (provider.type === 'google') {
            const apiKey = provider.apiKey || getEnvApiKey();
            if (!apiKey) throw new Error("No API Key provided");

            log += `Provider type: Google\\n`;

            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
                log += `Attempting GET ${url} (Key hidden)...\\n`;

                const res = await fetch(url).catch(err => { throw new Error(\`Network Error: \${err.message}\`); });
                if (!res.ok) {
                    const errText = await res.text().catch(() => 'Unknown error');
                    log += \`ERROR: Status \${res.status} - \${errText}\\n\`;
                    throw new Error(\`API Error: \${res.status}\`);
                }
                const data = await res.json();
                const models = (data.models || [])
                    .map((m: any) => m.name.replace('models/', ''))
                    .filter((id: string) => id.includes('gemini') || id.includes('flash') || id.includes('pro'));

                log += \`SUCCESS: Found \${models.length} models.\\n\`;
                return { models, log };
            } catch (innerError) {
                log += \`API Fetch Failed. Using Fallback List.\\n\`;
                return {
                    models: [
                        'gemini-2.0-flash',
                        'gemini-2.0-flash-lite-preview-02-05',
                        'gemini-1.5-flash',
                        'gemini-1.5-pro',
                        'gemini-3-flash-preview',
                        'gemini-3-pro-preview'
                    ],
                    log
                };
            }

        } else {
            // OpenAI Compatible GET /models
            const rawBaseUrl = (provider.baseUrl || 'https://api.openai.com/v1').replace(/\\/$/, '');
            const targetUrl = provider.proxyUrl || rawBaseUrl;

            log += \`Raw Base URL: \${rawBaseUrl}\\n\`;
            log += \`Target URL (with proxy): \${targetUrl}\\n\`;

            // Note: OpenAI Official and Xiaomi Mimo may have CORS restrictions
            // If proxyUrl is set, use it directly. Otherwise try direct access with fallback

            let urlsToTry = [];

            if (provider.proxyUrl) {
                // Use proxy URL directly
                urlsToTry = [\`\${targetUrl}/models\`];
                log += \`Using proxy URL: \${urlsToTry[0]}\\n\`;
            } else {
                // Try direct API access (will likely fail due to CORS)
                urlsToTry = [
                    \`\${rawBaseUrl}/models\`,
                    \`\${rawBaseUrl.replace(/\\\/v1$/, '')}/models\`,
                    \`\${rawBaseUrl}/v1/models\`
                ];
                if (rawBaseUrl.includes('/v1/')) {
                    urlsToTry.push(\`\${rawBaseUrl.split('/v1/')[0]}/models\`);
                }
                log += \`No proxy set, trying direct API access...\\n\`;
            }

            const uniqueUrls = [...new Set(urlsToTry)];

            for (const url of uniqueUrls) {
                log += \`Attempting GET \${url}...\\n\`;
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: { 'Authorization': \`Bearer \${provider.apiKey}\` }
                    });

                    log += \`  Status: \${response.status} \${response.statusText}\\n\`;

                    if (response.ok) {
                         const data = await response.json();
                         let foundModels: string[] = [];
                         if (Array.isArray(data.data)) foundModels = data.data.map((m: any) => m.id);
                         else if (Array.isArray(data)) foundModels = data.map((m:any) => m.id || m.name);

                         if (foundModels.length > 0) {
                             log += \`  SUCCESS: Found \${foundModels.length} models.\\n\`;
                             return { models: foundModels.sort(), log };
                         }
                    } else {
                        const txt = await response.text().catch(() => '');
                        log += \`  Error Body: \${txt.substring(0, 100)}\\n\`;
                    }
                } catch (e: any) {
                    log += \`  EXCEPTION: \${e.message}\\n\`;
                }
            }

            // Fallback Logic
            log += \`All attempts failed. Loading hardcoded fallbacks.\\n\`;
            const lowerId = provider.providerId.toLowerCase();
            let fallbacks: string[] = [];

            if (lowerId.includes('deepseek')) fallbacks = ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'];
            else if (lowerId.includes('groq')) fallbacks = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
            else if (lowerId.includes('openai')) fallbacks = ['gpt-4o', 'gpt-4o-mini', 'o1'];
            else if (lowerId.includes('xiaomi') || lowerId.includes('mimo')) fallbacks = ['mimo-v2-flash'];

            if (fallbacks.length > 0) {
                log += \`Using fallback models: \${fallbacks.join(', ')}\\n\`;
                return { models: fallbacks, log };
            }

            throw new Error(\`Failed to fetch models. Log:\\n\${log}\`);
        }
    } catch (e: any) {
        console.error("Fetch Models Failed:", e);
        throw new Error(e.message + \`\\n\\nLog:\\n\${log}\`);
    }
}'''

# Find the function start and end
start_marker = 'export const fetchProviderModels = async (provider: LLMProviderConfig)'
end_marker = '}\n\n// --- Prompt Construction ---'

start_pos = content.find(start_marker)
end_pos = content.find(end_marker)

if start_pos != -1 and end_pos != -1:
    # Replace the function
    new_content = content[:start_pos] + new_function + '\n\n' + content[end_pos:]

    with open('llmService.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)

    print('Successfully replaced fetchProviderModels function')
else:
    print('Could not find function boundaries')
    print(f'Start pos: {start_pos}, End pos: {end_pos}')
