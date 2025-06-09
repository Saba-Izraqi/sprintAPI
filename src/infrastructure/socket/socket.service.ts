import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { injectable, singleton } from "tsyringe";
import jwt from "jsonwebtoken";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

interface JwtPayload {
  userId: string;
  [key: string]: unknown;
}

/**
 * Service for managing Socket.IO connections and real-time communication
 */
@injectable()
export class SocketService {
  private io?: SocketIOServer;
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]

  /**
   * Initialize the Socket.IO server with authentication and event handlers
   * @param httpServer - The HTTP server instance to attach Socket.IO to
   */
  initialize(httpServer: HttpServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.use(this.authenticateSocket.bind(this));
    this.io.on("connection", this.handleConnection.bind(this));

    console.success("🔌 Socket.IO initialized");
  }

  /**
   * Authenticate socket connections using JWT tokens
   * @param socket - The socket connection to authenticate
   * @param next - Callback function to continue or reject the connection
   */
  private authenticateSocket(
    socket: AuthenticatedSocket,
    next: (err?: Error) => void
  ): void {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error("Invalid authentication token"));
    }
  }

  /**
   * Handle new socket connections
   * @param socket - The authenticated socket connection
   */
  private handleConnection(socket: AuthenticatedSocket): void {
    const userId = socket.userId!;

    // Add socket to user's socket list
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, []);
    }
    this.userSockets.get(userId)!.push(socket.id);

    console.info(`🔌 User ${userId} connected with socket ${socket.id}`);

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // Handle disconnect
    socket.on("disconnect", () => {
      this.handleDisconnect(socket);
    });

    // Handle joining project rooms
    socket.on("join-project", (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.info(`🔌 User ${userId} joined project room: ${projectId}`);
    });

    // Handle leaving project rooms
    socket.on("leave-project", (projectId: string) => {
      socket.leave(`project:${projectId}`);
      console.info(`🔌 User ${userId} left project room: ${projectId}`);
    });
  }

  /**
   * Handle socket disconnections
   * @param socket - The socket being disconnected
   */
  private handleDisconnect(socket: AuthenticatedSocket): void {
    const userId = socket.userId!;
    const userSocketIds = this.userSockets.get(userId);

    if (userSocketIds) {
      const index = userSocketIds.indexOf(socket.id);
      if (index > -1) {
        userSocketIds.splice(index, 1);
      }

      if (userSocketIds.length === 0) {
        this.userSockets.delete(userId);
      }
    }

    console.info(`🔌 User ${userId} disconnected from socket ${socket.id}`);
  }

  /**
   * Send notification to specific user
   * @param userId - The user ID to send the notification to
   * @param event - The event name
   * @param data - The notification data
   */
  emitToUser(userId: string, event: string, data: unknown): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit(event, data);
    console.info(`🔔 Notification sent to user ${userId}: ${event}`);
  }

  /**
   * Send notification to all users in a project
   * @param projectId - The project ID
   * @param event - The event name
   * @param data - The notification data
   */
  emitToProject(projectId: string, event: string, data: unknown): void {
    if (!this.io) return;

    this.io.to(`project:${projectId}`).emit(event, data);
    console.info(`🔔 Notification sent to project ${projectId}: ${event}`);
  }

  /**
   * Send notification to multiple users
   * @param userIds - Array of user IDs to send notifications to
   * @param event - The event name
   * @param data - The notification data
   */
  emitToUsers(userIds: string[], event: string, data: unknown): void {
    if (!this.io) return;

    userIds.forEach((userId) => {
      this.emitToUser(userId, event, data);
    });
  }

  /**
   * Broadcast to all connected users
   * @param event - The event name
   * @param data - The notification data
   */
  broadcast(event: string, data: unknown): void {
    if (!this.io) return;

    this.io.emit(event, data);
    console.info(`🔔 Broadcast notification sent: ${event}`);
  }

  /**
   * Get online users count
   * @returns The number of online users
   */
  getOnlineUsersCount(): number {
    return this.userSockets.size;
  }

  /**
   * Check if user is online
   * @param userId - The user ID to check
   * @returns True if user is online, false otherwise
   */
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  /**
   * Get all online user IDs
   * @returns Array of online user IDs
   */
  getOnlineUserIds(): string[] {
    return Array.from(this.userSockets.keys());
  }
}

