const { compareMoves } = require('../gameLogic');

describe('compareMoves', () => {
    test('Hòa khi 2 người cùng chọn', () => {
        expect(compareMoves('keo', 'keo')).toBe(0);
        expect(compareMoves('bua', 'bua')).toBe(0);
        expect(compareMoves('bao', 'bao')).toBe(0);
    });

    test('Người chơi 1 thắng đúng luật', () => {
        expect(compareMoves('keo', 'bao')).toBe(1);
        expect(compareMoves('bua', 'keo')).toBe(1);
        expect(compareMoves('bao', 'bua')).toBe(1);
    });

    test('Người chơi 2 thắng đúng luật', () => {
        expect(compareMoves('bao', 'keo')).toBe(2);
        expect(compareMoves('keo', 'bua')).toBe(2);
        expect(compareMoves('bua', 'bao')).toBe(2);
    });
});
