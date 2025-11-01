# QuestFlow MCP Plugin - Anti-Abuse System Updates

**Date**: November 1, 2025
**Version**: 2.0.0
**Status**: ✅ Production Ready

---

## 🎯 What Changed for MCP Users

**TL;DR**: Nothing! MCP users (QuestFlow plugin) have **ZERO restrictions** and **full unrestricted access**.

This update adds protection against web-based quest abuse while **preserving complete functionality** for Claude Code users with the QuestFlow plugin.

---

## 🔐 How the System Works

### Source Detection

The system automatically detects how a quest is created:

- **API Key Authentication** → `source: "mcp"` (QuestFlow plugin)
- **Session Authentication** → `source: "web"` (Web UI)

```typescript
// Automatic detection in app/api/quests/route.ts
const apiKeyAuth = await getAuthenticatedUserFromApiKey(request);

if (apiKeyAuth.user) {
  source = "mcp";  // ✅ QuestFlow plugin detected
} else {
  source = "web";  // Web user
}
```

### MCP Privileges

When `source === "mcp"`, the following privileges apply:

| Feature | Web Users | MCP Users |
|---------|-----------|-----------|
| **Epic Quests** | ❌ Blocked | ✅ Unrestricted |
| **Rate Limiting** | 20 quests/hour | ✅ No limit |
| **Quest Creation** | Manual form | ✅ Automated via Claude Code |
| **Difficulty Selection** | Trivial to Hard | ✅ All difficulties including Epic |
| **XP Rewards** | Rebalanced | ✅ Full rewards |
| **API Access** | None | ✅ Full API access |

---

## 📊 XP Economy Update

### Rebalanced XP Values

| Difficulty | Previous | Current | Change | Who Can Create |
|------------|----------|---------|--------|----------------|
| **Trivial** | 35 XP | 25 XP | -29% | Web + MCP |
| **Easy** | 100 XP | 75 XP | -25% | Web + MCP |
| **Medium** | 300 XP | 250 XP | -17% | Web + MCP |
| **Hard** | 750 XP | 650 XP | -13% | Web + MCP |
| **Epic** | 2000 XP | 2000 XP | Unchanged | **MCP only** |

### Why Epic Quests Are MCP-Only

Epic quests (2000 XP) are reserved for **complex, AI-assisted tasks** that are automatically created and managed by Claude Code via the QuestFlow plugin. These represent significant development work that justifies the high XP reward.

**Examples of Epic Quests via MCP**:
- "Implement full authentication system with OAuth"
- "Refactor entire codebase to use TypeScript strict mode"
- "Build and deploy production-ready feature with tests"

---

## 🎮 Completion Multipliers (NEW!)

To compensate for the base XP reduction, we've introduced **performance-based multipliers**:

| Multiplier | Condition | Bonus |
|------------|-----------|-------|
| **On time** | Completed within estimated time | +10% XP |
| **Fast completion** | Completed in < 50% of estimated time | +15% XP (additional) |
| **All subtasks** | All subtasks completed | +15% XP |

**Maximum bonus**: +40% XP (all multipliers stacked)

### Example for MCP Users

```typescript
// Epic quest created via QuestFlow
difficulty: "epic"
baseXP: 2000

// User completes efficiently
actualTime: 45 minutes
estimatedTime: 120 minutes
subtasks: 5/5 completed

// Multipliers applied
+ 10% On time: +200 XP
+ 15% Fast completion: +300 XP
+ 15% All subtasks: +300 XP

= 2800 XP total (+40%)
```

**MCP users can earn up to 2800 XP per epic quest!**

---

## 🔧 Technical Implementation

### API Endpoint Changes

#### POST /api/quests

**Request** (unchanged):
```json
{
  "title": "Implement feature X",
  "description": "Build comprehensive feature...",
  "type": "dev",
  "difficulty": "epic",
  "timeEstimate": 120
}
```

**Response** (new field):
```json
{
  "success": true,
  "quest": {
    "_id": "...",
    "title": "Implement feature X",
    "difficulty": "epic",
    "xpReward": 2000,
    "source": "mcp",  // ← NEW: Tracks creation source
    ...
  }
}
```

**For Web Users** (epic attempt):
```json
{
  "success": false,
  "error": "Epic quests can only be created via MCP",
  "hint": "Use Claude Code with QuestFlow plugin for complex epic tasks"
}
```

#### POST /api/quests/[id]/complete

**Response** (enhanced with multipliers):
```json
{
  "success": true,
  "quest": {...},
  "xp": {
    "base": 2000,
    "bonus": 800,
    "earned": 2800,
    "multiplier": 1.4,
    "multipliers": [
      "+10% On time",
      "+15% Fast completion",
      "+15% All subtasks completed"
    ],
    "leveledUp": true,
    "newLevels": 3,
    "currentLevel": 42,
    "currentXP": 1250,
    "xpToNextLevel": 3500
  },
  "coins": {...},
  "streak": {...},
  "achievements": {...}
}
```

---

## 🚀 QuestFlow Plugin Usage

### Creating Epic Quests

**Via Claude Code MCP**:
```typescript
// Example QuestFlow command
await createQuest({
  title: "Build production-ready authentication system",
  description: "Implement OAuth2.0 with Google, Discord, and GitHub providers",
  type: "dev",
  difficulty: "epic",  // ✅ Allowed for MCP
  estimatedTime: 240,
  subtasks: [
    { title: "Set up OAuth providers", completed: false },
    { title: "Create auth middleware", completed: false },
    { title: "Build login UI", completed: false },
    { title: "Add session management", completed: false },
    { title: "Write integration tests", completed: false }
  ]
});
```

**Response**:
```json
{
  "success": true,
  "quest": {
    "title": "Build production-ready authentication system",
    "difficulty": "epic",
    "xpReward": 2000,
    "source": "mcp",
    "status": "pending"
  }
}
```

### Automatic Quest Creation

When using Claude Code with QuestFlow, quests are created **automatically** as you work:

1. **Claude Code detects task**: "I'll help you implement authentication"
2. **QuestFlow creates quest**: Automatically generates epic quest via MCP API
3. **User works on task**: Claude Code assists with implementation
4. **QuestFlow marks complete**: Automatically marks quest as completed when done
5. **XP awarded**: User receives 2000-2800 XP with multipliers

**No manual intervention required!**

---

## 📈 Impact on MCP Users

### Before Update
- Epic quests: ✅ Available
- Rate limiting: ❌ None
- Base XP: 2000 for epic

### After Update
- Epic quests: ✅ **Still available (exclusive)**
- Rate limiting: ❌ **Still none**
- Base XP: 2000 for epic
- **NEW**: Bonus XP up to +40% (2800 XP max)
- **NEW**: Source tracking for analytics

**Net result**: MCP users are **even more rewarded** than before!

---

## 🔍 Analytics & Monitoring

### New Metrics

The system now tracks quest creation sources:

```mongodb
// Example analytics query
db.quests.aggregate([
  {
    $group: {
      _id: "$source",
      count: { $sum: 1 },
      totalXP: { $sum: "$xpReward" }
    }
  }
])

// Sample output
[
  { _id: "mcp", count: 45, totalXP: 78000 },
  { _id: "web", count: 186, totalXP: 35000 }
]
```

This helps understand:
- How many users leverage QuestFlow vs manual creation
- XP distribution between sources
- Epic quest usage patterns

---

## 🛡️ Security Considerations

### API Key Protection

**CRITICAL**: Your QuestFlow API key provides unrestricted access. Never share or commit it to version control.

**Environment variable**:
```env
QUESTFLOW_API_KEY=qf_your_secure_key_here
```

**API request header**:
```http
POST /api/quests
Authorization: Bearer qf_your_secure_key_here
Content-Type: application/json
```

### Rate Limiting Bypass

MCP users bypass rate limiting because:
1. **Trusted source**: Claude Code creates quests programmatically
2. **Legitimate volume**: Large task lists are normal for development
3. **API key authentication**: Requires secure credential

---

## 🎓 Best Practices for MCP Users

### 1. Use Epic Quests for Complex Tasks

**Good examples**:
- Full feature implementations (3+ hours)
- Major refactoring efforts
- Production deployments
- Integration of multiple systems

**Not recommended**:
- Simple bug fixes (use "easy" or "medium")
- Documentation updates (use "trivial")
- Code reviews (use "medium")

### 2. Accurate Time Estimates

For maximum XP with multipliers, provide realistic time estimates:

```typescript
// ✅ Good: Realistic estimate
{
  title: "Build authentication system",
  difficulty: "epic",
  estimatedTime: 240  // 4 hours for complex task
}

// ❌ Bad: Inflated estimate
{
  title: "Build authentication system",
  difficulty: "epic",
  estimatedTime: 600  // 10 hours - harder to get fast completion bonus
}
```

### 3. Use Subtasks

Breaking work into subtasks increases XP:

```typescript
{
  title: "Implement CI/CD pipeline",
  difficulty: "epic",
  estimatedTime: 180,
  subtasks: [
    { title: "Set up GitHub Actions workflow" },
    { title: "Configure test automation" },
    { title: "Add deployment staging" },
    { title: "Set up production deploy" },
    { title: "Add monitoring and alerts" }
  ]
}
// Completing all subtasks = +15% bonus XP (300 XP extra!)
```

---

## 🔧 Migration Notes

### Existing Quests

All existing quests were migrated with `source: "web"` as default:

```bash
bun scripts/migrate-add-quest-source.ts

# Output:
# ✅ Migration complete!
#    - Documents matched: 186
#    - Documents modified: 186
#
# 📊 Source distribution:
#    - web: 186 quests
```

**New quests** created via MCP will automatically be tagged with `source: "mcp"`.

---

## 📞 Support

### For QuestFlow Issues

1. **Plugin not authenticating**: Check your API key in environment variables
2. **Quests not creating**: Verify API endpoint and network connectivity
3. **Epic quests blocked**: Ensure you're using API key authentication (not session)

### For General Questions

Refer to the main documentation:
- `docs/QUEST_ANTI_ABUSE_SYSTEM.md` - Complete anti-abuse system overview
- `docs/API_DOCUMENTATION.md` - Full API reference

---

## 🎉 Summary

**For MCP Users (QuestFlow Plugin)**:
- ✅ **No changes** to your workflow
- ✅ **Exclusive access** to epic quests (2000 XP)
- ✅ **No rate limiting** - create unlimited quests
- ✅ **Bonus multipliers** - earn up to +40% XP
- ✅ **Automatic tracking** - source field for analytics

**This update enhances your experience without adding any restrictions!**

---

**Last Updated**: November 1, 2025
**Maintained By**: ContentFlow Admin Team
**QuestFlow Plugin**: [GitHub Repository](#)
