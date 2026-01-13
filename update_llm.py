#!/usr/bin/env python3
import re

# Read the file
with open('services/llmService.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add proxyUrl support in generateViaOpenAICompatible function
# Find the line with baseUrl and add targetUrl after it
lines = content.split('\n')
new_lines = []
for i, line in enumerate(lines):
    new_lines.append(line)
    # After the baseUrl line in generateViaOpenAICompatible, add targetUrl
    if "const baseUrl = (provider.baseUrl || 'https://api.openai.com/v1').replace(/\\/$/, '');" in line:
        new_lines.append("      const targetUrl = provider.proxyUrl || baseUrl;")
    # After the baseUrl line in testProviderConnection, add targetUrl
    elif "const baseUrl = (provider.baseUrl || 'https://api.openai.com/v1').replace(/\\/$/, '');" in line and i > 60:
        new_lines.append("            const targetUrl = provider.proxyUrl || baseUrl;")

# Join back together
content = '\n'.join(new_lines)

# Replace fetch URLs to use targetUrl instead of baseUrl
content = content.replace('await fetch(`${baseUrl}/chat/completions`,', 'await fetch(`${targetUrl}/chat/completions`,')
content = content.replace('const response = await fetch(`${baseUrl}/chat/completions`, {', 'const response = await fetch(`${targetUrl}/chat/completions`, {')

# Write back
with open('services/llmService.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated llmService.ts successfully")