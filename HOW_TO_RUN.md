# How to Run the Django Server

## The Problem
You're getting "ModuleNotFoundError: No module named 'django'" because Django is installed in the virtual environment, but you're not using it.

## Solution: Activate the Virtual Environment

**Before running any Django commands, you MUST activate the virtual environment first!**

### Step 1: Activate Virtual Environment

```bash
source venv/bin/activate
```

You should see `(venv)` appear at the beginning of your terminal prompt.

### Step 2: Run the Server

```bash
python manage.py runserver
```

### Step 3: Access the Website

Open your browser and go to: `http://127.0.0.1:8000/`

---

## Quick Start (All in One)

```bash
# Navigate to project directory
cd "/Users/hamzaadnan/Documents/Business/HA Solutions/Website/HA-Solutions"

# Activate virtual environment
source venv/bin/activate

# Run server
python manage.py runserver
```

---

## Alternative: Use the Start Script

I've created a script that does this automatically:

```bash
./START_SERVER.sh
```

Or:

```bash
bash START_SERVER.sh
```

---

## Important Notes

- **Always activate the virtual environment first!** Look for `(venv)` in your terminal prompt
- If you see `(base)` or no environment indicator, you're not in the virtual environment
- To deactivate the virtual environment when done: `deactivate`

---

## Troubleshooting

**If you get "command not found" for `source`:**
- On Windows, use: `venv\Scripts\activate`
- Or use: `. venv/bin/activate` (with a dot)

**If Django is still not found:**
- Make sure you're in the project directory
- Check that `venv` folder exists
- Reinstall Django: `pip install -r requirements.txt`

