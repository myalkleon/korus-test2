const fs = require("fs");
const path = require("path");

const MONTH = process.argv[2];

const weeks = csvToArray(fs.readFileSync(path.resolve(__dirname, "sales.csv")).toString());

const months = getMonths(weeks);
if (MONTH) {
    logMonth([MONTH, months.get(MONTH)]);
} else {
    Array.from(months).map(logMonth);
}

function logMonth([month, summ]) {
    console.log(`Month: ${month}. Summ: ${summ}`);
}

function getMonths(weeks) {
    const months = new Map();
    for (let i = 0; i < weeks.length; i++) {
        const summ = weeks[i].summ;
        const [day, month, year] = weeks[i].date.split(".");
    
        const endOfWeek = new Date(year, month - 1, day);
        const startOfWeek = new Date(endOfWeek - 6 * 864e5);
    
        if (areDatesInDifferentMonths(startOfWeek, endOfWeek)) {
            const daysInPrevMonth = getDaysFromEndOfMonthToDate(startOfWeek);
            const daysInCurrentMonth = getDaysFromStartOfMonthToDate(endOfWeek);
            addSummToMonth(startOfWeek.getMonth()+ 1, (summ / 7 * daysInPrevMonth).toFixed(2), months);
            addSummToMonth(endOfWeek.getMonth() + 1, (summ / 7 * daysInCurrentMonth).toFixed(2), months);
        } else {
            addSummToMonth(endOfWeek.getMonth() + 1, summ, months);
        }
    }
    return months;
}

function addSummToMonth(month, summ, map) {
    let newSum;
    const strMonth = String(month);

    if (map.has(strMonth)) {
        newSum = Number(map.get(strMonth)) + Number(summ);
    } else {
        newSum = Number(summ);
    }

    map.set(strMonth, newSum);
}

function getDaysFromStartOfMonthToDate(date) {
    const firstDayOfMonth = new Date(date.getYear(), date.getMonth(), 1);
    return date.getDate() - firstDayOfMonth.getDate() + 1;
}

function getDaysFromEndOfMonthToDate(date) {
    const lastDayOfMonth = new Date(date.getYear(), date.getMonth() + 1, 0);
    return lastDayOfMonth.getDate() - date.getDate() + 1;    
}

function areDatesInDifferentMonths(date1, date2) {
    let res = false;
    if (date1.getMonth() !== date2.getMonth()) {
        res = true;
    }
    return res;
}

// We can do that using some npm package, but...
function csvToArray(raw) {
    const res = [];

    const notes = raw.split("\n").filter(value => value !== "");
    const keys = notes[0].split(";");

    // Lets loop our notes (except keys)
    for (let i = 1; i < notes.length; i++) {
        let noteObj = {};

        const note = notes[i];
        const values = note.split(";");

        keys.forEach((key, index) => {
            noteObj[key.trim()] = values[index].trim();
        });

        res.push(noteObj);
    }

    return res;
}
