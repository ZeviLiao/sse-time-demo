import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 创建一个可读流
  const stream = new ReadableStream({
    start(controller) {
      // 每秒发送一次当前时间
      const intervalId = setInterval(() => {
        const currentTime = new Date().toLocaleTimeString();
        const data = `data: ${currentTime}\n\n`; // SSE 数据格式
        controller.enqueue(new TextEncoder().encode(data)); // 推送数据
      }, 1000);

      // 监听请求的关闭信号
      req.signal.addEventListener('abort', () => {
        clearInterval(intervalId); // 清理定时器
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
