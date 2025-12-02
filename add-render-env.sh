#!/bin/bash

# Script to add APP_URL environment variable to Render service
# Usage: ./add-render-env.sh

echo "🔧 Adding APP_URL to Render service..."
echo ""
echo "📝 Environment Variable:"
echo "   Key: APP_URL"
echo "   Value: https://white-shop-web-dhzt.vercel.app"
echo ""
echo "⚠️  Note: This script requires Render API access."
echo "   If you don't have API access, add it manually in Render Dashboard:"
echo "   1. Go to https://dashboard.render.com"
echo "   2. Select your backend service"
echo "   3. Go to Environment tab"
echo "   4. Add APP_URL = https://white-shop-web-dhzt.vercel.app"
echo "   5. Save Changes"
echo ""
echo "✅ The render.yaml file is already configured with APP_URL."
echo "   If you're using Render Blueprint, it will be added automatically."
echo ""

