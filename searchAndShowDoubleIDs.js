// const pageData = require('./page.js');
const simpleData = require('./simpleData.js');

function isValidPageObject(pageData) {
    const ids = [];
    const { layout } = pageData;
    function findIDs(obj) {
        if (typeof obj == 'object') {
            if (obj instanceof Array) {
                if (obj.length > 0) {
                    obj.map(o => {
                        findIDs(o);
                    });
                } else {
                    return;
                }
            } else {
                if (obj == null) {
                    return;
                }
                if (obj['id'] !== undefined) {
                    ids.push(obj['id']);
                }
                Object.keys(obj).map(key => {
                    if (typeof obj[key] == 'object') {
                        findIDs(obj[key]);
                    } else {
                        return;
                    }
                })

            }
        } else {
            return;
        }
    }
    findIDs(layout)
    console.log('Found IDs:', ids.length, 'Unique IDs', new Set(ids).size);
    console.log('Found IDs:', ids.sort());

    if (ids.length != new Set(ids).size) {
        return false
    }
    return true;
}

console.log(isValidPageObject(simpleData))

