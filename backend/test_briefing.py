import requests
import json

# 브리핑 생성 테스트
print("=" * 60)
print("브리핑 생성 API 테스트")
print("=" * 60)

# Test 1: TSLA most_actives
print("\n[Test 1] TSLA - most_actives")
print("-" * 60)
response = requests.post(
    "http://localhost:8000/api/briefing/generate",
    json={"ticker": "TSLA", "type": "most_actives"}
)

if response.status_code == 200:
    data = response.json()
    print(f"✅ Status: {response.status_code}")
    print(f"Ticker: {data['ticker']}")
    print(f"Type: {data['type']}")
    print(f"Generated at: {data['generated_at']}")
    print(f"\nContent preview (first 500 chars):")
    print(data['content'][:500])
    print("...")

    # 전체 콘텐츠 저장
    with open("briefing_tsla.md", "w", encoding="utf-8") as f:
        f.write(data['content'])
    print("\n✅ Full content saved to: briefing_tsla.md")
else:
    print(f"❌ Status: {response.status_code}")
    print(f"Error: {response.json()}")

# Test 2: AAPL day_gainers
print("\n\n[Test 2] AAPL - day_gainers")
print("-" * 60)
response = requests.post(
    "http://localhost:8000/api/briefing/generate",
    json={"ticker": "AAPL", "type": "day_gainers"}
)

if response.status_code == 200:
    data = response.json()
    print(f"✅ Status: {response.status_code}")
    print(f"Ticker: {data['ticker']}")
    print(f"Type: {data['type']}")
    print(f"\nContent preview (first 300 chars):")
    print(data['content'][:300])
    print("...")
else:
    print(f"❌ Status: {response.status_code}")
    print(f"Error: {response.json()}")

# Test 3: Invalid ticker
print("\n\n[Test 3] INVALID - Error handling")
print("-" * 60)
response = requests.post(
    "http://localhost:8000/api/briefing/generate",
    json={"ticker": "INVALIDTICKER123", "type": "most_actives"}
)

print(f"Status: {response.status_code}")
if response.status_code != 200:
    print(f"✅ Expected error: {response.json()}")
else:
    print("❌ Should have returned an error")

print("\n" + "=" * 60)
print("테스트 완료")
print("=" * 60)
