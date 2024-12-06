const DateLocal = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000; // Get offset in milliseconds
    const localDate = new Date(date.getTime() - tzOffset); // Adjust to local time
    return localDate.toISOString()
}

export default DateLocal