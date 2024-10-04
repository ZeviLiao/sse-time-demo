'use client'; // 使页面为客户端组件

import { useEffect, useState } from 'react';

const Home = () => {
  const [currentTime, setCurrentTime] = useState('Loading...');

  useEffect(() => {
    // 连接到 SSE API
    const eventSource = new EventSource('/api/time');

    // 监听消息事件
    eventSource.onmessage = (event) => {
      setCurrentTime(event.data); // 更新页面显示的时间
    };

    // 错误处理
    eventSource.onerror = (error) => {
      console.error('SSE 错误:', error);
      eventSource.close(); // 关闭连接
    };

    // 组件卸载时关闭连接
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Server-Sent Events with Next.js (App Router)</h1>
      <p>当前时间：{currentTime}</p>
    </div>
  );
};

export default Home;
