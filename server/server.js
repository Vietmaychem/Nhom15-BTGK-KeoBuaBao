// server.js (Phiên bản KHÔNG DÙNG DATABASE)
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Biến lưu trạng thái game (CHỈ LƯU TRONG RAM)
let rooms = {};
let currentRoomId = 1;

// --- ĐỊNH LUẬT CHƠI ---
const rules = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

// Hàm xác định kết quả vòng chơi
function checkWin(choice1, choice2) {
  if (choice1 === choice2) return "draw";
  if (rules[choice1] === choice2) return "win";
  return "lose";
}

// Phục vụ các tệp tĩnh (HTML, CSS, JS) từ thư mục 'public'
app.use(express.static(path.join(__dirname, "public")));

// Xử lý kết nối Socket.IO
io.on("connection", (socket) => {
  console.log(`Người chơi kết nối: ${socket.id}`);

  // --- LOGIC QUẢN LÝ PHÒNG ---
  let roomId = null;

  // Tìm phòng đang chờ (chỉ có 1 người)
  for (const id in rooms) {
    if (rooms[id].players.length === 1) {
      roomId = id;
      break;
    }
  }

  if (!roomId) {
    // Tạo phòng mới
    roomId = `room-${currentRoomId++}`;
    rooms[roomId] = {
      players: [],
      choices: {},
      score: {}, // Khởi tạo điểm mới cho phòng mới
    };
  }

  // Thêm người chơi vào phòng
  rooms[roomId].players.push(socket.id);
  rooms[roomId].choices[socket.id] = null;
  rooms[roomId].score[socket.id] = rooms[roomId].score[socket.id] || 0;

  socket.join(roomId);
  socket.roomId = roomId;

  console.log(
    `Người chơi ${socket.id} tham gia phòng ${roomId}. Số người: ${rooms[roomId].players.length}`
  );

  // Thông báo cho Client
  if (rooms[roomId].players.length === 2) {
    io.to(roomId).emit("gameReady", {
      roomId: roomId,
      players: rooms[roomId].players,
    });
  } else {
    socket.emit("waitingForOpponent", {
      roomId: roomId,
      message: `ID phòng của bạn: ${roomId}. Đang chờ đối thủ...`,
    });
  }

  // --- LOGIC XỬ LÝ LỰA CHỌN & TÍNH ĐIỂM ---
  socket.on("playerChoice", (choice) => {
    const currentRoomId = socket.roomId;
    const currentRoom = rooms[currentRoomId];
    if (!currentRoom || currentRoom.players.length < 2) return;

    currentRoom.choices[socket.id] = choice;
    socket.emit("choiceConfirmed", { yourChoice: choice });

    const [p1Id, p2Id] = currentRoom.players;
    const choice1 = currentRoom.choices[p1Id];
    const choice2 = currentRoom.choices[p2Id];

    if (choice1 && choice2) {
      const result1 = checkWin(choice1, choice2);

      let message1, message2;
      let p1Score = currentRoom.score[p1Id];
      let p2Score = currentRoom.score[p2Id];

      // CẬP NHẬT ĐIỂM SỐ (CHỈ CỘNG KHI THẮNG)
      if (result1 === "win") {
        p1Score++;
        message1 = "Bạn thắng!";
        message2 = "Bạn thua!";
      } else if (result1 === "lose") {
        p2Score++;
        message1 = "Bạn thua!";
        message2 = "Bạn thắng!";
      } else {
        message1 = message2 = "Hòa!";
      }

      // Cập nhật điểm đã tính vào đối tượng rooms (trong RAM)
      currentRoom.score[p1Id] = p1Score;
      currentRoom.score[p2Id] = p2Score;

      // Gửi kết quả vòng chơi về cho Client
      io.to(p1Id).emit("roundResult", {
        result: message1,
        yourChoice: choice1,
        opponentChoice: choice2,
        scores: currentRoom.score,
      });

      io.to(p2Id).emit("roundResult", {
        result: message2,
        yourChoice: choice2,
        opponentChoice: choice1,
        scores: currentRoom.score,
      });

      // Đặt lại lựa chọn cho lượt chơi tiếp theo
      currentRoom.choices[p1Id] = null;
      currentRoom.choices[p2Id] = null;
    } // ĐÓNG if (choice1 && choice2)
  }); // ĐÓNG socket.on('playerChoice')

  // --- LOGIC XỬ LÝ NGẮT KẾT NỐI ---
  socket.on("disconnect", () => {
    const currentRoomId = socket.roomId;
    const currentRoom = rooms[currentRoomId];

    if (currentRoom) {
      currentRoom.players = currentRoom.players.filter(
        (id) => id !== socket.id
      );

      if (currentRoom.players.length === 1) {
        io.to(currentRoom.players[0]).emit(
          "opponentLeft",
          "Đối thủ đã rời phòng. Đang chờ người chơi mới..."
        );
      } else if (currentRoom.players.length === 0) {
        // Xóa phòng khỏi RAM
        delete rooms[currentRoomId];
        console.log(`Phòng ${currentRoomId} đã bị xóa khỏi RAM.`);
      }
    }
    console.log(`Người chơi ${socket.id} ngắt kết nối.`);
  });
}); // <== DẤU NGOẶC NHỌN ĐÓNG CẦN THIẾT cho io.on('connection')

// Khởi động Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
