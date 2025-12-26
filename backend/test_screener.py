from yahooquery import Screener

s = Screener()
data = s.get_screeners('most_actives', count=5)
quotes = data.get('most_actives', {}).get('quotes', [])

print(f"Total quotes: {len(quotes)}\n")

for i, q in enumerate(quotes, 1):
    symbol = q.get('symbol')
    name = q.get('shortName')
    price = q.get('regularMarketPrice')
    change_percent = q.get('regularMarketChangePercent')
    volume = q.get('regularMarketVolume')

    print(f"{i}. {symbol}")
    print(f"   Name: {name}")
    print(f"   Price: ${price}")
    print(f"   Change: {change_percent:.2f}%")
    print(f"   Volume: {volume:,}")
    print()
