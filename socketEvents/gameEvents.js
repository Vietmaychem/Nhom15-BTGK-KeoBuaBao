// Định nghĩa TÊN SỰ KIỆN để client và server dùng chung
const GAME_EVENTS = {
    PLAYER_JOINED: 'playerJoined',
    GAME_START: 'gameStart',
    MOVE_MADE: 'moveMade', 
    ROUND_RESULT: 'roundResult',
    GAME_OVER: 'gameOver'
};

/**
 * Hàm chung để gửi một sự kiện game qua Socket.IO.
 * (Cần instance Socket.IO 'io' khi tích hợp)
 * @param {object} io - Instance Socket.IO Server
 * @param {string} eventName - Tên sự kiện (ví dụ: GAME_EVENTS.GAME_START)
 * @param {any} data - Dữ liệu kèm theo sự kiện
 * @param {string} [room] - ID phòng để emit (nếu có)
 */
function emitGameEvent(io, eventName, data, room = null) {
    // Logic gửi sự kiện
    if (room) {
        // Gửi đến một phòng cụ thể
        io.to(room).emit(eventName, data);
    } else {
        // Gửi đến tất cả người chơi
        io.emit(eventName, data); 
    }
    // console.log(`[Socket] Emitted event: ${eventName}`); // Dòng này dùng để debug
}

module.exports = {
    GAME_EVENTS,
    emitGameEvent
};  