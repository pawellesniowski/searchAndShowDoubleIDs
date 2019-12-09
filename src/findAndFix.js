const simpleData = {
    currentVersion: {
        layout: {
            rows: [
                {
                    id: 0,
                    type: 'row'
                },
                {
                    id: 1,
                    type: 'row'
                },
                {
                    id: 3,
                    type: 'row'
                },
            ],
            layout: [
                { id: 0, type: 'row' },
                { id: 1, type: 'row' },
                { id: 3, type: 'row' },
                { id: 0, type: 'brick' },
            ],
            id: 5,
            type: 'row'
        }
    }
}

function fixIDs(pageObj, largestID) {
    let lastID = largestID++;
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

    fix(pageObj);
    console.log('pageObj: ', JSON.stringify(pageObj));
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

function isValidPageObject(pageObj) {
    if (!pageObj.currentVersion) {
        return { isValid: true };
    }
    const ids = [];
    const { currentVersion } = pageObj;
    function findIDs(obj) {
        if (typeof obj == 'object') {
            if (obj instanceof Array) {
                if (obj.length) {
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
    findIDs(currentVersion.layout);
    const largestID = ids.sort(sortNumber)[ids.length - 1];
    console.log('largestID: ', largestID);
    const notUniqueIDs = getNotUniqueIDs(ids);
    if (notUniqueIDs.length) {
        console.log('Not unique ids: ', notUniqueIDs.sort().join(', '));
        return { isValid: false, largestID };
    }
    console.log('ids: ', ids);
    return { isValid: true };
}

const dataArray = [simpleData];
dataArray.forEach(function (pageObj) {
    const { isValid, largestID } = isValidPageObject(pageObj);
    if (!isValid) {
        fixIDs(pageObj, largestID);
    }
});



