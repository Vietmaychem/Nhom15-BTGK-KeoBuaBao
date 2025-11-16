import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public")); // Serve frontend

// Lưu trạng thái phòng { roomId: { players: [{id, choice}], ... } }
const rooms = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Tạo phòng
  socket.on("create_room", (_, callback) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms[roomId] = { players: [] };
    callback({ success: true, roomId });
  });

  // Tham gia phòng
  socket.on("join_room", ({ roomId }, callback) => {
    const room = rooms[roomId];
    if (!room) return callback({ success: false, message: "Phòng không tồn tại!" });
    if (room.players.length >= 2) return callback({ success: false, message: "Phòng đầy!" });

    room.players.push({ id: socket.id, choice: null });
    socket.join(roomId);
    callback({ success: true });

    // Notify room update
    io.to(roomId).emit("room_update", room);
  });

  // Nhận lựa chọn của người chơi
  socket.on("player_choice", ({ roomId, choice }) => {
    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
    player.choice = choice;

    // Kiểm tra nếu 2 người đã chọn xong
    if (room.players.length === 2 && room.players.every((p) => p.choice)) {
      const [p1, p2] = room.players;
      const result = getResult(p1.choice, p2.choice);

      io.to(roomId).emit("game_result", {
        playerChoice: p1.choice,
        opponentChoice: p2.choice,
        result: result[p1.id === socket.id ? 0 : 1]
      });

      // Reset choices
      room.players.forEach(p => p.choice = null);
    }
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      room.players = room.players.filter(p => p.id !== socket.id);
      io.to(roomId).emit("room_update", room);
    }
    console.log("Client disconnected:", socket.id);
  });
});

// Kết quả: ["win", "lose"] cho 2 người chơi
function getResult(choice1, choice2) {
  if (choice1 === choice2) return ["draw", "draw"];
  if (
    (choice1 === "rock" && choice2 === "scissors") ||
    (choice1 === "scissors" && choice2 === "paper") ||
    (choice1 === "paper" && choice2 === "rock")
  ) return ["win", "lose"];
  return ["lose", "win"];
}

httpServer.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
