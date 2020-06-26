const fs = require("fs");
const path = require("path");

const MONTH = process.argv[2];

const weeks = csvToArray(fs.readFileSync(path.resolve(__dirname, "sales.csv")).toString());
for (let i = 0; i < weeks.length; i++) {
    const current = weeks[i];
    const [day, month, year] = current.date.split(".")

    const endOfWeek = new Date(year, month, day);
    const startOfWeek = new Date(endOfWeek - 7 * 864e5);

    
    let a = 1;
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
