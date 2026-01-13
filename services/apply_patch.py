#!/usr/bin/env python3
import re

# 读取文件
with open('llmService.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 定义要替换的部分 - 使用更简单的匹配
old_text = """            const rawBaseUrl = (provider.baseUrl || 'https://api.openai.com/v1').replace(/\\/$/, '');
            log += `Raw Base URL: ${rawBaseUrl}\\\\n`;

            // Note: OpenAI Official and Xiaomi Mimo may have CORS restrictions
            // We'll try anyway but use fallbacks if it fails

            const urlsToTry = [
                `${rawBaseUrl}/models`,
                `${rawBaseUrl.replace(/\\/v1$/, '')}/models`,
                `${rawBaseUrl}/v1/models`
            ];
            if (rawBaseUrl.includes('/v1/')) {
                 urlsToTry.push(`${rawBaseUrl.split('/v1/')[0]}/models`);
            }

            const uniqueUrls = [...new Set(urlsToTry)];"""

new_text = """            const rawBaseUrl = (provider.baseUrl || 'https://api.openai.com/v1').replace(/\\/$/, '');
            const targetUrl = provider.proxyUrl || rawBaseUrl;

            log += `Raw Base URL: ${rawBaseUrl}\\\\n`;
            log += `Target URL (with proxy): ${targetUrl}\\\\n`;

            // Note: OpenAI Official and Xiaomi Mimo may have CORS restrictions
            // If proxyUrl is set, use it directly. Otherwise try direct access with fallback

            let urlsToTry = [];

            if (provider.proxyUrl) {
                // Use proxy URL directly
                urlsToTry = [`${targetUrl}/models`];
                log += `Using proxy URL: ${urlsToTry[0]}\\\\n`;
            } else {
                // Try direct API access (will likely fail due to CORS)
                urlsToTry = [
                    `${rawBaseUrl}/models`,
                    `${rawBaseUrl.replace(/\\/v1$/, '')}/models`,
                    `${rawBaseUrl}/v1/models`
                ];
                if (rawBaseUrl.includes('/v1/')) {
                    urlsToTry.push(`${rawBaseUrl.split('/v1/')[0]}/models`);
                }
                log += `No proxy set, trying direct API access...\\\\n`;
            }

            const uniqueUrls = [...new Set(urlsToTry)];"""

# 执行替换
if old_text in content:
    content = content.replace(old_text, new_text)

    # 写回文件
    with open('llmService.ts', 'w', encoding='utf-8') as f:
        f.write(content)

    print("SUCCESS: Model fetching logic updated!")
    print("Now model fetching will use proxyUrl when available")
else:
    print("ERROR: Pattern not found")
    print("File may have been modified")