const pageData = require('./data/pageData.js');
const validPageExample = require('./data/validPageExample.js');
const simpleData = require('./data/simpleData.js');
const tets1v = require('./data/tets1-v.js');
const naGasSupply = require('./data/naGasSupply.js');
const gmfs = require('./data/gmfs.js');

function fixIDs(pageObj, largestID) {
    console.log('largestID', largestID);
    let lastID = ++largestID;
    function fix(obj) {
        if (typeof obj == 'object') {
            if (obj == null) {
                return;
            }
            if (obj instanceof Array) {
                obj.map(item => {
                    if (typeof item === 'object') {
                        fix(item);
                    }
                })
                return;
            }

            if (obj.type == 'row' || obj.type == 'stack') {
                if (obj['id'] !== undefined) {
                    obj['id'] = lastID;
                    lastID++;
                }
            }

            Object.keys(obj).map(key => {
                if (typeof obj[key] == 'object') {
                    fix(obj[key]);
                } else {
                    return;
                }
            })


        }
    }

    fix(pageObj.currentVersion.layout);
    console.log('pageObj: ', JSON.stringify(pageObj.currentVersion.layout));
    return;
}

function getNotUniqueIDs(arr) {
    const { length } = arr;
    const uniqueIDs = [];
    const notUniqueIDs = [];
    for (let i = 0; i < length; i++) {
        if (!uniqueIDs.includes(arr[i])) {
            uniqueIDs.push(arr[i]);
        } else {
            notUniqueIDs.push(arr[i]);
        }
    }
    return notUniqueIDs;
}

function sortNumber(a, b) {
    return a - b;
}

function findIDs(obj, ids) {
    if (typeof obj == 'object') {
        if (obj instanceof Array) {
            if (obj.length) {
                obj.map(o => {
                    findIDs(o, ids);
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
                    findIDs(obj[key], ids);
                } else {
                    return;
                }
            })

        }
    } else {
        return;
    }
}

function isValidPageObject(pageObj) {
    if (!pageObj.currentVersion) {
        return { isValid: true };
    }
    const ids = [];
    const { currentVersion } = pageObj;
    findIDs(currentVersion.layout, ids);
    const largestID = ids.sort(sortNumber)[ids.length - 1];
    const notUniqueIDs = getNotUniqueIDs(ids);
    if (notUniqueIDs.length) {
        console.log('Not unique ids: ', notUniqueIDs.sort().join(', '));
        return { isValid: false, largestID };
    }
    return { isValid: true };
}

const dataArray = [validPageExample];
dataArray.forEach(function (pageObj) {
    const { isValid, largestID } = isValidPageObject(pageObj);
    if (!isValid) {
        fixIDs(pageObj, largestID);
    }
});



