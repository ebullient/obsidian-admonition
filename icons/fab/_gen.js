const { writeFile, mkdirSync } = require("fs");
const { fab } = require("@fortawesome/free-brands-svg-icons");

const data = {};
for (const [key, icon] of Object.entries(fab)) {
    if (key === "prefix" || key === "fab") continue;
    const [width, height, , , path] = icon.icon;
    const pathStr = Array.isArray(path)
        ? path.map((d, i) => `<path fill-rule='evenodd' d='${d}' class='fa-${i === 0 ? "secondary" : "primary"}'/>`).join("")
        : `<path d='${path}'/>`;
    data[icon.iconName] = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' fill='currentColor' class='svg-inline--fa fa-${icon.iconName}'>${pathStr}</svg>`;
}

writeFile(`${__dirname}/icons.json`, JSON.stringify(data, null, 4), (err) => {
    if (err) console.error(err);
    else console.log(`Generated ${Object.keys(data).length} brand icons.`);
});
