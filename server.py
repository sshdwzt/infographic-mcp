"""
Infographic MCP Server
=======================
This is the main file that runs our MCP (Model Context Protocol) server.

What is MCP?
    MCP is a protocol that lets AI assistants (like Claude) use external tools.
    Think of it like giving an AI the ability to search the web, query databases,
    or — in our case — fetch infographic images from the internet.

What does this server do?
    It provides tools for finding infographic images and resources using the
    Serper API (a Google Search API). Every search is automatically scoped
    to return infographic-specific results by injecting the right context
    and filters into the queries.

How does it work?
    1. An AI assistant connects to this server via the MCP protocol
    2. The assistant calls one of our infographic tools with a search query
    3. We enhance the query with infographic context and optimal filters
    4. We send that query to the Serper API
    5. We format the results and send them back to the assistant

Key Python concepts used:
    - async/await: For handling network requests without blocking
    - Decorators (@): Special syntax to register functions with the MCP framework
    - Type hints (str, int): Labels that describe what type of data a variable holds
    - Environment variables: Secure way to store sensitive data like API keys
"""

import os
import json
import logging

import httpx
from mcp.server.fastmcp import FastMCP

from config import (
    SERPER_API_KEY,
    SERPER_SEARCH_URL,
    SERPER_IMAGES_URL,
    DEFAULT_NUM_RESULTS,
    DEFAULT_IMAGE_SIZE,
    DEFAULT_ASPECT_RATIO,
    INFOGRAPHIC_SOURCES,
    SERVER_NAME,
    SERVER_HOST,
    SERVER_PORT,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(SERVER_NAME)

mcp = FastMCP(SERVER_NAME)

ASPECT_RATIO_MAP: dict[str, str] = {
    "tall": "t",
    "wide": "w",
    "square": "s",
    "panoramic": "xw",
}


def _check_api_key() -> str | None:
    """
    Return an error message if the API key is missing, or None if it's set.
    """
    if not SERPER_API_KEY:
        return (
            "Configuration Error: SERPER_API_KEY is not set. "
            "Please add it to your environment variables or .env file. "
            "Get your key at https://serper.dev"
        )
    return None


def _build_headers() -> dict[str, str]:
    """
    Build the HTTP headers required for Serper API requests.
    """
    return {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
    }


def format_web_results(raw_results: dict) -> str:
    """
    Convert raw Serper web search results into a clean, readable string.

    Parameters:
        raw_results (dict): The JSON response from the Serper API

    Returns:
        str: A formatted string with numbered results
    """
    output_parts = []

    organic = raw_results.get("organic", [])
    if organic:
        output_parts.append("=== Infographic Web Results ===\n")
        for i, result in enumerate(organic, start=1):
            title = result.get("title", "No title")
            link = result.get("link", "No link")
            snippet = result.get("snippet", "No description available")
            output_parts.append(
                f"{i}. {title}\n"
                f"   URL: {link}\n"
                f"   Description: {snippet}\n"
            )

    images = raw_results.get("images", [])
    if images:
        output_parts.append("\n=== Related Infographic Images ===\n")
        for i, img in enumerate(images, start=1):
            title = img.get("title", "No title")
            link = img.get("link", "No link")
            image_url = img.get("imageUrl", "No image URL")
            output_parts.append(
                f"{i}. {title}\n"
                f"   Page: {link}\n"
                f"   Image: {image_url}\n"
            )

    if not output_parts:
        return "No infographic results found. Try different search terms."

    return "\n".join(output_parts)


def format_image_results(images: list[dict], query: str) -> str:
    """
    Convert raw Serper image results into a clean, readable string.

    Parameters:
        images (list): List of image result dictionaries from the Serper API
        query (str): The original search query (used in the header)

    Returns:
        str: A formatted string with numbered image results
    """
    if not images:
        return "No infographic images found. Try different search terms."

    output_parts = [f"=== Infographic Image Results for '{query}' ===\n"]
    for i, img in enumerate(images, start=1):
        title = img.get("title", "No title")
        link = img.get("link", "No link")
        image_url = img.get("imageUrl", "No image URL")
        source = img.get("source", "Unknown source")
        width = img.get("imageWidth", "?")
        height = img.get("imageHeight", "?")
        output_parts.append(
            f"{i}. {title}\n"
            f"   Source: {source}\n"
            f"   Page: {link}\n"
            f"   Image: {image_url}\n"
            f"   Dimensions: {width}x{height}\n"
        )

    return "\n".join(output_parts)


@mcp.tool()
async def search_infographics(
    query: str,
    num_results: int = DEFAULT_NUM_RESULTS,
) -> str:
    """
    Search for infographic-related web pages, articles, and galleries.

    This tool searches the web for pages that feature infographics on
    your topic. It automatically adds "infographic" context to your
    query so results are always infographic-focused.

    Args:
        query: The topic you want infographics about.
               Examples: "climate change", "social media marketing stats",
               "history of the internet", "coffee production worldwide"
        num_results: Number of results to return (1-20, default 10)

    Returns:
        Formatted web results with titles, URLs, and descriptions.
    """
    logger.info("Searching for infographics: '%s' (num_results=%d)", query, num_results)

    error = _check_api_key()
    if error:
        return error

    num_results = max(1, min(20, num_results))
    infographic_query = f"{query} infographic"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                SERPER_SEARCH_URL,
                headers=_build_headers(),
                json={"q": infographic_query, "num": num_results},
                timeout=30.0,
            )
            response.raise_for_status()
            raw_results = response.json()

        formatted = format_web_results(raw_results)
        logger.info("Successfully fetched %d results", len(raw_results.get("organic", [])))
        return formatted

    except httpx.HTTPStatusError as e:
        logger.error("Serper API error: %s", e)
        return f"API Error: The Serper API returned status {e.response.status_code}. Please check your API key."

    except httpx.RequestError as e:
        logger.error("Network error: %s", e)
        return f"Network Error: Could not connect to the Serper API. Details: {e}"

    except Exception as e:
        logger.error("Unexpected error: %s", e)
        return f"Unexpected Error: {e}"


@mcp.tool()
async def search_infographic_images(
    query: str,
    num_results: int = DEFAULT_NUM_RESULTS,
    aspect_ratio: str = "tall",
) -> str:
    """
    Search specifically for infographic images with optimized filters.

    This tool uses Serper's image search with filters tuned for
    infographics: large image size and vertical (tall) aspect ratio by
    default, since most infographics are tall. You can switch to "wide"
    for timeline-style or horizontal infographics.

    Args:
        query: The topic you want infographic images for.
               Examples: "data visualization trends", "nutrition facts",
               "startup funding process", "global warming statistics"
        num_results: Number of image results to return (1-20, default 10)
        aspect_ratio: Image shape — "tall" (default, vertical infographics),
                      "wide" (horizontal/timeline), "square", or "panoramic"

    Returns:
        Formatted image results with titles, URLs, sources, and dimensions.
    """
    logger.info(
        "Searching for infographic images: '%s' (num_results=%d, aspect=%s)",
        query, num_results, aspect_ratio,
    )

    error = _check_api_key()
    if error:
        return error

    num_results = max(1, min(20, num_results))
    ar_code = ASPECT_RATIO_MAP.get(aspect_ratio.lower(), DEFAULT_ASPECT_RATIO)
    infographic_query = f"{query} infographic"

    payload: dict = {
        "q": infographic_query,
        "num": num_results,
        "tbs": f"isz:{DEFAULT_IMAGE_SIZE}",
        "imgar": ar_code,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                SERPER_IMAGES_URL,
                headers=_build_headers(),
                json=payload,
                timeout=30.0,
            )
            response.raise_for_status()
            data = response.json()

        images = data.get("images", [])
        formatted = format_image_results(images, query)
        logger.info("Successfully fetched %d image results", len(images))
        return formatted

    except httpx.HTTPStatusError as e:
        logger.error("Serper API error: %s", e)
        return f"API Error: The Serper API returned status {e.response.status_code}."

    except httpx.RequestError as e:
        logger.error("Network error: %s", e)
        return f"Network Error: Could not connect to the Serper API. Details: {e}"

    except Exception as e:
        logger.error("Unexpected error: %s", e)
        return f"Unexpected Error: {e}"


@mcp.tool()
async def search_infographics_by_source(
    query: str,
    source: str,
    num_results: int = DEFAULT_NUM_RESULTS,
) -> str:
    """
    Search for infographic images from a specific curated source.

    This tool targets well-known infographic publishers using Google's
    site: operator. Great for finding high-quality infographics from
    trusted platforms.

    Supported sources:
        "visual capitalist", "behance", "dribbble",
        "information is beautiful", "cool infographics", "venngage",
        "canva", "statista", "pinterest", "visme"

    Args:
        query: The topic you want infographics about.
               Examples: "economy", "AI trends", "health statistics"
        source: The platform to search on — one of the supported sources
                listed above. If unrecognized, searches all sites instead.
        num_results: Number of image results to return (1-20, default 10)

    Returns:
        Formatted image results from the specified source.
    """
    source_lower = source.lower().strip()
    domain = INFOGRAPHIC_SOURCES.get(source_lower)

    if domain:
        site_query = f"site:{domain} {query} infographic"
        source_label = source.title()
        logger.info("Searching %s for infographics: '%s'", source_label, query)
    else:
        available = ", ".join(sorted(INFOGRAPHIC_SOURCES.keys()))
        site_query = f"{query} infographic"
        source_label = "all sources"
        logger.warning(
            "Unknown source '%s'. Searching all sources. Available: %s",
            source, available,
        )

    error = _check_api_key()
    if error:
        return error

    num_results = max(1, min(20, num_results))

    payload: dict = {
        "q": site_query,
        "num": num_results,
        "tbs": f"isz:{DEFAULT_IMAGE_SIZE}",
        "imgar": DEFAULT_ASPECT_RATIO,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                SERPER_IMAGES_URL,
                headers=_build_headers(),
                json=payload,
                timeout=30.0,
            )
            response.raise_for_status()
            data = response.json()

        images = data.get("images", [])

        if not images:
            if domain:
                return (
                    f"No infographic images found on {source_label} for '{query}'. "
                    f"Try a broader topic or search all sources with search_infographic_images."
                )
            return "No infographic images found. Try different search terms."

        header = f"=== Infographic Images from {source_label} for '{query}' ===\n"
        output_parts = [header]
        for i, img in enumerate(images, start=1):
            title = img.get("title", "No title")
            link = img.get("link", "No link")
            image_url = img.get("imageUrl", "No image URL")
            img_source = img.get("source", "Unknown source")
            width = img.get("imageWidth", "?")
            height = img.get("imageHeight", "?")
            output_parts.append(
                f"{i}. {title}\n"
                f"   Source: {img_source}\n"
                f"   Page: {link}\n"
                f"   Image: {image_url}\n"
                f"   Dimensions: {width}x{height}\n"
            )

        if not domain:
            output_parts.append(
                f"\nNote: Source '{source}' was not recognized. "
                f"Showing results from all sources. "
                f"Available sources: {', '.join(sorted(INFOGRAPHIC_SOURCES.keys()))}"
            )

        return "\n".join(output_parts)

    except httpx.HTTPStatusError as e:
        logger.error("Serper API error: %s", e)
        return f"API Error: The Serper API returned status {e.response.status_code}."

    except httpx.RequestError as e:
        logger.error("Network error: %s", e)
        return f"Network Error: Could not connect to the Serper API. Details: {e}"

    except Exception as e:
        logger.error("Unexpected error: %s", e)
        return f"Unexpected Error: {e}"


if __name__ == "__main__":
    logger.info("Starting %s on %s:%d", SERVER_NAME, SERVER_HOST, SERVER_PORT)
    logger.info("Transport: SSE (Server-Sent Events)")
    logger.info("Connect your MCP client to http://%s:%d/sse", SERVER_HOST, SERVER_PORT)

    mcp.settings.host = SERVER_HOST
    mcp.settings.port = SERVER_PORT
    mcp.run(transport="sse")
