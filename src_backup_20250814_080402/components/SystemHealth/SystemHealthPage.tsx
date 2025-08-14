import React, { useState, useEffect } from 'react';
import { SystemHealthPageOrg } from '../../../components/ui/organisms';

export default function SystemHealthPage() {
  const [metrics, setMetrics] = useState({
    cpu: { usage: 45, status: 'normal' },
    memory: { usage: 68, status: 'normal' },
    disk: { usage: 34, status: 'good' },
    network: { latency: 12, status: 'excellent' }
  });

  const [services] = useState([
    { name: 'API Server', status: 'online' as const, uptime: '99.9%', lastCheck: '2 دقیقه پیش' },
    { name: 'Database', status: 'online' as const, uptime: '99.8%', lastCheck: '1 دقیقه پیش' },
    { name: 'Cache Server', status: 'warning' as const, uptime: '95.2%', lastCheck: '5 دقیقه پیش' },
    { name: 'File Storage', status: 'online' as const, uptime: '99.9%', lastCheck: '1 دقیقه پیش' },
    { name: 'Message Queue', status: 'online' as const, uptime: '99.5%', lastCheck: '3 دقیقه پیش' },
    { name: 'Search Engine', status: 'online' as const, uptime: '98.9%', lastCheck: '1 دقیقه پیش' }
  ]);

  const [alerts] = useState([
    { 
      id: '1', 
      severity: 'medium' as const, 
      message: 'استفاده از حافظه بالا رفته است - نظارت بیشتری نیاز است', 
      timestamp: '5 دقیقه پیش' 
    },
    { 
      id: '2', 
      severity: 'low' as const, 
      message: 'یکی از سرورهای cache در حال بازآغازی است', 
      timestamp: '15 دقیقه پیش' 
    },
    { 
      id: '3', 
      severity: 'high' as const, 
      message: 'ترافیک شبکه غیرعادی شناسایی شد', 
      timestamp: '22 دقیقه پیش' 
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: { 
          usage: Math.max(10, Math.min(95, prev.cpu.usage + (Math.random() - 0.5) * 10)), 
          status: 'normal' 
        },
        memory: { 
          usage: Math.max(30, Math.min(90, prev.memory.usage + (Math.random() - 0.5) * 5)), 
          status: 'normal' 
        },
        disk: { 
          usage: Math.max(15, Math.min(85, prev.disk.usage + (Math.random() - 0.5) * 2)), 
          status: 'good' 
        },
        network: { 
          latency: Math.max(5, Math.min(150, prev.network.latency + (Math.random() - 0.5) * 20)), 
          status: 'excellent' 
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SystemHealthPageOrg
      realTimeMetrics={metrics}
      services={services}
      alerts={alerts}
    />
  );
}