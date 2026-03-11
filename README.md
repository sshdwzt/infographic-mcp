# Infographic MCP Server

A Python MCP server that lets AI assistants search for infographic images using the [Serper API](https://serper.dev). Find data visualizations, statistical graphics, and visual explainers — with smart filters optimized for infographic content.

## Features

- **`search_infographics`** — Find web pages, articles, and galleries featuring infographics
- **`search_infographic_images`** — Search for infographic images with size and aspect ratio filters
- **`search_infographics_by_source`** — Target specific platforms like Visual Capitalist, Behance, or Dribbble
- Automatic "infographic" context injection on all queries
- Large image + tall aspect ratio filters by default (how most infographics are shaped)
- SSE transport for real-time MCP client communication

## Quick Start

### 1. Install dependencies

```bash
pip install mcp httpx
```

### 2. Set your API key

Get a free key at [serper.dev](https://serper.dev), then set it as an environment variable:

```bash
export SERPER_API_KEY="your-api-key-here"
```

### 3. Run the server

```bash
python server.py
```

The server starts on `http://0.0.0.0:8000` with the SSE endpoint at `/sse`.

### 4. Connect your MCP client

Point your MCP client (e.g. Claude Desktop) to:

```
http://<your-server-address>:8000/sse
```

## Tools

### `search_infographics`

Search for infographic-related web pages and articles.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | required | Topic to find infographics about |
| `num_results` | integer | 10 | Number of results (1–20) |

Example queries: `"climate change"`, `"social media marketing stats"`, `"coffee production worldwide"`

### `search_infographic_images`

Search for infographic images with optimized size and aspect ratio filters.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | required | Topic to find infographic images for |
| `num_results` | integer | 10 | Number of results (1–20) |
| `aspect_ratio` | string | `"tall"` | Image shape: `"tall"`, `"wide"`, `"square"`, or `"panoramic"` |

Example queries: `"nutrition facts"`, `"startup funding process"`, `"global warming statistics"`

### `search_infographics_by_source`

Search for infographics from a specific curated platform.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | required | Topic to search for |
| `source` | string | required | Platform name (see list below) |
| `num_results` | integer | 10 | Number of results (1–20) |

**Supported sources:** `visual capitalist`, `behance`, `dribbble`, `information is beautiful`, `cool infographics`, `venngage`, `canva`, `statista`, `pinterest`, `visme`

Example: search for `"economy"` on `"visual capitalist"`

## Project Structure

```
server.py        # MCP server — tool definitions and Serper API integration
config.py        # Configuration — API keys, filters, curated sources
pyproject.toml   # Project metadata and dependencies
```

## Configuration

All settings live in `config.py`:

| Variable | Default | Description |
|----------|---------|-------------|
| `SERPER_API_KEY` | from env | Your Serper API key |
| `SERPER_SEARCH_URL` | `https://google.serper.dev/search` | Web search endpoint |
| `SERPER_IMAGES_URL` | `https://google.serper.dev/images` | Image search endpoint |
| `DEFAULT_NUM_RESULTS` | `10` | Results per query |
| `DEFAULT_IMAGE_SIZE` | `"l"` (large) | Image size filter |
| `DEFAULT_ASPECT_RATIO` | `"t"` (tall) | Default aspect ratio for infographics |
| `INFOGRAPHIC_SOURCES` | dict | Curated source name → domain mapping |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `SERPER_API_KEY is not set` | Set the environment variable or add it to `.env` |
| `API Error: status 401` | Invalid API key — verify it at [serper.dev](https://serper.dev) |
| `API Error: status 429` | Rate limit hit — wait and retry |
| `Network Error` | Check your internet connection |

## Resources

- [MCP Protocol Docs](https://modelcontextprotocol.io/)
- [Serper API Docs](https://serper.dev/docs)
- [httpx Docs](https://www.python-httpx.org/)
