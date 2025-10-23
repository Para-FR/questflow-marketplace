---
description: Mark a quest as completed
argument-hint: Optional quest ID
---

Mark a quest as completed using the MCP completeQuest tool.

If the user didn't provide a quest ID, first list their in-progress quests using the listQuests tool with status="in-progress", then ask which quest they completed.

Call the completeQuest MCP tool with the quest ID and celebrate the success showing:
- XP earned
- Coins earned (with multiplier if boosted)
- Level up notification if applicable
- New achievements unlocked
- Current streak

This is a moment of celebration - use enthusiastic language!
