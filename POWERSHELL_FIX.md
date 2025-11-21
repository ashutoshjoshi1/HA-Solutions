# Fix PowerShell Execution Policy Error

## Problem

When trying to activate a Python virtual environment in PowerShell, you get this error:

```
File C:\Websites\HA-Solutions\venv\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled on this system.
```

## Solution Options

### Option 1: Change Execution Policy (Recommended)

This allows PowerShell to run scripts safely.

1. Open **PowerShell as Administrator**:
   - Press `Windows Key + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"

2. Run this command:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. Type `Y` when prompted and press Enter

4. Now you can activate your virtual environment:
   ```powershell
   venv\Scripts\activate
   ```

**What this does:**
- `RemoteSigned` means scripts downloaded from internet need to be signed, but local scripts (like your venv) can run
- `CurrentUser` means this only affects your user account, not the whole system
- This is safe and commonly used by developers

### Option 2: Use Command Prompt Instead

Command Prompt (cmd.exe) doesn't have this restriction.

1. Open **Command Prompt** (not PowerShell)
2. Navigate to your project:
   ```cmd
   cd C:\Websites\HA-Solutions
   ```
3. Activate using `.bat` file:
   ```cmd
   venv\Scripts\activate.bat
   ```

This works immediately without changing any settings.

### Option 3: Bypass for Current Session Only

If you don't want to change the policy permanently:

1. In PowerShell (regular, not admin):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
   venv\Scripts\activate
   ```

This only affects the current PowerShell window and resets when you close it.

## Recommended Approach

**For development:** Use Option 1 (change execution policy) - it's the most convenient long-term solution.

**For quick testing:** Use Option 2 (Command Prompt) - no changes needed.

## Verify It Works

After fixing, you should see `(venv)` at the start of your prompt:

```
(venv) PS C:\Websites\HA-Solutions>
```

or

```
(venv) C:\Websites\HA-Solutions>
```

## Why This Happens

Windows PowerShell has a security feature that prevents scripts from running by default. This protects your system from malicious scripts, but it also blocks legitimate scripts like Python virtual environment activation scripts.

The `RemoteSigned` policy is a good balance - it allows local scripts (like your venv) to run while still protecting against unsigned scripts from the internet.

