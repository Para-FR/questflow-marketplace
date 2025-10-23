---
description: Create a new quest
argument-hint: Optional quest details
---

Create a new quest in QuestFlow using the MCP createQuest tool.

Ask the user for quest details if not provided:
- Title (required)
- Description (optional)  
- Difficulty: easy, medium, hard, or epic (required)
- Type: dev, social, admin, personal, or learning (required)
- Estimated time in minutes (optional)

Then call the MCP tool with the provided information and show the success message with XP and coin rewards.
