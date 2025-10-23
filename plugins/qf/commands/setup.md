---
description: Configure QuestFlow MCP API key
argument-hint: none
---

Setup QuestFlow MCP by securely storing your API key.

**Instructions for the user**:

1. First, tell the user to generate an API key:
   - Open http://localhost:3005/settings/api-keys in their browser
   - Click "Generate New API Key"
   - Copy the generated key

2. Ask the user to provide their API key using AskUserQuestion tool with ONE question:
   - Question: "Please paste your QuestFlow API key"
   - Header: "API Key"
   - Options: Just provide a single option labeled "Paste Key" with description "Enter your qf_... API key"
   - Set multiSelect: false

3. Once you receive the key:
   - Validate it starts with "qf_"
   - Use the Write tool to update the file: `~/.claude/plugins/marketplaces/questflow-marketplace/plugins/qf/.mcp.json`
   - Replace the QUESTFLOW_API_KEY value with the new key
   - Keep the file structure intact, only change the API key value

4. Confirm to the user:
   - "✅ API key configured successfully!"
   - "🔒 Your key is stored securely in the plugin config"
   - "🚀 You can now use all /qf:* commands"

**IMPORTANT SECURITY**:
- NEVER log or display the API key in plain text
- Always show it as "qf_***..." (only first 3 chars visible)
- Store it with 600 permissions if possible
