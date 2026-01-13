#!/usr/bin/env python
# Apply the proxyUrl fix to fetchProviderModels

with open('llmService.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the OpenAI Compatible section (around line 236)
for i, line in enumerate(lines):
    if '// OpenAI Compatible GET /models' in line:
        # Found the section, now we need to replace lines 237-252
        # Line 237: const rawBaseUrl = ...
        # Line 238: log += ...
        # Line 239-241: comments
        # Line 243-250: urlsToTry array and if statement
        # Line 252: uniqueUrls

        # Replace lines 237-252 with new code
        new_code = [
            "            const rawBaseUrl = (provider.baseUrl || 'https://api.openai.com/v1').replace(/\\/$/, '');\n",
            "            const targetUrl = provider.proxyUrl || rawBaseUrl;\n",
            "\n",
            "            log += `Raw Base URL: ${rawBaseUrl}\\n`;\n",
            "            log += `Target URL (with proxy): ${targetUrl}\\n`;\n",
            "\n",
            "            // Note: OpenAI Official and Xiaomi Mimo may have CORS restrictions\n",
            "            // If proxyUrl is set, use it directly. Otherwise try direct access with fallback\n",
            "\n",
            "            let urlsToTry = [];\n",
            "\n",
            "            if (provider.proxyUrl) {\n",
            "                // Use proxy URL directly\n",
            "                urlsToTry = [`${targetUrl}/models`];\n",
            "                log += `Using proxy URL: ${urlsToTry[0]}\\n`;\n",
            "            } else {\n",
            "                // Try direct API access (will likely fail due to CORS)\n",
            "                urlsToTry = [\n",
            "                    `${rawBaseUrl}/models`,\n",
            "                    `${rawBaseUrl.replace(/\\/v1$/, '')}/models`,\n",
            "                    `${rawBaseUrl}/v1/models`\n",
            "                ];\n",
            "                if (rawBaseUrl.includes('/v1/')) {\n",
            "                    urlsToTry.push(`${rawBaseUrl.split('/v1/')[0]}/models`);\n",
            "                }\n",
            "                log += `No proxy set, trying direct API access...\\n`;\n",
            "            }\n",
            "\n",
            "            const uniqueUrls = [...new Set(urlsToTry)];\n"
        ]

        # Replace lines 237-252 (indices 236-251)
        new_lines = lines[:236] + new_code + lines[252:]
        break

# Write back
with open('llmService.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Applied proxyUrl fix to fetchProviderModels')
print('Now model fetching will use proxyUrl when available')
