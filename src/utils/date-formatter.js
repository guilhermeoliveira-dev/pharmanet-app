export function toDate(dateStr = "") {
    if (!dateStr || dateStr.trim() === "") {
        return '';
    }
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        if (parts[0].length === 4) {
            return dateStr;
        } else if (parts[0].length === 2) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }
    return dateStr;
}