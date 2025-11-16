import { SOCKET_EVENTS } from "./socket-events.js";
import { setStatusMessage, setLoading, updateChoicesUI, resetGameUI } from "./utils/client-helper.js";

const socket = io();

let currentRoom = null;

const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const roomInput = document.getElementById("roomInput");
const choiceButtons = document.querySelectorAll(".choiceBtn");

createRoomBtn?.addEventListener("click", () => {
  setLoading(true);
  socket.emit(SOCKET_EVENTS.CREATE_ROOM, {}, (res) => {
    setLoading(false);
    if (res.success) {
      currentRoom = res.roomId;
      setStatusMessage(`Tạo phòng thành công! Mã phòng: ${currentRoom}`);
    } else setStatusMessage("Tạo phòng thất bại!");
  });
});

joinRoomBtn?.addEventListener("click", () => {
  const roomId = roomInput.value.trim();
  if (!roomId) return setStatusMessage("Nhập mã phòng!");

  setLoading(true);
  socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId }, (res) => {
    setLoading(false);
    if (res.success) {
      currentRoom = roomId;
      setStatusMessage(`Tham gia phòng ${roomId} thành công!`);
    } else setStatusMessage(res.message);
  });
});

choiceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!currentRoom) return setStatusMessage("Bạn chưa tham gia phòng nào!");
    const choice = btn.dataset.choice;
    updateChoicesUI(choice, null);
    setStatusMessage("Đang chờ đối thủ...");
    socket.emit(SOCKET_EVENTS.PLAYER_CHOICE, { roomId: currentRoom, choice });
  });
});

socket.on(SOCKET_EVENTS.GAME_RESULT, ({ playerChoice, opponentChoice, result }) => {
  updateChoicesUI(playerChoice, opponentChoice);
  const msg = result === "win" ? "Bạn thắng!" : result === "lose" ? "Bạn thua!" : "Hòa!";
  setStatusMessage(msg);
});

socket.on(SOCKET_EVENTS.ROOM_UPDATE, (roomData) => console.log("Room Update:", roomData));

socket.on(SOCKET_EVENTS.ERROR, (err) => setStatusMessage(`Lỗi: ${err}`));
