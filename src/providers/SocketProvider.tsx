import envConfig from '@/config';
import { selectCurrentToken } from '@/redux/features/auth/authSlice';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';

type TValueType = {
  socket: Socket | null;
  socketLoading: boolean;
};

const SocketContext = createContext<TValueType>({
  socket: null,
  socketLoading: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socketLoading, setSocketLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = useSelector(selectCurrentToken);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setSocketLoading(true);

    const socketStore = io(envConfig.socketApi as string, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    // ✅ DEBUG — ekhane add korun
    console.log('🔌 PROVIDER - socket state:', {
      connected: socketStore.connected,
      id: socketStore.id,
    });

    socketStore.on('connect', () => {
      console.log('✅ PROVIDER - connected', socketStore.id);
      setSocketLoading(false);
      setSocket(socketStore);
      // ✅ Connect-er sange sange chat list fetch
      socketStore.emit('my-chat-list', {});
    });

    socketStore.on('disconnect', (reason) => {
      console.log('❌ PROVIDER - disconnected:', reason);
      setSocket(null);
    });

    socketStore.on('reconnect', () => {
      console.log('🔄 PROVIDER - reconnected');
      setSocket(socketStore);
      socketStore.emit('my-chat-list', {});
    });

    socketRef.current = socketStore;

    return () => {
      socketStore.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, socketLoading }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
