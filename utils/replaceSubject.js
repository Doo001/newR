const path = require('path');
const fs = require('fs');
const main = path.join(__dirname, '..', 'src', 'js', 'main_entry.jsx');
const target = path.join(__dirname, '..', 'src', 'js', 'main_entry.js');
let ktag = path.join(__dirname, '..', 'src', 'js', 'item', 'ktag_editor.js')
let plan = path.join(__dirname, '..', 'src', 'js', 'widgets', 'plan')
const reg = /([^\$\{\}]*)(\$\{([A-Z]+)\})/g;
function readFile(uri) {
    return new Promise((resolve, reject) => {
        fs.readFile(uri, {encoding: "utf8"}, (err,data) =>  {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

}

function writeFile(str, target) {
    return new Promise((resolve, reject) => {
        fs.writeFile(target, str, {encoding: "utf8"}, (err,data) =>  {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}
function transform(uri, target) {
    return readFile(uri).then(data => writeFile(data, target))
}
module.exports = async function (subject) {
    await transform(main, target);
    await transform(main, target);
    await transform(main, target);
    let data = str.replace(reg, function (match, p1, p2, p3 ) {
        return p1 + process.env[p3]
    })
    console.log(data)
    await writeFile(data)
    return true;
}