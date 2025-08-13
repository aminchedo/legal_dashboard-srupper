#!/bin/bash

# Script to fix missing icon imports across the frontend

echo "Fixing missing icon imports..."

# Add missing imports to various files
files=(
    "src/components/Proxies/ProxyPage.tsx:Search,Plus,Upload,RefreshCw,Download"
    "src/components/Proxies/ProxyForm.tsx:X"
    "src/components/Proxies/ProxyAnalyticsPanel.tsx:BarChart3"
    "src/components/Proxies/ProxyRotationPanel.tsx:RotateCw"
    "src/components/Proxies/ProxyTestingPanel.tsx:Activity,Loader2"
    "src/pages/Proxies/ProxiesPage.tsx:Search,Plus,Upload,RefreshCw,Download"
    "src/pages/Proxies/components/ProxyForm.tsx:X"
    "src/pages/Proxies/components/ProxyDetailsView.tsx:BarChart3"
    "src/pages/Proxies/components/ProxyRotationPanel.tsx:RotateCw"
    "src/pages/Proxies/components/ProxyHealthIndicator.tsx:Activity,Loader2"
)

for file_icons in "${files[@]}"; do
    IFS=':' read -r file icons <<< "$file_icons"
    echo "Processing $file with icons: $icons"
    
    # Check if file exists
    if [[ -f "$file" ]]; then
        # Check if import line exists
        if grep -q "from.*utils/iconRegistry" "$file"; then
            echo "  Import already exists, updating..."
            # Add icons to existing import
            sed -i "s/from '.*utils\/iconRegistry';/, $icons } from '..\/..\/utils\/iconRegistry';/" "$file"
        else
            echo "  Adding new import..."
            # Add new import after existing imports
            sed -i "/from '@ant-design\/icons';/a import { $icons } from '../../utils/iconRegistry';" "$file"
        fi
    else
        echo "  File not found: $file"
    fi
done

echo "Import fixes completed!"