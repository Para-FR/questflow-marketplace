#!/usr/bin/env bun

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// Configuration
const API_URL = process.env.QUESTFLOW_API_URL || "http://localhost:3005";
const API_KEY = process.env.QUESTFLOW_API_KEY || "";

if (!API_KEY) {
  console.error("❌ QUESTFLOW_API_KEY environment variable is required");
  console.error("Generate one at: http://localhost:3005/settings");
  process.exit(1);
}

// HTTP client helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Define MCP tools
const tools: Tool[] = [
  {
    name: "createQuest",
    description: "Create a new quest in QuestFlow",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Quest title",
        },
        description: {
          type: "string",
          description: "Quest description",
        },
        difficulty: {
          type: "string",
          enum: ["easy", "medium", "hard", "epic"],
          description: "Quest difficulty",
        },
        type: {
          type: "string",
          enum: ["dev", "social", "admin", "personal", "learning"],
          description: "Quest type",
        },
        estimatedTime: {
          type: "number",
          description: "Estimated time in minutes",
        },
      },
      required: ["title", "difficulty", "type"],
    },
  },
  {
    name: "listQuests",
    description: "List all quests with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["pending", "in-progress", "completed"],
          description: "Filter by quest status",
        },
        type: {
          type: "string",
          description: "Filter by quest type",
        },
      },
    },
  },
  {
    name: "startQuest",
    description: "Start working on a quest",
    inputSchema: {
      type: "object",
      properties: {
        questId: {
          type: "string",
          description: "Quest ID to start",
        },
      },
      required: ["questId"],
    },
  },
  {
    name: "completeQuest",
    description: "Mark a quest as completed and earn rewards",
    inputSchema: {
      type: "object",
      properties: {
        questId: {
          type: "string",
          description: "Quest ID to complete",
        },
      },
      required: ["questId"],
    },
  },
  {
    name: "getPlayerStats",
    description: "Get player profile and statistics",
    inputSchema: {
      type: "object",
      properties: {
        period: {
          type: "string",
          enum: ["today", "week", "month", "all"],
          description: "Stats period (default: all)",
        },
      },
    },
  },
  {
    name: "getShopItems",
    description: "Browse available shop items",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["boosts", "cosmetics", "perks", "special"],
          description: "Filter by category",
        },
      },
    },
  },
  {
    name: "purchaseItem",
    description: "Purchase an item from the shop",
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "string",
          description: "Item ID to purchase",
        },
      },
      required: ["itemId"],
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: "questflow",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list_tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle call_tool request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "createQuest": {
        const result = await apiRequest("/api/quests", {
          method: "POST",
          body: JSON.stringify(args),
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ Quest created successfully!\n\n` +
                    `📝 Title: ${result.quest.title}\n` +
                    `⚡ Difficulty: ${result.quest.difficulty}\n` +
                    `🎯 Type: ${result.quest.type}\n` +
                    `🏆 XP Reward: ${result.quest.xpReward}\n` +
                    `💰 Coin Reward: ${result.quest.coinReward}\n` +
                    `🆔 ID: ${result.quest._id}`,
            },
          ],
        };
      }

      case "listQuests": {
        const queryParams = new URLSearchParams();
        if (args?.status) queryParams.append("status", args.status);
        if (args?.type) queryParams.append("type", args.type);

        const result = await apiRequest(`/api/quests?${queryParams}`);
        const quests = result.quests;

        if (quests.length === 0) {
          return {
            content: [
              { type: "text", text: "📭 No quests found. Create your first quest to get started!" },
            ],
          };
        }

        const questList = quests.map((q: any) =>
          `• [${q.status}] ${q.title} (${q.difficulty}, ${q.type}) - ${q.xpReward} XP | ID: ${q._id}`
        ).join("\n");

        return {
          content: [
            {
              type: "text",
              text: `📋 Your Quests (${quests.length}):\n\n${questList}`,
            },
          ],
        };
      }

      case "startQuest": {
        const result = await apiRequest(`/api/quests/${args.questId}/start`, {
          method: "POST",
        });
        return {
          content: [
            {
              type: "text",
              text: `🚀 Quest started!\n\n` +
                    `📝 ${result.quest.title}\n` +
                    `⏱️ Started at: ${new Date(result.quest.startedAt).toLocaleString()}`,
            },
          ],
        };
      }

      case "completeQuest": {
        const result = await apiRequest(`/api/quests/${args.questId}/complete`, {
          method: "POST",
        });

        let message = `🎉 Quest completed!\n\n` +
                     `📝 ${result.quest.title}\n` +
                     `⚡ +${result.xp.earned} XP\n` +
                     `💰 +${result.coins.earned} coins`;

        if (result.coins.multiplier > 1) {
          message += ` (${result.coins.multiplier}x boost!)`;
        }

        if (result.xp.leveledUp) {
          message += `\n\n🎊 LEVEL UP! You're now level ${result.xp.currentLevel}!`;
          if (result.xp.newLevels > 1) {
            message += ` (+${result.xp.newLevels} levels!)`;
          }
        }

        if (result.achievements?.newlyUnlocked?.length > 0) {
          message += `\n\n🏆 New Achievements:\n`;
          result.achievements.newlyUnlocked.forEach((ach: any) => {
            message += `   • ${ach.name} - ${ach.description}\n`;
          });
        }

        if (result.streak) {
          message += `\n\n🔥 Streak: ${result.streak.current} days`;
        }

        return {
          content: [{ type: "text", text: message }],
        };
      }

      case "getPlayerStats": {
        const period = args?.period || "all";
        const [player, stats] = await Promise.all([
          apiRequest("/api/player"),
          apiRequest(`/api/player/stats?period=${period}`),
        ]);

        const p = player.player;
        const s = stats.stats;

        const message = `👤 Player Profile\n\n` +
                       `🎮 ${p.displayName} ${p.avatar}\n` +
                       `⚡ Level ${p.level} (${p.xp}/${p.xpToNextLevel} XP)\n` +
                       `💰 ${p.coins} coins\n` +
                       `🔥 ${p.streaks.current} day streak\n\n` +
                       `📊 Stats (${period}):\n` +
                       `   • Total Quests: ${s.total.quests}\n` +
                       `   • Completed: ${s.total.completed}\n` +
                       `   • In Progress: ${s.total.inProgress}\n` +
                       `   • Time Spent: ${s.timeSpent.totalMinutes} minutes\n` +
                       `   • Avg per Quest: ${s.timeSpent.averagePerQuest} min`;

        return {
          content: [{ type: "text", text: message }],
        };
      }

      case "getShopItems": {
        const queryParams = new URLSearchParams();
        if (args?.category) queryParams.append("category", args.category);

        const result = await apiRequest(`/api/shop/items?${queryParams}`);
        const items = result.items;

        if (items.length === 0) {
          return {
            content: [{ type: "text", text: "🏪 No items available in the shop." }],
          };
        }

        const itemList = items.map((item: any) =>
          `• ${item.emoji} ${item.name} - ${item.price} coins\n  ${item.description}`
        ).join("\n\n");

        return {
          content: [
            {
              type: "text",
              text: `🏪 Shop Items:\n\n${itemList}`,
            },
          ],
        };
      }

      case "purchaseItem": {
        const result = await apiRequest(`/api/shop/purchase`, {
          method: "POST",
          body: JSON.stringify({ itemId: args.itemId }),
        });

        return {
          content: [
            {
              type: "text",
              text: `✅ Purchase successful!\n\n` +
                    `🎁 ${result.item.name}\n` +
                    `💰 -${result.item.price} coins\n` +
                    `💵 Remaining: ${result.coinsRemaining} coins`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("QuestFlow MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
