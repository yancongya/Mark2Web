// Cloudflare Worker - Fixed version for Mark2Web
// Supports: Chat streaming, Model fetching, GET/POST methods

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // CORS configuration
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    // Validate Authorization
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: 'Missing Authorization',
        message: 'Format: Authorization: Bearer YOUR_API_KEY'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const url = new URL(request.url)

    // Route based on path
    if (url.pathname.includes('/models')) {
      // === MODEL FETCHING (GET) ===
      const apiUrl = 'https://api.xiaomimimo.com/v1/models'

      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'User-Agent': 'Mark2Web-Proxy/1.0'
        }
      })

      const responseData = await apiResponse.json()

      return new Response(JSON.stringify(responseData), {
        status: apiResponse.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-Proxy-By': 'Cloudflare-Worker'
        }
      })

    } else {
      // === CHAT COMPLETIONS (POST + Streaming) ===
      const requestBody = await request.json()
      const apiUrl = 'https://api.xiaomimimo.com/v1/chat/completions'

      // Check if streaming is requested
      const isStreaming = requestBody.stream === true

      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'User-Agent': 'Mark2Web-Proxy/1.0'
        },
        body: JSON.stringify(requestBody)
      })

      if (isStreaming) {
        // === STREAMING RESPONSE ===
        const reader = apiResponse.body.getReader()

        const stream = new ReadableStream({
          async start(controller) {
            try {
              while (true) {
                const { done, value } = await reader.read()
                if (done) break
                controller.enqueue(value)
              }
              controller.close()
            } catch (error) {
              controller.error(error)
            }
          }
        })

        return new Response(stream, {
          status: apiResponse.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Proxy-By': 'Cloudflare-Worker'
          }
        })

      } else {
        // === NON-STREAMING RESPONSE ===
        const responseData = await apiResponse.json()

        return new Response(JSON.stringify(responseData), {
          status: apiResponse.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-Proxy-By': 'Cloudflare-Worker'
          }
        })
      }
    }

  } catch (error) {
    console.error('Worker Error:', error)

    return new Response(JSON.stringify({
      error: 'Proxy Service Error',
      message: error.message,
      tip: 'Check API key, network connection, or worker logs'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}
