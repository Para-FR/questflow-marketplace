# QuestFlow Claude Code Plugin

Manage your QuestFlow tasks directly from Claude Code!

## Quick Setup

Simply run:
```
/qf:setup
```

This will:
1. ✅ Check and install Bun if needed
2. 📦 Install plugin dependencies
3. 🌍 Choose between local development or production environment
4. 🔑 Configure your API key securely

### Environments

**Local Development**: Use `http://localhost:3014` when running QuestFlow on your machine
**Production**: Use `https://quest.cc-france.org` for the deployed server

## Manual Installation (Advanced)

If you prefer to configure manually:

1. Ensure Bun is installed: `bun --version`
2. Install dependencies: `cd ~/.claude/plugins/marketplaces/questflow-marketplace/plugins/qf && bun install`
3. Generate an API key:
   - Local: http://localhost:3014/settings
   - Production: https://quest.cc-france.org/settings
4. Update `.mcp.json` with your environment and API key

## Available Commands

### `/qf:add`
Create a new quest. You'll be prompted for:
- Title
- Description (optional)
- Difficulty (easy/medium/hard/epic)
- Type (coding/learning/writing/etc.)
- Estimated time

### `/qf:list`
List all your quests with optional filters:
- By status (pending/in-progress/completed)
- By type

### `/qf:start [quest-id]`
Start working on a quest. If no ID provided, shows pending quests to choose from.

### `/qf:complete [quest-id]`
Mark a quest as completed and earn rewards! Shows:
- XP earned
- Coins earned
- Level ups
- New achievements
- Current streak

### `/qf:stats [period]`
View your player statistics. Periods:
- `today` - Today's stats
- `week` - Last 7 days
- `month` - Last 30 days
- `all` - All-time (default)

### `/qf:shop [category]`
Browse and purchase shop items. Categories:
- `boosts` - XP/coin multipliers
- `cosmetics` - Avatars, badges
- `perks` - Special abilities
- `special` - Limited edition

## MCP Tools

The plugin provides these MCP tools that Claude Code can use:

- `createQuest` - Create a new quest
- `listQuests` - List quests with filters
- `startQuest` - Start a quest
- `completeQuest` - Complete a quest and earn rewards
- `getPlayerStats` - Get player profile and stats
- `getShopItems` - Browse shop items
- `purchaseItem` - Buy an item from the shop

## Configuration

### Switching Between Environments

To switch between local and production, run `/qf:setup` again and choose a different environment. Or manually edit `.mcp.json`:

**Local Development:**
```json
"QUESTFLOW_API_URL": "http://localhost:3014"
```

**Production:**
```json
"QUESTFLOW_API_URL": "https://quest.cc-france.org"
```

### Troubleshooting

**Error: QUESTFLOW_API_KEY is required**
- Run `/qf:setup` to configure your API key
- Or generate a new key manually at your environment's /settings page

**Error: 401 Unauthorized**
- Your API key may be revoked or invalid
- Run `/qf:setup` to reconfigure with a new key

**Server not responding**
- **Local**: Ensure QuestFlow dev server is running on port 3014 (`bun run dev`)
- **Production**: Check your internet connection
- Verify `QUESTFLOW_API_URL` in `.mcp.json` matches your environment

**Bun not found**
- Run `/qf:setup` which will install Bun automatically
- Or install manually: `curl -fsSL https://bun.sh/install | bash`

## Development

Test the MCP server directly:
```bash
cd ~/.claude/plugins/qf
bun run dev
```

## Version

1.0.0 - Initial release with full quest management

## License

MIT
