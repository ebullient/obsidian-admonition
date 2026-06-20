const { writeFile, mkdirSync } = require("fs");
const { fas } = require("@fortawesome/free-solid-svg-icons");

const data = {};
for (const icon of Object.values(fas)) {
    if (!icon || typeof icon !== "object" || !icon.iconName) continue;
    const [width, height, , , path] = icon.icon;
    const pathStr = Array.isArray(path)
        ? path.map((d, i) => `<path fill-rule='evenodd' d='${d}' class='fa-${i === 0 ? "secondary" : "primary"}'/>`).join("")
        : `<path d='${path}'/>` ;
    data[icon.iconName] = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' fill='currentColor' class='svg-inline--fa fa-${icon.iconName}'>${pathStr}</svg>`;
}

mkdirSync(`${__dirname}`, { recursive: true });
writeFile(`${__dirname}/icons.json`, JSON.stringify(data), (err) => {
    if (err) console.error(err);
    else console.log(`Generated ${Object.keys(data).length} solid icons.`);
});
