import { NextRequest, NextResponse } from 'next/server';

// 用于存储连接的客户端
const clients: { controller: ReadableStreamDefaultController<string> }[] = [];

// 处理 GET 请求，返回一个 SSE 流
export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // 添加当前控制器到 clients 列表
      clients.push({ controller });

      // 监听请求的关闭信号
      req.signal.addEventListener('abort', () => {
        const index = clients.findIndex(client => client.controller === controller);
        if (index !== -1) {
          clients.splice(index, 1); // 从 clients 中移除
        }
        controller.close(); // 关闭流
      });
    },
  });

  // 返回一个 text/event-stream 的响应
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// 处理 POST 请求，发送消息给所有连接的客户端
export async function POST(req: NextRequest) {
  const { message } = await req.json(); // 解析 JSON 消息

  // 遍历所有连接的客户端并发送消息
  for (const { controller } of clients) {
    controller.enqueue(`data: ${new Date().toLocaleTimeString() + ":" + message}\n\n`); // 正确格式化消息
  }

  return NextResponse.json({ success: true });
}
