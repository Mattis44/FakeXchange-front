import {createContext} from "react";

type WebSocketContextType = {
    socket: WebSocket | null;
    
    sendMessage: (data: unknown) => void;
    connect: (url: string) => void;
    disconnect: () => void;
    subscribe: (type: string, callback: (data: unknown) => void) => void;
    unsubscribe: (type: string, callback: (data: unknown) => void) => void;

    isConnected?: boolean;
};

export const WebSocketContext = createContext<WebSocketContextType | null>(
    null
);
