/**
 * Helper function to adjust a Date object based on the sign, value, and unit.
 * @param {Date} date - The Date object to adjust.
 * @param {string} sign - The sign of the adjustment ('+' or '-').
 * @param {number} value - The value of the adjustment.
 * @param {string} unit - The unit of the adjustment ('d', 'M', 'y', 'h', 'm', 's', 'w').
 */
function applyAdjustment(date: Date, sign: '+' | '-', value: number, unit: 'd' | 'M' | 'y' | 'h' | 'm' | 's' | 'w'): void {
    const multiplier = (sign === '+') ? 1 : -1;
    const adjustments: Record<string, () => void> = {
        'd': () => date.setUTCDate(date.getUTCDate() + value * multiplier),
        'M': () => date.setUTCMonth(date.getUTCMonth() + value * multiplier),
        'y': () => date.setUTCFullYear(date.getUTCFullYear() + value * multiplier),
        'h': () => date.setUTCHours(date.getUTCHours() + value * multiplier),
        'm': () => date.setUTCMinutes(date.getUTCMinutes() + value * multiplier),
        's': () => date.setUTCSeconds(date.getUTCSeconds() + value * multiplier),
        'w': () => date.setUTCDate(date.getUTCDate() + value * 7 * multiplier)
    };
    if (adjustments[unit]) {
        adjustments[unit]();
    }
}

/**
 * Helper function to apply rounding to a Date object based on the unit.
 * @param {Date} date - The Date object to round.
 * @param {string} unit - The unit of the rounding ('d', 'M', 'y', 'h', 'm', 's', 'w').
 */
function applyRounding(date: Date, unit: 'd' | 'M' | 'y' | 'h' | 'm' | 's' | 'w'): void {
    switch (unit) {
        case 'd':
            date.setUTCHours(0, 0, 0, 0);
            break;
        case 'M':
            date.setUTCDate(1);
            date.setUTCHours(0, 0, 0, 0);
            break;
        case 'y':
            date.setUTCMonth(0, 1);
            date.setUTCHours(0, 0, 0, 0);
            break;
        case 'h':
            date.setUTCMinutes(0, 0, 0);
            break;
        case 'm':
            date.setUTCSeconds(0, 0);
            break;
        case 's':
            date.setUTCMilliseconds(0);
            break;
        case 'w':
            const day = date.getUTCDay();
            date.setUTCDate(date.getUTCDate() - day);
            date.setUTCHours(0, 0, 0, 0);
            break;
        default:
            throw new Error(`Invalid rounding unit: ${unit}`);
    }
}


/**
 * Parse shorthand date string into a Date object in UTC.
 * @param {string} datestring - The shorthand date string, e.g., 'now-4d/h-4h+13m/d'.
 * @returns {Date} The parsed Date object in UTC.
 */
export function parse(datestring: string): Date {
    // Use current date time
    const baseDate = new Date();
    
    if (!datestring.startsWith('now')) {
        throw new Error("Invalid date string: Must start with 'now'.");
    }

    // Parse the operations after 'now'
    let operations = datestring.slice(3); // Remove 'now'

    // Regular expression to match operations like '-4d', '/h', '-4h', '+13m', '/d'
    const operationRegex = /([+-]?\d+[dMyhmsw]|\/[dMyhmsw])/g;

    // Extract operations into an array
    const operationsArray = operations.match(operationRegex) || [];

    // Process each operation in order
    operationsArray.forEach(operation => {
        const sign = operation[0] as '+' | '-' | '/';
        const value = parseInt(operation.slice(1, -1)) || 1; // Default value to 1 if no number is present
        const unit = operation.slice(-1) as 'd' | 'M' | 'y' | 'h' | 'm' | 's' | 'w';
        // Validate the sign
        if (sign && !['+', '-', '/'].includes(sign)) {
            throw new Error(`Invalid sign in operation '${operation}'`);
        }
        if (sign === '/' && unit) {
            applyRounding(baseDate, unit);
        } 
        if (sign === '+' || sign === '-') {
            applyAdjustment(baseDate, sign, value, unit);
        }
    });

    return baseDate;
}

/**
 * Helper function to convert a datetime string to a date-only Date object.
 * @param {Date | string} datetimeString - The datetime string or Date object to convert to date-only.
 * @returns {Date} The date-only Date object extracted from the input.
 * @throws {Error} Throws an error if the input is not a Date object or a valid datetime string.
 */
function convertToDateOnly(datetimeString: Date | string): Date {
    // Check if datetimeString is a Date object
    if (datetimeString instanceof Date) {
        // Extract the date part from the Date object
        const datePart = datetimeString.toISOString().split('T')[0];

        // Create a new Date object using the date part
        const dateOnly = new Date(datePart);
        return dateOnly;
    } else {
        // If datetimeString is not a Date object, handle accordingly
        throw new Error('Input is not a Date object.');
    }
}

/**
 * Convert a Date object to a shorthand date string format.
 * @param {Date} date - The Date object to convert.
 * @returns {string} The shorthand date string, e.g., 'now-1d/d'.
 */
export function stringify(date: Date): string {
    // Get the current date in UTC
    const nowUTC = new Date(Date.now());

    let result = "now";
    let timeDifference = date.getTime() - nowUTC.getTime();
    const sign = timeDifference >= 0 ? '+' : '-';
    timeDifference = Math.abs(timeDifference);

    // Time constants in milliseconds
    const msInSecond = 1000;
    const msInMinute = msInSecond * 60;
    const msInHour = msInMinute * 60;
    const msInDay = msInHour * 24;
    const msInWeek = msInDay * 7;
    const msInMonth = msInDay * 30;
    const msInYear = msInDay * 365;

    // Check if it matches year precision
    if (date.getUTCMonth() === 0 && date.getUTCDate() === 1 && 
        date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && 
        date.getUTCSeconds() === 0 && date.getUTCMilliseconds() === 0) {
        const years = date.getUTCFullYear() - nowUTC.getUTCFullYear();
        return (years !== 0) ? `now${sign}${Math.abs(years)}y/y`: `now/y`;
    }

    // Check if it matches month precision
    if (date.getUTCDate() === 1 && date.getUTCHours() === 0 && 
        date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0 && 
        date.getUTCMilliseconds() === 0) {
        const months = (date.getUTCFullYear() - nowUTC.getUTCFullYear()) * 12 + 
                       date.getUTCMonth() - nowUTC.getUTCMonth();
        return (months !== 0) ? `now${sign}${Math.abs(months)}M`:`now/M`;
    }

    // Check if it matches week precision
    if (date.getUTCDay() === 0 && date.getUTCHours() === 0 &&
        date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0 &&
        date.getUTCMilliseconds() === 0) {
        const timeDifferences = date.getTime() - convertToDateOnly(nowUTC).getTime();
        const msInDays = 24 * 60 * 60 * 1000; // 86400000 milliseconds in a day
        const totalDaysDiffs = Math.floor(timeDifferences / msInDays); 
        const weeks = Math.floor(totalDaysDiffs / 7);
        const daysExtra = totalDaysDiffs % 7;
        return (weeks !== 0 || daysExtra !== 0) ? `now${sign}${weeks * 7 + daysExtra}d/w`:`now/w`;
    }

    // Check if it matches day precision
    if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && 
        date.getUTCSeconds() === 0 && date.getUTCMilliseconds() === 0) {
        const days = Math.floor(timeDifference / msInDay);
        return (days !== 0) ?`now${sign}${days}d`:`now/d`;
    }

    // Check if it matches hour precision
    if (date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0 && 
        date.getUTCMilliseconds() === 0) {
        const hours = Math.floor(timeDifference / msInHour);
        return hours !== 0 ?`now${sign}${hours}h`:`now/h`;
    }

    // Check if it matches minute precision
    if (date.getUTCSeconds() === 0 && date.getUTCMilliseconds() === 0) {
        const minutes = Math.floor(timeDifference / msInMinute);
        return minutes !== 0 ? `now${sign}${minutes}m` : `now/m`;
    }

      // Calculate units different
      const units = [
        { label: 'y', duration: msInYear },
        { label: 'M', duration: msInMonth },
        { label: 'w', duration: msInWeek },
        { label: 'd', duration: msInDay },
        { label: 'h', duration: msInHour },
        { label: 'm', duration: msInMinute },
        { label: 's', duration: msInSecond }
    ];
    
    units.forEach(unit => {
        const value = Math.floor(timeDifference / unit.duration);
        timeDifference %= unit.duration;
    
        if (value > 0) {
            result += `${sign}${value}${unit.label}`;
        }
    });
    
    if (result === "now") {
        result = "now";
    }
    
    return result; 
}


