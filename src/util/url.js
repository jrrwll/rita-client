// based on window.location.search
export function getSearchValue(key, defaultValue) {
    let search = window.location.search;
    if (search) {
        search = search.slice(1);
        const query = queryStringToObject(search);
        if (query && query[key]) {
            if (typeof defaultValue === 'number') {
                let value = Number(query[key]);
                if (Number.isNaN(value)) value = defaultValue;
                return value;
            } else {
                return query[key];
            }
        }
    }
    return defaultValue;
}

export function queryStringToObject(queryString, alsoStatement = false) {
    if (!queryString) {
        if (alsoStatement) {
            return {
                query: {},
                statement: "",
            }
        } else return {};
    }

    let query = {};
    let statement = "";
    let len = queryString.length;
    let i = queryString.indexOf('#');
    if (i !== -1) {
        if (alsoStatement && i !== len - 1) {
            statement = queryString.slice(i + 1);
        }
        queryString = queryString.slice(0, i);
    }
    queryString.split('&').forEach((value, index) => {
        let i = value.indexOf('=');
        if (i !== -1 && i !== value.length - 1) {
            query[value.slice(0, i)] = value.slice(i + 1);
        }
    });

    if (alsoStatement) {
        return {
            query: query,
            statement: statement,
        }
    } else return query;
}
