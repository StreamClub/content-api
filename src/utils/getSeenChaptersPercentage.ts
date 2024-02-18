

export const getSeenChaptersPercentage = (seen: number, total: number): number => {
    return (total != 0) ? 100 * (seen / total) : 0
}