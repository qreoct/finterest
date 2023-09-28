export function generateColorFromTitle(title: string) {
    const colors = [
        'gold-500',
        'gold-100',
        'pine-500',
        'pine-100',
        'rose-500',
        'rose-100',
        'stone-200',
        'firecracker-100',
        'sapphire-500',
        'sapphire-100',
    ]

    if (title.length < 3) {
        return 'gold-100';
    } else {
        let firstThree: string = title.substring(0, 3)
        let charcodes = []
        for (let i = 0; i < 3; i++) {
            charcodes.push(firstThree.charCodeAt(i))
        }
        let selection = charcodes.reduce((acc, code) => acc + code, 0) % 10;
        return colors[selection]
    }
}