# Workshop Setup Instructions

## Prerequisites
- VS Code (latest version)
- Node.js 18+ installed
- GitHub Copilot extension installed and active
- GitHub Copilot Chat extension installed and active
- (Optional) GitHub CLI (`gh`) -- https://cli.github.com/

## Setup Steps

```bash
# 1. Clone the project
git clone <REPO_URL>
cd copilot-workshop

# 2. Install dependencies
npm install

# 3. Run the tests (should see 5 passing)
npm test

# 4. Verify Copilot is working
# - Open any .js file in VS Code
# - Start typing a comment like "// function to add two numbers"
# - You should see Copilot suggestions in gray text
# - Press Tab to accept

# 5. Verify Copilot Chat is working
# - Press Ctrl+Cmd+I (Mac) or Ctrl+Alt+I (Windows)
# - Type "Hello" and press Enter
# - You should get a response
```

## If Copilot Isn't Working
1. Check the status bar icon (bottom right) -- click it to verify subscription
2. Try signing out and back in via the Accounts icon
3. Restart VS Code
4. Check: Extensions > GitHub Copilot > is it enabled?

## Project Structure
```
copilot-workshop/
  src/
    index.js                    -- Express app entry point
    models/
      Task.js                   -- Task model (has intentional bugs!)
      User.js                   -- User model
    routes/
      taskRoutes.js             -- Task CRUD endpoints
      userRoutes.js             -- User endpoints (no validation)
      analyticsRoutes.js        -- Incomplete endpoints (TODOs)
    services/
      legacyReportEngine.js     -- Cryptic legacy code
    middleware/
      rateLimiter.js            -- Empty (you'll build this)
      validator.js              -- Empty (you'll build this)
    utils/
      dateHelpers.js            -- Date utilities (has a bug!)
    __tests__/
      task.test.js              -- Starter tests
  exercises/
    EXERCISES.md                -- Step-by-step handout (open during workshop)
    pr_review_demo/             -- PR review exercise files
    regex_challenge/            -- Regex challenge with test scoring
    refactoring_challenge/      -- Callback hell refactoring
    speed_challenge/            -- Timed build challenge
    python_converter/           -- Cross-language translation
    ui_mockup/                  -- Dashboard for screenshot-to-code demo
    powerups_demo/              -- Hooks, prompts, MCP, agents examples
    custom_agents_demo/         -- Custom agent examples
```

## During the Workshop
Keep `exercises/EXERCISES.md` open -- it has all the prompts you'll need to copy.
