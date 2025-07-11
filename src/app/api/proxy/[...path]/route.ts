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
    // Добавляем завершающий слеш для всех путей (требует Django)
    const url = `${BACKEND_URL}/${path}/`;

    // Получаем поисковые параметры из оригинального запроса
    const searchParams = request.nextUrl.searchParams;
    const finalUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

    // Базовое логирование запросов
    console.log(`[PROXY] ${method} ${finalUrl}`);

    // Подготавливаем заголовки
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // Копируем важные заголовки из оригинального запроса
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Получаем body для POST/PUT/PATCH запросов
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        body = await request.text();
      } catch (error) {
        console.error(`[PROXY] Error reading request body:`, error);
      }
    }

    // Логирование отправки запроса
    console.log(`[PROXY] → ${method} ${finalUrl}`);

    // Выполняем запрос к бэкенду
    const response = await fetch(finalUrl, {
      method,
      headers,
      body,
    });

    // Получаем ответ от бэкенда
    const responseData = await response.text();

    // Логирование ответа
    console.log(`[PROXY] ← ${response.status} ${response.statusText}`);

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
    console.error('[PROXY] Error:', error instanceof Error ? error.message : 'Unknown error');

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
