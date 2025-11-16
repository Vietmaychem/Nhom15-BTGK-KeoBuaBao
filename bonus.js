// Chat
socket.emit('chat', {
    roomId,
    player: socket.id,
    message: 'Hello'
});

socket.on('chat', (data) => {
    io.to(data.roomId).emit('chat-message', {
        player: data.player,
        message: data.message,
        time: Date.now()
    });
});

// Stats update
player.stats = {
    win: 0,
    lose: 0
};
if (result === 1) {
    p1.stats.win++;
    p2.stats.lose++;
}
if (result === 2) {
    p2.stats.win++;
    p1.stats.lose++;
}

io.to(roomId).emit('update-stats', {
    p1: p1.stats,
    p2: p2.stats
});
