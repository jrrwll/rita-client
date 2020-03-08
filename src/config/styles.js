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
