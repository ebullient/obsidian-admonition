const { writeFile, mkdirSync } = require("fs");
const { fas } = require("@fortawesome/free-solid-svg-icons");
const { far } = require("@fortawesome/free-regular-svg-icons");
const { fab } = require("@fortawesome/free-brands-svg-icons");

function iconNames(pack) {
    return Object.values(pack)
        .filter((v) => v && typeof v === "object" && v.iconName)
        .map((v) => v.iconName)
        .sort();
}

const data = {
    fas: iconNames(fas),
    far: iconNames(far),
    fab: iconNames(fab),
};

console.log(`fas: ${data.fas.length}, far: ${data.far.length}, fab: ${data.fab.length}`);

mkdirSync(`${__dirname}`, { recursive: true });
writeFile(`${__dirname}/names.json`, JSON.stringify(data), (err) => {
    if (err) console.error(err);
    else console.log("Generated icons/fa-names/names.json");
});
