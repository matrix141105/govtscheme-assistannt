from googlesearch import search
import time

def google_search(query, max_results=3):
    print(f"DEBUG: Google Searching for: {query}")
    results = []
    try:
        # Search returns URLs
        urls = list(search(query, num_results=max_results, advanced=True))
        for i, res in enumerate(urls, 1):
            results.append(f"{i}. {res.title}\n   Snippet: {res.description}\n   Source: {res.url}\n")
    except Exception as e:
        print(f"Google Search Error: {e}")
        return "Error performing Google Search."
    
    if not results:
        return "No Google results found."
    
    return "\n".join(results)

if __name__ == "__main__":
    print(google_search("latest government welfare schemes in Tamil Nadu 2025"))
