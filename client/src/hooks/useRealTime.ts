import { useEffect, useState, useRef } from "react";

interface RealTimeData {
  metrics?: {
    cpu: number;
    memory: number;
    timestamp: string;
  };
  logs?: any[];
  nfts?: any[];
}

export function useRealTime() {
  const [data, setData] = useState<RealTimeData>({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const connect = () => {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
          
          // Send ping to keep connection alive
          const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping" }));
            }
          }, 30000);

          ws.onclose = () => {
            clearInterval(pingInterval);
            setIsConnected(false);
          };
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
              case "connected":
                console.log("ScrollVerse WebSocket:", message.message);
                break;
              case "metrics_update":
                setData(prev => ({
                  ...prev,
                  metrics: message.data
                }));
                break;
              case "logs_update":
                setData(prev => ({
                  ...prev,
                  logs: message.data
                }));
                break;
              case "nfts_update":
                setData(prev => ({
                  ...prev,
                  nfts: message.data
                }));
                break;
              case "pong":
                // Keep-alive response
                break;
            }
          } catch (error) {
            console.error("WebSocket message parsing error:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          setIsConnected(false);
          
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            connect();
          }, 5000);
        };
      } catch (error) {
        console.error("WebSocket connection error:", error);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { data, isConnected, sendMessage };
}
