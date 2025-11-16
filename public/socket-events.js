// socket-events.js
// Quản lý tất cả tên sự kiện Socket.IO để tránh viết trực tiếp string nhiều lần

export const SOCKET_EVENTS = {
  CREATE_ROOM: "create_room",      // Tạo phòng mới
  JOIN_ROOM: "join_room",          // Tham gia phòng
  PLAYER_CHOICE: "player_choice",  // Người chơi chọn kéo/búa/bao
  GAME_RESULT: "game_result",      // Kết quả trận đấu
  ROOM_UPDATE: "room_update",      // Cập nhật trạng thái phòng (số người chơi, ...)
  ERROR: "error"                   // Thông báo lỗi
};
