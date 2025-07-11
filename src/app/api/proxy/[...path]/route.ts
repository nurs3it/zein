import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://oneki.kz:8002/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params, 'PATCH');
}

async function handleRequest(request: NextRequest, params: { path: string[] }, method: string) {
  try {
    const path = params.path.join('/');
    const url = `${BACKEND_URL}/${path}`;

    // Получаем поисковые параметры из оригинального запроса
    const searchParams = request.nextUrl.searchParams;
    const finalUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

    // Подробное логирование входящего запроса
    console.log(`[PROXY] ===== INCOMING REQUEST =====`);
    console.log(`[PROXY] Method: ${method}`);
    console.log(`[PROXY] Path: ${path}`);
    console.log(`[PROXY] Final URL: ${finalUrl}`);
    console.log(`[PROXY] Original Request URL: ${request.url}`);
    console.log(`[PROXY] Request headers:`, {
      'content-type': request.headers.get('content-type'),
      authorization: request.headers.get('authorization') ? 'Bearer ***' : 'none',
      'user-agent': request.headers.get('user-agent'),
    });

    // Подготавливаем заголовки
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // Копируем важные заголовки из оригинального запроса
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
      console.log(`[PROXY] Auth header found: Bearer ***`);
    }

    // Получаем body для POST/PUT/PATCH запросов
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        body = await request.text();
        console.log(`[PROXY] Request body length: ${body?.length || 0}`);
        console.log(`[PROXY] Request body preview: ${body?.substring(0, 100) || 'empty'}`);
      } catch (error) {
        console.error(`[PROXY] Error reading request body:`, error);
      }
    }

    // Логирование финальных параметров запроса
    console.log(`[PROXY] ===== SENDING TO BACKEND =====`);
    console.log(`[PROXY] Backend URL: ${finalUrl}`);
    console.log(`[PROXY] Method: ${method}`);
    console.log(`[PROXY] Headers:`, {
      ...Object.fromEntries(
        Object.entries(headers).filter(([key]) => !key.toLowerCase().includes('authorization'))
      ),
      Authorization: authHeader ? 'Bearer ***' : 'none',
    });

    // Выполняем запрос к бэкенду
    const response = await fetch(finalUrl, {
      method,
      headers,
      body,
    });

    // Получаем ответ от бэкенда
    const responseData = await response.text();

    // Подробное логирование ответа
    console.log(`[PROXY] ===== BACKEND RESPONSE =====`);
    console.log(`[PROXY] Status: ${response.status} ${response.statusText}`);
    console.log(`[PROXY] Response OK: ${response.ok}`);
    console.log(`[PROXY] Response headers:`, {
      'content-type': response.headers.get('content-type'),
      'content-length': response.headers.get('content-length'),
    });
    console.log(`[PROXY] Response body preview: ${responseData?.substring(0, 200) || 'empty'}`);

    // Возвращаем ответ клиенту
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        // Добавляем CORS заголовки
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('[PROXY] ===== ERROR =====');
    console.error('[PROXY] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: 'Proxy error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Обработка preflight OPTIONS запросов
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
