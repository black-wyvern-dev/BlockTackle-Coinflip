import { io } from "socket.io-client";
import { createContext } from "react";

import { BACKEND_URL } from "../config";

export const socket = io(BACKEND_URL);
export const SocketContext = createContext(socket);
