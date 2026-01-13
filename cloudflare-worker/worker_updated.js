/**
 * Cloudflare Worker for Mark2Web - Updated to handle both chat and models endpoints
 *
 * This worker provides CORS proxy for Xiaomi Mimo API and other OpenAI-compatible APIs
 *
 * Usage:
 * 1. Deploy this worker to Cloudflare
 * 2. Set the worker URL as proxyUrl in Mark2Web settings
 * 3. All requests will be routed through this worker
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing Authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const url = new URL(request.url)

    // Route to different endpoints based on the path
    let apiUrl
    let requestBody

    if (url.pathname.includes('/models')) {
      // Model fetching endpoint
      apiUrl = 'https://api.xiaomimimo.com/v1/models'

      // For models, we use GET method
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
        },
      })

      const responseData = await apiResponse.json()
      return new Response(JSON.stringify(responseData), {
        status: apiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    } else {
      // Chat completion endpoint (default)
      apiUrl = 'https://api.xiaomimimo.com/v1/chat/completions'
      requestBody = await request.json()

      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(requestBody)
      })

      // Handle streaming responses
      if (requestBody.stream) {
        const reader = apiResponse.body.getReader()
        const encoder = new TextEncoder()

        const stream = new ReadableStream({
          async start(controller) {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              controller.enqueue(value)
            }
            controller.close()
          }
        })

        return new Response(stream, {
          status: apiResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' }
        })
      } else {
        const responseData = await apiResponse.json()
        return new Response(JSON.stringify(responseData), {
          status: apiResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Proxy error',
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
