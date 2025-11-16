const RoomManager = require('../roomManager');

describe('RoomManager', () => {
    let rm;

    beforeEach(() => {
        rm = new RoomManager();
    });

    test('Tạo phòng mới', () => {
        const room = rm.createRoom('abc123');
        expect(room.id).toBe('abc123');
        expect(rm.rooms['abc123']).toBeDefined();
    });

    test('Thêm người chơi vào phòng', () => {
        rm.createRoom('abc123');
        rm.joinRoom('abc123', 'player1');
        expect(rm.rooms['abc123'].players).toContain('player1');
    });

    test('Xóa phòng khi rỗng', () => {
        rm.createRoom('room1');
        rm.removeRoomIfEmpty('room1');
        expect(rm.rooms['room1']).toBeUndefined();
    });
});
