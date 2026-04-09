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

## Installing Node.js on Windows (Without Admin Rights)

If you don't have administrator privileges on your Windows machine, you can install Node.js using the standalone binary:

### Step 1: Download the Standalone Binary
1. Go to https://nodejs.org/en/download
2. Scroll down to find **"Windows Binary (.zip)"** under the download options
3. Download the appropriate version:
   - **64-bit**: `node-vxx.x.x-win-x64.zip` (most common)

### Step 2: Extract and Place Files
1. Right-click the downloaded `.zip` file and select **Extract All...**
2. Choose an extraction location you have write access to, such as:
   - `C:\Users\<YourUsername>\nodejs`
   - Or any folder in your user directory
3. Note the full path to the extracted folder (e.g., `C:\Users\YourName\nodejs`)

### Step 3: Add Node.js to Your User PATH
1. Open **Control Panel**:
   - Press **Windows Key**, type **"Control Panel"**, and press Enter
2. Navigate to environment variables:
   - Click **User Accounts**
   - Click **User Accounts** again
   - Click **Change my environment variables** (this doesn't require admin)
3. In the **User variables** section (top half), find and select the **Path** variable
4. Click **Edit...**
5. Click **New**
6. Paste the full path to your Node.js folder (e.g., `C:\Users\YourName\nodejs`)
7. Click **OK** on all dialogs to save

### Step 4: Restart and Verify Installation
1. **Close all open Command Prompt and PowerShell windows**
2. **Close and restart VS Code** (important - it needs to reload environment variables)
3. Open a new Command Prompt or PowerShell window
4. Test the installation by running:
   ```bash
   node --version
   ```
   You should see output like: `v18.x.x`
5. Test npm (Node Package Manager):
   ```bash
   npm --version
   ```
   You should see output like: `9.x.x`

### Troubleshooting
- If `node --version` still doesn't work after restarting:
  - Double-check the PATH was added correctly (repeat Step 3)
  - Make sure you fully closed and reopened your terminal/VS Code
  - Verify the folder path contains `node.exe` and `npm.cmd`
- If npm doesn't work but node does, make sure the PATH points to the main folder (not a subfolder)

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
