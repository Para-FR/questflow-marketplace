---
description: Configure QuestFlow MCP API key
argument-hint: none
---

Setup QuestFlow MCP by securely storing your API key and installing dependencies.

**Instructions for Claude**:

## Step 1: Check and Install Bun

1. Check if Bun is installed:
   ```bash
   which bun
   ```

2. If Bun is NOT installed:
   - Inform the user: "⚠️ Bun is not installed. Installing Bun..."
   - Install Bun using the official installer:
     ```bash
     curl -fsSL https://bun.sh/install | bash
     ```
   - After installation, verify:
     ```bash
     source ~/.bashrc && bun --version
     ```
   - Inform the user: "✅ Bun installed successfully!"

3. If Bun is already installed:
   - Inform the user: "✅ Bun is already installed (version: X.X.X)"

## Step 2: Install Plugin Dependencies

1. Navigate to the plugin directory and install dependencies:
   ```bash
   cd ~/.claude/plugins/marketplaces/questflow-marketplace/plugins/qf && bun install
   ```

2. Inform the user:
   - "📦 Installing QuestFlow plugin dependencies..."
   - After completion: "✅ Dependencies installed successfully!"

## Step 3: Environment Configuration

1. Ask the user TWO questions using AskUserQuestion tool:

   **Question 1**: "Are you setting up for local development or production?"
   - Header: "Environment"
   - Options:
     - Option 1: "Local Development" with description "Use http://localhost:3014 (for testing on your machine)"
     - Option 2: "Production" with description "Use https://quest.cc-france.org (for deployed server)"
   - Set multiSelect: false

   **Question 2**: "Please paste your QuestFlow API key"
   - Header: "API Key"
   - Options:
     - Option 1: "Paste Key" with description "Enter your qf_... API key from the settings page"
   - Set multiSelect: false

2. Based on the environment choice, set the appropriate API URL:
   - Local Development → `http://localhost:3014`
   - Production → `https://quest.cc-france.org`

## Step 4: Configure MCP Server

1. Validate the API key starts with "qf_"
   - If not, show error: "❌ Invalid API key format. Keys must start with 'qf_'"
   - Stop execution

2. Use the Write tool to update `~/.claude/plugins/marketplaces/questflow-marketplace/plugins/qf/.mcp.json`:
   ```json
   {
     "mcpServers": {
       "questflow": {
         "command": "bun",
         "args": ["run", "${CLAUDE_PLUGIN_ROOT}/src/mcp-server.ts"],
         "env": {
           "QUESTFLOW_API_URL": "<SELECTED_URL>",
           "QUESTFLOW_API_KEY": "<PROVIDED_KEY>",
           "NODE_TLS_REJECT_UNAUTHORIZED": "0"
         }
       }
     }
   }
   ```

3. Replace `<SELECTED_URL>` with the chosen environment URL
4. Replace `<PROVIDED_KEY>` with the user's API key

## Step 5: Confirmation

Inform the user:
- "✅ QuestFlow MCP configured successfully!"
- "🌍 Environment: [Local Development / Production]"
- "🔑 API Key: qf_***... (configured)"
- "🔒 Your credentials are stored securely in the plugin config"
- "🚀 You can now use all /qf:* commands (add, list, start, complete, stats, shop)"
- "💡 Tip: Restart Claude Code to activate the MCP server connection"

**IMPORTANT SECURITY**:
- NEVER log or display the full API key in plain text
- Always show it as "qf_***..." (only first 3 chars visible)
- The .mcp.json file should have restricted permissions (600)
