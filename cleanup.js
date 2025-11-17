function cleanupRooms(roomManager) {
    for (const roomId in roomManager.rooms) {
        const room = roomManager.rooms[roomId];
        if (room.players.length === 0) {
            delete roomManager.rooms[roomId];
            console.log('Room deleted:', roomId);
        }
    }
}

setInterval(() => cleanupRooms(roomManager), 30000);

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        const roomId = roomManager.findRoomByPlayer(socket.id);
        if (roomId) {
            roomManager.removePlayer(roomId, socket.id);
            io.to(roomId).emit('player-left', socket.id);
        }
    });
});

const AFK_LIMIT = 30000; // 30s không activity

io.on('connection', (socket) => {
    let lastActivity = Date.now();

    const refresh = () => (lastActivity = Date.now());
    socket.onAny(refresh);

    setInterval(() => {
        if (Date.now() - lastActivity > AFK_LIMIT) {
            socket.emit('afk-kick');
            socket.disconnect();
        }
    }, 5000);
});
