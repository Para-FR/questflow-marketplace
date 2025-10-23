# QuestFlow Claude Code Plugin

Manage your QuestFlow tasks directly from Claude Code!

## Installation

1. The plugin is already installed at `~/.claude/plugins/qf/`
2. Generate an API key at http://localhost:3005/settings
3. Update your API key in `.mcp.json`:
   ```json
   {
     "mcpServers": {
       "questflow": {
         "command": "bun",
         "args": ["run", "src/mcp-server.ts"],
         "env": {
           "QUESTFLOW_API_URL": "http://localhost:3005",
           "QUESTFLOW_API_KEY": "your-api-key-here"
         }
       }
     }
   }
   ```

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

### Change API URL (for production)

Edit `.mcp.json` and update `QUESTFLOW_API_URL`:
```json
"QUESTFLOW_API_URL": "https://questflow.app"
```

### Troubleshooting

**Error: QUESTFLOW_API_KEY is required**
- Generate a new API key at /settings
- Update `.mcp.json` with your key

**Error: 401 Unauthorized**
- Your API key may be revoked
- Generate a new one and update `.mcp.json`

**Server not responding**
- Ensure QuestFlow dev server is running on port 3005
- Check `QUESTFLOW_API_URL` in `.mcp.json`

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
