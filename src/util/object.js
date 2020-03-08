export function deepClone(obj) {
    switch (typeof obj) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
        case "number":
        case "bigint":
        case "string":
            return obj;
        case "object":
            if (obj instanceof Array) {
                let length = obj.length;
                if (length === 0) {
                    return [];
                }
                let newObj = [];
                for (let i = 0; i < length; i++) {
                    newObj.push(deepClone(obj[i]));
                }
                return newObj;
            }

            let newObj = {};
            Object.keys(obj).forEach((key) => {
                newObj[key] = deepClone(obj[key]);
            });
            return newObj;
        default:
            throw Error("A unexpected error occurred, typeof didn't go through all the possible values: " + typeof obj);
    }
}

function pruneEmpty(obj) {
    const current = deepClone(obj);
    Object.keys(current).forEach((key, index) => {
        const value = current[key];
        if (value === undefined || value === null || Number.isNaN(value)) {
            delete current[key];
        }
        if (typeof value === 'string' && value.length === 0) {
            delete current[key];
        }
        if (typeof value === 'object') {
            if (Object.keys(pruneEmpty(value)).length === 0) {
                delete current[key];
            }
            if (value instanceof Array) {
                current[key] = value.filter(it => it !== undefined);
            }
        }
    });
    return current;
}

export function prune(obj) {
    if (typeof obj !== 'object') {
        return obj
    } else {
        return pruneEmpty(obj)
    }
}
