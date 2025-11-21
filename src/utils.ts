

export const padZeros = (value: string | number, zeros: number = 2) => {
    return `${value}`.padStart(zeros, "0");
};
