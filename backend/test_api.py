import requests
import json

# Test 1: count=2
print("Test 1: count=2")
response = requests.get("http://localhost:8000/api/stocks/trending/top?type=most_actives&count=2")
data = response.json()
print(f"Total stocks: {len(data)}")
for item in data:
    print(f"  {item['rank']}. {item['quote']['info']['symbol']} - ${item['quote']['price']['current_price']}")
print()

# Test 2: count=7
print("Test 2: count=7")
response = requests.get("http://localhost:8000/api/stocks/trending/top?type=most_actives&count=7")
data = response.json()
print(f"Total stocks: {len(data)}")
for item in data:
    print(f"  {item['rank']}. {item['quote']['info']['symbol']} - ${item['quote']['price']['current_price']}")
print()

# Test 3: default (should be 5)
print("Test 3: default (no count parameter)")
response = requests.get("http://localhost:8000/api/stocks/trending/top?type=most_actives")
data = response.json()
print(f"Total stocks: {len(data)}")
for item in data:
    print(f"  {item['rank']}. {item['quote']['info']['symbol']} - ${item['quote']['price']['current_price']}")
