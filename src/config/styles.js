import {choose, randi} from "../util/random";

export function inputIconLeft(name) {
    return {
        paddingLeft: "calc(1.5em + .75rem)",
        backgroundImage: `url('/static/images/${name}.svg')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center left calc(.375em + .1875rem)",
        backgroundSize: "calc(.75em + .375rem) calc(.75em + .375rem)"
    }
}

export function inputIconRight(name) {
    return {
        paddingRight: "calc(1.5em + .75rem)",
        backgroundImage: `url('/static/images/fontawesome/${name}.svg')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center right calc(.375em + .1875rem)",
        backgroundSize: "calc(.75em + .375rem) calc(.75em + .375rem)"
    }
}

const variants = ['info', 'warning', 'danger', 'light'];

export function randomButtonVariants(index) {
    let outline = index % 2 === randi(2) ? "outline-" : "";
    return "btn-" + outline + choose(1, variants);
}

export function orderlyButtonVariants(index) {
    let outline = index % 2 === randi(2) ? "outline-" : "";
    return "btn-" + outline + variants[index % 4];
}
