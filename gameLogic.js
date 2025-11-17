/**
 * So sánh 2 lựa chọn (move) của người chơi và trả về kết quả thắng/thua/hòa.
 * @param {string} move1 - Lựa chọn của Người chơi 1 ('keo', 'bua', 'bao')
 * @param {string} move2 - Lựa chọn của Người chơi 2 ('keo', 'bua', 'bao')
 * @returns {number} 0 (Hòa), 1 (Người chơi 1 thắng), 2 (Người chơi 2 thắng)
 */
function compareMoves(move1, move2) {
    // 1. Trường hợp HÒA
    if (move1 === move2) {
        return 0;
    }

    // Định nghĩa luật chơi: key thắng value
    const rules = {
        'keo': 'bao',
        'bua': 'keo',
        'bao': 'bua'
    };

    // 2. Trường hợp Người chơi 1 THẮNG (Nếu move1 thắng move2)
    if (rules[move1] === move2) {
        return 1;
    } 
    
    // 3. Trường hợp Người chơi 2 THẮNG
    else {
        return 2;
    }
}

module.exports = {
    compareMoves
};