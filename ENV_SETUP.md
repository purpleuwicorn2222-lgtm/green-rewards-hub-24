# Environment Variables Setup Guide

## Quick Setup

To fix the "Google Custom Search API is not configured" error, you need to create a `.env` file in the project root with your API credentials.

## Step-by-Step Instructions

### 1. Get Google Custom Search API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Custom Search API":
   - Go to "APIs & Services" > "Library"
   - Search for "Custom Search API"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key (you'll need it in step 3)

### 2. Create a Custom Search Engine

1. Go to [Google Custom Search Engine](https://cse.google.com/cse/)
2. Click "Add" to create a new search engine
3. Configure the search engine:
   - **Sites to search**: Enter `*` (asterisk) to search the entire web
   - **Name**: Give it a name (e.g., "Eco Products Search")
   - Click "Create"
4. Get your Search Engine ID:
   - Go to "Setup" > "Basics"
   - Find "Search engine ID" (also called "CX")
   - Copy this ID (you'll need it in step 3)

### 3. Create the `.env` File

Create a file named `.env` in the root directory of your project with the following content:

```env
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_CSE_ID=your_search_engine_id_here
```

**Replace the placeholder values:**
- Replace `your_google_api_key_here` with the API key from Step 1
- Replace `your_search_engine_id_here` with the Search Engine ID from Step 2

### 4. Restart Your Development Server

After creating the `.env` file:
1. Stop your development server (if running)
2. Start it again:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

The environment variables are loaded when the server starts, so you need to restart it.

## Example `.env` File

```env
VITE_GOOGLE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_GOOGLE_CSE_ID=012345678901234567890:abcdefghijk
```

## Security Note

⚠️ **Important**: The `.env` file is already in `.gitignore` and will NOT be committed to git. Never share your API keys publicly.

## Troubleshooting

### "API key not valid" error
- Make sure you've enabled the Custom Search API in Google Cloud Console
- Verify the API key is correct (no extra spaces or characters)
- Check that billing is enabled (Google requires billing for Custom Search API)

### "Search engine ID not found" error
- Verify the Search Engine ID (CX) is correct
- Make sure the search engine is set to search the entire web (`*`)

### Still seeing the error after setup
- Make sure the `.env` file is in the project root (same directory as `package.json`)
- Restart your development server
- Check that variable names start with `VITE_` (required for Vite)

## Need Help?

If you're still having issues:
1. Check the [PRODUCT_SEARCH_SETUP.md](./PRODUCT_SEARCH_SETUP.md) for more details
2. Verify your API credentials in Google Cloud Console
3. Make sure your Custom Search Engine is configured to search the entire web

