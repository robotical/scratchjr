export const DEFAULT_MICROBIT_MATRIX_PATTERN = '00100/01110/10101/00100/00100';

export function normalizeMicroBitMatrixPattern(pattern) {
    const raw = String(pattern || '').replace(/[^01]/g, '');
    const padded = (raw + DEFAULT_MICROBIT_MATRIX_PATTERN.replace(/[^01]/g, '')).substring(0, 25);
    const rows = [];
    for (let row = 0; row < 5; row++) {
        rows.push(padded.substring(row * 5, row * 5 + 5));
    }
    return rows.join('/');
}

export function microBitMatrixPatternToRows(pattern) {
    return normalizeMicroBitMatrixPattern(pattern).split('/');
}

export function microBitMatrixPatternToMatrix(pattern) {
    const rows = microBitMatrixPatternToRows(pattern);
    const matrix = new Uint8Array(5);
    for (let row = 0; row < rows.length; row++) {
        let value = 0;
        for (let col = 0; col < rows[row].length; col++) {
            if (rows[row][col] === '1') {
                value += Math.pow(2, col);
            }
        }
        matrix[row] = value;
    }
    return matrix;
}

export function toggleMicroBitMatrixCell(pattern, index) {
    const normalized = normalizeMicroBitMatrixPattern(pattern).replace(/\//g, '').split('');
    if (index < 0 || index >= normalized.length) {
        return normalizeMicroBitMatrixPattern(pattern);
    }
    normalized[index] = normalized[index] === '1' ? '0' : '1';
    return normalizeMicroBitMatrixPattern(normalized.join(''));
}
