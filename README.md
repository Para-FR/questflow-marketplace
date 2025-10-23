# QuestFlow Marketplace 🎮

**Official Claude Code marketplace for QuestFlow - Gamified productivity tools**

Transform your development workflow into an engaging RPG experience with quests, XP, levels, achievements, and rewards!

## 🚀 Quick Start

### Install Marketplace

```bash
/plugin marketplace add Para-FR/questflow-marketplace
```

### Install QuestFlow Plugin

```bash
/plugin install qf@questflow-marketplace
```

### Configure API Key

```bash
/qf:setup
```

Follow the prompts to generate and configure your QuestFlow API key.

### Verify Installation

```bash
/mcp
```

You should see: `plugin:qf:questflow: ✓ Connected`

## 📦 Available Plugins

### QuestFlow (`qf`)

Gamified productivity system with quests, XP, levels, and achievements.

**Features:**
- 🎯 Quest management with difficulty levels and XP rewards
- 📊 Player stats tracking (level, XP, coins, streak)
- 🏪 Shop system with themes and power-ups
- 🏆 Achievement system with badges
- 🎨 Customizable themes (purple, neon, forest, ocean)
- 🔐 Secure API authentication

**Commands:**
- `/qf:add [title]` - Create a new quest
- `/qf:list [status] [type]` - List your quests
- `/qf:start <quest-id>` - Start a quest
- `/qf:complete [quest-id]` - Complete a quest and earn rewards
- `/qf:stats [period]` - View player statistics
- `/qf:shop [category]` - Browse the shop
- `/qf:setup` - Configure API key

**MCP Tools:**
- createQuest
- listQuests
- startQuest
- completeQuest
- getPlayerStats
- getShopItems
- purchaseItem

[📖 Full Documentation](plugins/qf/README.md)

## 🌐 QuestFlow App

The QuestFlow app provides the web interface and API backend.

- **Local Development**: http://localhost:3005
- **Production**: https://quest.cc-france.org

### Run Locally

```bash
git clone https://github.com/Para-FR/questflow.git
cd questflow
bun install
bun dev
```

### Deploy to Production

See [deployment guide](https://github.com/Para-FR/questflow/blob/master/docs/DEPLOYMENT_QUEST_CC_FRANCE.md)

## 🔐 Security

- API keys are SHA-256 hashed in the database
- Keys stored locally with 600 permissions (owner only)
- Keys never logged or displayed in terminal output
- MCP server handles authentication internally
- Each user generates their own unique API key

## 🛠️ Development

### Structure

```
questflow-marketplace/
├── .claude-plugin/
│   └── marketplace.json    # Marketplace configuration
└── plugins/
    └── qf/                  # QuestFlow plugin
        ├── .claude-plugin/
        ├── commands/        # Slash commands
        ├── src/
        │   └── mcp-server.ts
        ├── .mcp.json        # MCP server config
        ├── package.json
        └── README.md
```

### Adding a New Plugin

1. Create plugin directory in `plugins/`
2. Add `.claude-plugin/plugin.json` with metadata
3. Implement commands in `commands/` directory
4. (Optional) Add MCP server in `src/`
5. Update marketplace.json to include new plugin

## 📚 Resources

- **QuestFlow App**: https://github.com/Para-FR/questflow
- **Marketplace**: https://github.com/Para-FR/questflow-marketplace
- **Claude Code Docs**: https://docs.claude.com/en/docs/claude-code
- **MCP Docs**: https://docs.claude.com/en/docs/claude-code/mcp
- **CC France Community**: https://cc-france.org

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a Pull Request

For plugin submissions, ensure:
- Clear documentation in README.md
- Proper `.claude-plugin/plugin.json` metadata
- Working commands or MCP tools
- Security best practices followed

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/Para-FR/questflow-marketplace/issues)
- **Discord**: [CC France Community](#)
- **Email**: support@cc-france.org

---

**Built with ❤️ for the French Claude Code community**

🤖 Powered by [Claude Code](https://claude.com/code) | 🎮 Gamify your productivity with QuestFlow!
