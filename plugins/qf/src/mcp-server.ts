#!/usr/bin/env bun

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// Configuration
const API_URL = process.env.QUESTFLOW_API_URL || "http://localhost:3014";
const API_KEY = process.env.QUESTFLOW_API_KEY || "";

if (!API_KEY) {
  console.error("❌ QUESTFLOW_API_KEY environment variable is required");
  console.error(`Generate one at: ${API_URL}/settings`);
  console.error("Run /qf:setup to configure your API key");
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
        projectId: {
          type: "string",
          description: "Optional project ID to assign quest to (premium feature)",
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
  {
    name: "listProjects",
    description: "List all projects (premium feature)",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["active", "archived", "completed"],
          description: "Filter by project status",
        },
      },
    },
  },
  {
    name: "createProject",
    description: "Create a new project (premium feature)",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Project name (1-100 characters)",
        },
        description: {
          type: "string",
          description: "Project description (optional, max 500 characters)",
        },
        emoji: {
          type: "string",
          description: "Project emoji icon (max 10 characters)",
        },
        color: {
          type: "string",
          description: "Project color in hex format (e.g., #6366f1)",
        },
      },
      required: ["name", "emoji", "color"],
    },
  },
  {
    name: "getProject",
    description: "Get project details with stats and quests (premium feature)",
    inputSchema: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
          description: "Project ID to retrieve",
        },
      },
      required: ["projectId"],
    },
  },
  {
    name: "updateProject",
    description: "Update project details (premium feature)",
    inputSchema: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
          description: "Project ID to update",
        },
        name: {
          type: "string",
          description: "New project name (optional)",
        },
        description: {
          type: "string",
          description: "New project description (optional)",
        },
        emoji: {
          type: "string",
          description: "New project emoji (optional)",
        },
        color: {
          type: "string",
          description: "New project color (optional)",
        },
        status: {
          type: "string",
          enum: ["active", "archived", "completed"],
          description: "New project status (optional)",
        },
      },
      required: ["projectId"],
    },
  },
  {
    name: "archiveProject",
    description: "Archive a project and unassign all quests (premium feature)",
    inputSchema: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
          description: "Project ID to archive",
        },
      },
      required: ["projectId"],
    },
  },
  {
    name: "assignQuestsToProject",
    description: "Assign quests to a project (premium feature, max 50 quests per operation)",
    inputSchema: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
          description: "Project ID to assign quests to",
        },
        questIds: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of quest IDs to assign (max 50)",
        },
      },
      required: ["projectId", "questIds"],
    },
  },
  {
    name: "unassignQuestsFromProject",
    description: "Unassign quests from a project (premium feature)",
    inputSchema: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
          description: "Project ID to unassign quests from",
        },
        questIds: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of quest IDs to unassign",
        },
      },
      required: ["projectId", "questIds"],
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

        let message = `✅ Quest created successfully!\n\n` +
                     `📝 Title: ${result.quest.title}\n` +
                     `⚡ Difficulty: ${result.quest.difficulty}\n` +
                     `🎯 Type: ${result.quest.type}\n` +
                     `🏆 XP Reward: ${result.quest.xpReward}\n` +
                     `💰 Coin Reward: ${result.quest.coinReward}\n`;

        if (result.quest.projectId) {
          message += `📁 Assigned to project: ${result.quest.projectId}\n`;
        }

        message += `🆔 ID: ${result.quest._id}`;

        return {
          content: [
            {
              type: "text",
              text: message,
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

        const questList = quests.map((q: any) => {
          let line = `• [${q.status}] ${q.title} (${q.difficulty}, ${q.type}) - ${q.xpReward} XP`;
          if (q.projectId) {
            line += ` | 📁 Project`;
          }
          line += ` | ID: ${q._id}`;
          return line;
        }).join("\n");

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

      case "listProjects": {
        const queryParams = new URLSearchParams();
        if (args?.status) queryParams.append("status", args.status);

        const result = await apiRequest(`/api/projects?${queryParams}`);
        const projects = result.projects;

        if (projects.length === 0) {
          return {
            content: [
              { type: "text", text: "📁 No projects found. Create your first project to organize your quests!" },
            ],
          };
        }

        const projectList = projects.map((p: any) =>
          `• ${p.emoji} ${p.name} (${p.status})\n` +
          `  📊 ${p.stats.completedQuests}/${p.stats.totalQuests} quests (${p.stats.completionRate}%) | ${p.stats.totalXP} XP | ID: ${p._id}`
        ).join("\n\n");

        return {
          content: [
            {
              type: "text",
              text: `📁 Your Projects (${projects.length}):\n\n${projectList}`,
            },
          ],
        };
      }

      case "createProject": {
        const result = await apiRequest("/api/projects", {
          method: "POST",
          body: JSON.stringify(args),
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ Project created successfully!\n\n` +
                    `${result.project.emoji} ${result.project.name}\n` +
                    `📝 ${result.project.description || "No description"}\n` +
                    `🎨 Color: ${result.project.color}\n` +
                    `🆔 ID: ${result.project._id}`,
            },
          ],
        };
      }

      case "getProject": {
        const result = await apiRequest(`/api/projects/${args.projectId}`);
        const p = result.project;
        const quests = result.quests;

        let message = `${p.emoji} ${p.name}\n` +
                     `📝 ${p.description || "No description"}\n\n` +
                     `📊 Project Stats:\n` +
                     `   • Total Quests: ${p.stats.totalQuests}\n` +
                     `   • Completed: ${p.stats.completedQuests}\n` +
                     `   • In Progress: ${p.stats.inProgressQuests}\n` +
                     `   • Completion Rate: ${p.stats.completionRate}%\n` +
                     `   • Total XP: ${p.stats.totalXP}`;

        if (quests.length > 0) {
          message += `\n\n📋 Assigned Quests (${quests.length}):\n`;
          quests.slice(0, 10).forEach((q: any) => {
            message += `   • [${q.status}] ${q.title} (${q.xpReward} XP)\n`;
          });
          if (quests.length > 10) {
            message += `   ... and ${quests.length - 10} more`;
          }
        }

        return {
          content: [{ type: "text", text: message }],
        };
      }

      case "updateProject": {
        const { projectId, ...updateData } = args;
        const result = await apiRequest(`/api/projects/${projectId}`, {
          method: "PATCH",
          body: JSON.stringify(updateData),
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ Project updated successfully!\n\n` +
                    `${result.project.emoji} ${result.project.name}\n` +
                    `Status: ${result.project.status}`,
            },
          ],
        };
      }

      case "archiveProject": {
        const result = await apiRequest(`/api/projects/${args.projectId}`, {
          method: "DELETE",
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ ${result.message}\n\n` +
                    `${result.project.emoji} ${result.project.name} has been archived.`,
            },
          ],
        };
      }

      case "assignQuestsToProject": {
        const result = await apiRequest(`/api/projects/${args.projectId}/quests`, {
          method: "POST",
          body: JSON.stringify({ questIds: args.questIds }),
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ ${result.message}\n` +
                    `📊 ${result.assignedCount} quest(s) assigned to project.`,
            },
          ],
        };
      }

      case "unassignQuestsFromProject": {
        const result = await apiRequest(`/api/projects/${args.projectId}/quests`, {
          method: "DELETE",
          body: JSON.stringify({ questIds: args.questIds }),
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ ${result.message}\n` +
                    `📊 ${result.unassignedCount} quest(s) unassigned from project.`,
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
