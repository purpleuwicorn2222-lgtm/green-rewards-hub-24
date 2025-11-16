#!/bin/bash
# Script to push changes after Xcode tools installation

cd "/Users/zora/eco shopping"

echo "Checking git status..."
git status

echo ""
echo "Adding all changes..."
git add .

echo ""
echo "Committing changes..."
git commit -m "Add real-time product search and shopping cart functionality

- Implement product search service with Google Custom Search API support
- Add SearchResults page to display 10 eco-friendly products
- Create CartContext for centralized cart state management
- Update ShoppingList page with full cart functionality (quantity, delete, clear)
- Update SearchBar to navigate to search results
- Integrate cart across all product pages"

echo ""
echo "Checking for remote repository..."
if git remote -v | grep -q .; then
    echo "Remote found. Pushing changes..."
    git push
else
    echo "No remote repository configured."
    echo "To add a remote, run:"
    echo "  git remote add origin <your-repo-url>"
    echo "  git branch -M main"
    echo "  git push -u origin main"
fi

