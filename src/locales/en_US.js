import zh_CN from "./zh_CN";

const en_US = Object.keys(zh_CN).reduce((pv, cv, ci, array) => {
    pv[cv] = cv;
    return pv;
}, {});

export default en_US;
