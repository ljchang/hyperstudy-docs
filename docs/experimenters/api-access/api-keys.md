---
id: api-keys
title: API Key Management
slug: /experimenters/api-access/api-keys
sidebar_position: 1
---

# API Key Management

API keys allow you to access your HyperStudy data programmatically without needing to log in through the web interface. This guide will show you how to create, manage, and use API keys securely.

## What Are API Keys?

API keys are secure tokens that authenticate your programs and scripts when they access the HyperStudy API. Think of them as passwords specifically for your code.

**Key Features**:
- **Programmatic Access**: Use Python, JavaScript, R, or any language to download data
- **Fine-Grained Permissions**: Control exactly what data each key can access
- **Expiration**: Set automatic expiration dates for security
- **Usage Tracking**: Monitor when and how keys are used
- **Revocable**: Instantly disable a key if it's compromised

## Accessing the API Key Manager

1. **Log in to HyperStudy**
2. **Navigate to Admin Dashboard**
   - Click on your profile or the dashboard icon
3. **Click "API Keys"** in the sidebar

You'll see a table listing all your API keys (if you have any).

## Creating Your First API Key

### Step-by-Step Guide

1. **Click "Create API Key"**
   - A modal dialog will appear

2. **Fill in the Key Information**:

   **Name** (required)
   - Give your key a descriptive name
   - Examples: "Python Analysis Script", "R Statistical Analysis", "Automated Export"

   **Description** (optional)
   - Add details about what this key is for
   - Examples: "For downloading event data in my research pipeline", "Weekly data exports to CSV"

3. **Select Permissions (Scopes)**:

   Choose which data types this key can access. See [Available Scopes](#available-scopes) below.

   **Common Selections**:
   - **For general data analysis**: Select "Read All Data" (all read:* scopes)
   - **For specific needs**: Select only what you need (e.g., just "Read Events")
   - **For security**: Use minimum necessary permissions

4. **Set Expiration**:

   Choose how long the key should remain valid:
   - `7d` - 7 days (good for testing)
   - `30d` - 30 days (good for short projects)
   - `90d` - 90 days (recommended for most use cases)
   - `1y` - 1 year (for long-term integrations)
   - `never` - No expiration (use with caution!)

   **Recommendation**: Use 90 days and rotate keys regularly for better security.

5. **Click "Create API Key"**

### Important: Save Your API Key!

After clicking "Create", you'll see a screen showing your new API key:

```
hst_live_a3f2b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2
```

**🚨 CRITICAL**: This is the **ONLY TIME** you'll see the full key!

**What to do**:
1. **Copy the key** immediately
2. **Store it securely** (see [Security Best Practices](#security-best-practices))
3. **Click "Download .env File"** to get a template environment file
4. **Test the key** to make sure it works
5. **Click "I've Saved It"** when you're done

If you lose the key, you'll need to create a new one - there's no way to retrieve it!

## Understanding API Keys

### API Key Format

HyperStudy API keys follow this format:

```
hst_{environment}_{random_key}
```

- **`hst`**: HyperStudy prefix
- **`{environment}`**:
  - `live` - Production environment
  - `test` - Development/testing environment
- **`{random_key}`**: 64-character random string

**Examples**:
```
hst_live_a1b2c3d4e5...     (production)
hst_test_x9y8z7w6v5...     (development)
```

### Masked vs Full Keys

In the API Key Manager table, you'll see keys in masked format:

```
hst_live_a3f2b4...******
```

Only the first few and last few characters are shown. This is for security - you can identify which key it is without exposing the full value.

## Available Scopes

Scopes control what data your API key can access. Choose the minimum scopes needed for your use case.

### Data Access Scopes

| Scope | Description | What You Can Access |
|-------|-------------|---------------------|
| `read:events` | Read event data | Participant interactions, component events, state transitions |
| `read:recordings` | Read recordings | Video/audio recordings from LiveKit sessions |
| `read:chat` | Read chat messages | Text chat messages between participants |
| `read:ratings` | Read rating data | Both continuous and sparse rating data |
| `read:sync` | Read sync metrics | Video synchronization quality metrics |
| `read:participants` | Read participant data | Participant metadata and session information |
| `read:components` | Read component metadata | Experiment component configurations |

### Wildcard Scopes

| Scope | Description | Equivalent To |
|-------|-------------|---------------|
| `read:*` | Read all data types | All `read:` scopes above |
| `*` | Full access | All scopes (including future ones) |

### Scope Selection Guide

**For Data Analysis** (most common):
```
✓ read:events
✓ read:recordings
✓ read:ratings
```

**For Monitoring**:
```
✓ read:events
```

**For Complete Export**:
```
✓ read:*  (Read All Data)
```

**Security Tip**: Only grant scopes you actually need. You can always edit the key later to add more scopes.

## Managing Your API Keys

### Viewing Key Details

1. In the API Keys table, click **"Details"** next to any key
2. You'll see:
   - Name and description
   - Status (active, expired, revoked)
   - Scopes (permissions)
   - Created date
   - Expiration date
   - Last used timestamp
   - Usage statistics (request count)
   - Code examples with this key

### Editing an API Key

You can update some key properties after creation:

1. Click **"Details"** on the key
2. Click **"Edit"**
3. You can change:
   - **Name**: Update the descriptive name
   - **Description**: Update the description
   - **Scopes**: Add or remove permissions

**Note**: You **cannot** change:
- The key itself (it's one-time only)
- Expiration date (create a new key instead)
- Owner

4. Click **"Save Changes"**

### Revoking an API Key

If a key is compromised or no longer needed:

1. Click **"Details"** on the key
2. Click **"Revoke"**
3. Confirm the action

**Warning**: This is **permanent**! Any code using this key will immediately lose access.

**When to revoke**:
- Key was accidentally exposed (committed to GitHub, shared publicly)
- Key is no longer needed
- Switching to a new key
- Security audit requires key rotation

### Monitoring Key Usage

In the key details, check:

- **Last Used**: When the key was last used
- **Request Count**: Total number of API requests
- **Last IP**: IP address of last request

**Tips**:
- If "Last Used" is old, the key might be unused (safe to revoke)
- Monitor for unexpected usage patterns
- Check IP addresses for suspicious activity

## Using Your API Key

### In Python

```python
import os
import requests

# Load from environment variable
API_KEY = os.environ.get('HYPERSTUDY_API_KEY')

# Make API request
response = requests.get(
    'https://api.hyperstudy.io/api/v3/data/events/room/YOUR_ROOM_ID',
    headers={'X-API-Key': API_KEY}
)

if response.ok:
    data = response.json()
    print(f"Retrieved {len(data['data'])} events")
else:
    print(f"Error: {response.status_code}")
```

### In JavaScript

```javascript
const API_KEY = process.env.HYPERSTUDY_API_KEY;

const response = await fetch(
  'https://api.hyperstudy.io/api/v3/data/events/room/YOUR_ROOM_ID',
  {
    headers: {
      'X-API-Key': API_KEY
    }
  }
);

if (response.ok) {
  const result = await response.json();
  console.log(`Retrieved ${result.data.length} events`);
} else {
  console.error(`Error: ${response.status}`);
}
```

### In R

```r
library(httr)

API_KEY <- Sys.getenv("HYPERSTUDY_API_KEY")

response <- GET(
  "https://api.hyperstudy.io/api/v3/data/events/room/YOUR_ROOM_ID",
  add_headers("X-API-Key" = API_KEY)
)

if (status_code(response) == 200) {
  data <- content(response, as = "parsed")
  print(paste("Retrieved", length(data$data), "events"))
} else {
  print(paste("Error:", status_code(response)))
}
```

For complete examples, see:
- [Python Guide](./python-guide.md)
- [JavaScript Guide](./javascript-guide.md)
- [R Guide](./r-guide.md)

## Security Best Practices

### 1. Store Keys Securely

**✅ DO**:
- Use environment variables
- Use secret management services (AWS Secrets Manager, etc.)
- Use `.env` files (and add to `.gitignore`)
- Use password managers for personal projects

**❌ DON'T**:
- Hard-code keys in source code
- Commit keys to version control
- Share keys in emails or chat
- Store keys in plain text files

### Example: Using Environment Variables

**Create a `.env` file**:
```bash
# .env
HYPERSTUDY_API_KEY=hst_live_your_key_here
HYPERSTUDY_BASE_URL=https://api.hyperstudy.io/api/v3
```

**Add to `.gitignore`**:
```bash
# .gitignore
.env
```

**Load in Python**:
```python
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.environ.get('HYPERSTUDY_API_KEY')
```

**Load in JavaScript** (Node.js):
```javascript
require('dotenv').config();
const API_KEY = process.env.HYPERSTUDY_API_KEY;
```

**Load in R**:
```r
library(readr)
library(stringr)

# Read .env file
env_vars <- read_lines(".env")
for (var in env_vars) {
  if (str_starts(var, "HYPERSTUDY_API_KEY")) {
    Sys.setenv(HYPERSTUDY_API_KEY = str_split(var, "=")[[1]][2])
  }
}

API_KEY <- Sys.getenv("HYPERSTUDY_API_KEY")
```

### 2. Use Minimum Necessary Scopes

Only grant the permissions you actually need:

```python
# ❌ DON'T: Grant all scopes if you only need events
scopes = ['*']

# ✅ DO: Grant only what you need
scopes = ['read:events', 'read:ratings']
```

### 3. Set Expiration Dates

**Recommended Expiration**:
- **Testing/Development**: 7-30 days
- **Production Scripts**: 90 days
- **Long-term Integrations**: 1 year
- **Never**: Only for critical systems with manual rotation plan

### 4. Rotate Keys Regularly

**Best Practice**: Rotate keys every 90 days

**How to Rotate**:
1. Create a new API key
2. Update your code to use the new key
3. Test that the new key works
4. Revoke the old key

### 5. Monitor Usage

Regularly check:
- Last used timestamp
- Request counts
- Unexpected IP addresses

### 6. One Key Per Use Case

**❌ DON'T**: Share one key across multiple projects

**✅ DO**: Create separate keys:
- "Python Analysis Script"
- "R Export Pipeline"
- "JavaScript Monitoring"

**Benefits**:
- Easier to track usage
- Easier to revoke if compromised
- Better security isolation

### 7. Never Expose Client-Side

**❌ DON'T**: Use API keys in browser JavaScript or mobile apps

**✅ DO**: Use API keys only in server-side code

**Why**: Client-side code is visible to users. They can extract and misuse your key.

## Troubleshooting

### "Invalid API Key" Error

**Problem**: API returns 401 Unauthorized

**Solutions**:
1. Check you copied the full key (not the masked version)
2. Verify the key hasn't expired (check details)
3. Confirm the key hasn't been revoked
4. Make sure you're using `X-API-Key` header (not `Authorization`)
5. Check for extra spaces or line breaks in the key

**Test with curl**:
```bash
curl -H "X-API-Key: YOUR_KEY_HERE" \
     https://api.hyperstudy.io/api/v3/data/events/room/ROOM_ID
```

### "Insufficient Permissions" Error

**Problem**: API returns 403 Forbidden

**Solutions**:
1. Check the key has the required scope
2. Edit the key to add necessary permissions
3. Create a new key with broader permissions

**Example**: If you get this error when accessing recordings:
```
Error: Insufficient permissions. Required: read:recordings
```

Edit your key and add the `read:recordings` scope.

### Key Not Working After Creation

**Problem**: New key doesn't authenticate

**Solutions**:
1. Wait 5-10 seconds (propagation delay)
2. Check you copied the full key from the one-time display (not from the table view which shows masked key)
3. Verify you're using `X-API-Key` header
4. Check the key status in the manager

### "Rate Limit Exceeded" Error

**Problem**: API returns 429 Too Many Requests

**Solutions**:
1. Add delays between requests
2. Use pagination with smaller `limit` values
3. Cache results locally
4. Contact support if you need higher limits

**Example with rate limiting** (Python):
```python
import time

for room_id in room_ids:
    response = requests.get(url, headers=headers)
    # Process response...

    # Wait 1 second between requests
    time.sleep(1)
```

## Common Workflows

### Setup New Project

1. Create API key with appropriate scopes
2. Download the `.env` file template
3. Add API key to `.env` file
4. Add `.env` to `.gitignore`
5. Test API key with simple request
6. Build your integration

### Decommission Old Project

1. Verify project no longer uses the key
2. Revoke the API key
3. Remove `.env` file (if no longer needed)
4. Document that project is archived

### Key Compromise Response

If you accidentally expose your API key:

1. **Immediately revoke** the compromised key
2. **Create a new key** with same permissions
3. **Update all code** to use the new key
4. **Monitor usage** of the compromised key (check last used)
5. **Review audit logs** for suspicious activity
6. **Document the incident** for your security records

## Next Steps

Now that you have an API key, you're ready to start downloading data:

- **Learn the API**: [API Overview](./overview.md)
- **Understand endpoints**: [Data Types & Endpoints](./data-types.md)
- **Start coding**: [Python Guide](./python-guide.md) | [JavaScript Guide](./javascript-guide.md) | [R Guide](./r-guide.md)

**Remember**: Treat API keys like passwords. Keep them secret, rotate them regularly, and revoke them when no longer needed.
