---
description: Browse the shop
argument-hint: Optional category (boosts/cosmetics/perks/special)
---

Browse and purchase items from the QuestFlow shop using MCP tools.

First, use the getShopItems MCP tool to display available items. You can filter by category:
- boosts: XP multipliers, coin multipliers, etc.
- cosmetics: Avatars, badges, themes
- perks: Special abilities
- special: Limited edition items

Display items in a nice format showing:
- Emoji icon
- Name and description
- Price in coins
- Item ID

If the user wants to purchase an item, ask for confirmation showing the price, then use the purchaseItem MCP tool with the item ID.

Show the purchase confirmation with updated coin balance.
