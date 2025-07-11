import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://oneki.kz:8002/api';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, 'GET');
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, 'POST');
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, 'PUT');
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, 'DELETE');
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, 'PATCH');
}

async function handleRequest(request: NextRequest, params: { path: string[] }, method: string) {
  try {
    const path = params.path.join('/');
    const url = `${BACKEND_URL}/${path}`;

    // Получаем поисковые параметры из оригинального запроса
    const searchParams = request.nextUrl.searchParams;
    const finalUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

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
        console.error('Error reading request body:', error);
      }
    }

    // Логирование для отладки
    console.log(`[PROXY] ${method} ${finalUrl}`, {
      headers: Object.fromEntries(
        Object.entries(headers).filter(
          ([key]) => !key.toLowerCase().includes('authorization') || 'Bearer ***'
        )
      ),
      hasBody: !!body,
    });

    // Выполняем запрос к бэкенду
    const response = await fetch(finalUrl, {
      method,
      headers,
      body,
    });

    // Получаем ответ от бэкенда
    const responseData = await response.text();

    // Логирование ответа
    console.log(`[PROXY] Response ${response.status}`, {
      ok: response.ok,
      statusText: response.statusText,
    });

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
    console.error('[PROXY] Error:', error);

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
