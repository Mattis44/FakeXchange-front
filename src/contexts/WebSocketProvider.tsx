import {useCallback, useEffect, useRef, useState} from "react";
import CONSTANTS from "../constants/constants";
import {WebSocketContext} from "./WebSocketContext";

export const WebSocketProvider = ({children}: {children: React.ReactNode}) => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const subscriptions = useRef<Map<string, ((data: unknown) => void)[]>>(
        new Map()
    );

    const connect = useCallback(() => {
        const socket = new WebSocket(CONSTANTS.API.WS_URL);
        socketRef.current = socket;

        socket.onopen = () => {
            setIsConnected(true);
            console.log("WebSocket connected");
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log("WebSocket disconnected");
            setTimeout(connect, 2000);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            socket.close();
        };
    }, []);

    useEffect(() => {
        const socket = new WebSocket(CONSTANTS.API.WS_URL);
        socketRef.current = socket;

        socket.onopen = () => setIsConnected(true);

        socket.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                const {type} = msg;
                const subs = subscriptions.current.get(type);
                if (subs) {
                    subs.forEach((cb) => cb(msg));
                }
            } catch (err) {
                console.error("Invalid WS message", err);
            }
        };

        socket.onclose = () => setIsConnected(false);
        socket.onerror = () => setIsConnected(false);

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = useCallback((data: unknown) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(data));
        } else {
            console.error("WebSocket is not open. Cannot send message:", data);
        }
    }, []);

    const subscribe = useCallback(
        (type: string, callback: (data: unknown) => void) => {
            if (!subscriptions.current.has(type)) {
                subscriptions.current.set(type, []);
            }
            subscriptions.current.get(type)?.push(callback);
        },
        []
    );

    const unsubscribe = useCallback(
        (type: string, callback: (data: unknown) => void) => {
            const subs = subscriptions.current.get(type);
            if (subs) {
                subscriptions.current.set(
                    type,
                    subs.filter((cb) => cb !== callback)
                );
            }
        },
        []
    );

    return (
        <WebSocketContext.Provider
            value={{
                sendMessage,
                connect,
                disconnect: () => socketRef.current?.close(),
                socket: socketRef.current,
                isConnected,
                subscribe,
                unsubscribe,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};
