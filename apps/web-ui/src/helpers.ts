export const safeParseInt = (shouldBeNumber: string, fallback: number = 0) : number => {
    const x = parseInt(shouldBeNumber);
    return Number.isNaN(x) ? fallback : x;
};
