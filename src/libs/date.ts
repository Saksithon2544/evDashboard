export function dateFormate(date: Date | string | number) {
    return new Date(date).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        // second: "numeric",
    },);
}

