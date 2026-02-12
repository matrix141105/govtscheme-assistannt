from duckduckgo_search import DDGS

def get_state_schemes(state_name: str) -> str:
    """
    Search for the latest government welfare schemes in the given state for 2025.
    Returns: A string containing the titles and snippets of the top search results.
    """
    if not state_name or state_name == "All India":
        query = "latest government welfare schemes in India list 2025"
    else:
        query = f"latest government welfare schemes in {state_name} list 2025"

    return search_web(query)

def search_specific(query: str) -> str:
    """
    Search for specific user queries.
    Returns: A string containing the titles and snippets of the top search results.
    """
    return search_web(query)

def search_web(query: str, max_results: int = 5) -> str:
    """
    Helper function to perform web search using DuckDuckGo.
    """
    print(f"DEBUG: Searching web for: {query}")
    results = []
    
    # Try standard text search
    try:
        with DDGS() as ddgs:
            ddgs_gen = ddgs.text(query, max_results=max_results)
            for r in ddgs_gen:
                results.append(r)
    except Exception as e:
        print(f"Text search failed: {e}")

    # Fallback to news search if text search yields no results
    if not results:
        print("DEBUG: Text search empty, falling back to news search...")
        try:
            with DDGS() as ddgs:
                ddgs_gen = ddgs.news(query, max_results=max_results)
                for r in ddgs_gen:
                    results.append(r)
        except Exception as e:
            print(f"News search failed: {e}")

    if not results:
        return "No web search results found."

    formatted_results = ""
    for i, res in enumerate(results, 1):
        title = res.get('title', 'No Title')
        body = res.get('body', res.get('snippet', 'No details available'))
        url = res.get('href', res.get('url', 'No link'))
        formatted_results += f"{i}. {title}\n   Snippet: {body}\n   Source: {url}\n\n"
    
    return formatted_results


