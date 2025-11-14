// Các trạng thái (state) có thể có của game
const GAME_STATE = {
    WAITING: 'waiting',  // Đang chờ người chơi khác tham gia
    PLAYING: 'playing',  // Đang diễn ra vòng chơi
    FINISHED: 'finished' // Đã kết thúc game
};

// Biến lưu trữ trạng thái hiện tại
let currentState = GAME_STATE.WAITING;

function getCurrentState() {
    return currentState;
}

function setGameState(newState) {
    if (Object.values(GAME_STATE).includes(newState)) {
        currentState = newState;
        return true;
    }
    // Trạng thái không hợp lệ, không thay đổi
    return false;
}

module.exports = {
    GAME_STATE,
    getCurrentState,
    setGameState
};