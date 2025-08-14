#!/usr/bin/env python3
"""
Test script for analytics functionality
"""

import sys
import os
sys.path.append('api')

from analytics import handle_analytics_request, get_analytics_data

def test_analytics():
    """Test the analytics functionality"""
    print("🧪 Testing Analytics API...")
    print("=" * 50)
    
    # Test 1: Basic analytics endpoint
    print("\n1. Testing /analytics GET endpoint:")
    result = handle_analytics_request("/analytics", "GET")
    print(f"Status: {result.get('status')}")
    print(f"Message: {result.get('message')}")
    if result.get('status') == 'success':
        print("✅ Basic analytics endpoint working!")
    else:
        print("❌ Basic analytics endpoint failed!")
        print(f"Error: {result.get('message')}")
    
    # Test 2: Analytics categories endpoint
    print("\n2. Testing /analytics/categories endpoint:")
    result = handle_analytics_request("/analytics/categories", "GET")
    print(f"Status: {result.get('status')}")
    print(f"Message: {result.get('message')}")
    if result.get('status') == 'success':
        print("✅ Categories endpoint working!")
        categories = result.get('data', [])
        print(f"Found {len(categories)} categories")
    else:
        print("❌ Categories endpoint failed!")
        print(f"Error: {result.get('message')}")
    
    # Test 3: Analytics sources endpoint
    print("\n3. Testing /analytics/sources endpoint:")
    result = handle_analytics_request("/analytics/sources", "GET")
    print(f"Status: {result.get('status')}")
    print(f"Message: {result.get('message')}")
    if result.get('status') == 'success':
        print("✅ Sources endpoint working!")
        sources = result.get('data', [])
        print(f"Found {len(sources)} sources")
    else:
        print("❌ Sources endpoint failed!")
        print(f"Error: {result.get('message')}")
    
    # Test 4: Direct function call
    print("\n4. Testing direct get_analytics_data function:")
    result = get_analytics_data()
    print(f"Status: {result.get('status')}")
    if result.get('status') == 'success':
        print("✅ Direct function call working!")
        data = result.get('data', {})
        summary = data.get('summary', {})
        print(f"Total documents: {summary.get('total_documents')}")
        print(f"Success rate: {summary.get('success_rate')}%")
    else:
        print("❌ Direct function call failed!")
        print(f"Error: {result.get('message')}")
    
    print("\n" + "=" * 50)
    print("🎉 Analytics API testing completed!")

if __name__ == "__main__":
    test_analytics()