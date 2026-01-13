#!/usr/bin/env python
# Fix the llmService.ts file formatting issues

with open('llmService.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the problematic patterns
fixes = [
    # Fix log strings with double backslashes
    ('log = `Fetching models for ${provider.label}...\\\\n`', 'log = `Fetching models for ${provider.label}...\\n`'),
    ('log += `Provider type: Google\\\\n`', 'log += `Provider type: Google\\n`'),
    ('log += `Attempting GET ${url} (Key hidden)...\\\\n`', 'log += `Attempting GET ${url} (Key hidden)...\\n`'),
    ('log += `ERROR: Status ${res.status} - ${errText}\\\\n`', 'log += `ERROR: Status ${res.status} - ${errText}\\n`'),
    ('log += `SUCCESS: Found ${models.length} models.\\\\n`', 'log += `SUCCESS: Found ${models.length} models.\\n`'),
    ('log += `API Fetch Failed. Using Fallback List.\\\\n`', 'log += `API Fetch Failed. Using Fallback List.\\n`'),
    ('log += `Raw Base URL: ${rawBaseUrl}\\\\\\\\n`', 'log += `Raw Base URL: ${rawBaseUrl}\\n`'),
    ('log += `Target URL (with proxy): ${targetUrl}\\\\\\\\n`', 'log += `Target URL (with proxy): ${targetUrl}\\n`'),
    ('log += `Using proxy URL: ${urlsToTry[0]}\\\\\\\\n`', 'log += `Using proxy URL: ${urlsToTry[0]}\\n`'),
    ('log += `No proxy set, trying direct API access...\\n\\n`', 'log += `No proxy set, trying direct API access...\\n`'),
    ('log += `Attempting GET ${url}...\\\\n`', 'log += `Attempting GET ${url}...\\n`'),
    ('log += `  Status: ${response.status} ${response.statusText}\\\\n`', 'log += `  Status: ${response.status} ${response.statusText}\\n`'),
    ('log += `  SUCCESS: Found ${foundModels.length} models.\\\\n`', 'log += `  SUCCESS: Found ${foundModels.length} models.\\n`'),
    ('log += `  Error Body: ${txt.substring(0, 100)}\\\\n`', 'log += `  Error Body: ${txt.substring(0, 100)}\\n`'),
    ('log += `  EXCEPTION: ${e.message}\\\\n`', 'log += `  EXCEPTION: ${e.message}\\n`'),
    ('log += `All attempts failed. Loading hardcoded fallbacks.\\\\n`', 'log += `All attempts failed. Loading hardcoded fallbacks.\\n`'),
    ('log += `Using fallback models: ${fallbacks.join(\', \')}\\\\\\\\n`', 'log += `Using fallback models: ${fallbacks.join(\', \')}\\n`'),
    ('throw new Error(`Failed to fetch models. Log:\\\\\\\\n${log}`)', 'throw new Error(`Failed to fetch models. Log:\\n${log}`)'),
    ('throw new Error(e.message + `\\\\\\\\n\\\\\\\\nLog:\\\\\\\\n${log}`)', 'throw new Error(e.message + `\\n\\nLog:\\n${log}`)'),
    # Fix regex patterns
    ('replace(/\\\\/$/, \'\')', 'replace(/\\/$/, \'\')'),
    ('replace(/\\\\/v1$/, \'\')', 'replace(/\\\/v1$/, \'\')'),
    ('includes(\"/v1/\")', 'includes(\'/v1/\')'),
    ('split(\"/v1/\")[0]', 'split(\'/v1/\')[0]'),
]

for old, new in fixes:
    content = content.replace(old, new)

with open('llmService.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed llmService.ts formatting issues')
