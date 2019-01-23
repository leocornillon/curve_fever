
export function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}