import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import _ from 'lodash';
import {storage} from "./index";
import {getSearchValue} from "../util/url";

// const md = new MarkdownIt({
//     html:         false,        // Enable HTML tags in source
//     xhtmlOut:     false,        // Use '/' to close single tags (<br />).
//                                 // This is only for full CommonMark compatibility.
//     breaks:       false,        // Convert '\n' in paragraphs into <br>
//     langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
//                                 // useful for external highlighters.
//     linkify:      false,        // Autoconvert URL-like text to links
//
//     // Enable some language-neutral replacement + quotes beautification
//     typographer:  false,
//
//     // Double + single quotes replacement pairs, when typographer enabled,
//     // and smartquotes on. Could be either a String or an Array.
//     //
//     // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
//     // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
//     quotes: '“”‘’',
//
//     // Highlighter function. Should return escaped HTML,
//     // or '' if the source string is not changed and should be escaped externally.
//     // If result starts with <pre... internal wrapper is skipped.
//     highlight: function (/*str, lang*/) { return ''; }
// });

// enable everything
const md = MarkdownIt({
    html: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`;
            } catch (__) {
            }
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
});

export function md2html(markdown) {
    return md.render(markdown)
}

export function addLineNumber() {
    document.querySelectorAll("code").forEach(code => {
        code.innerHTML = "<ol><li>" + code.innerHTML.replace(/\n/g, "\n</li><li>") + "\n</li></ol>";
    })
}

// ls | cut -d. -f1 | while read line; do echo \'$line\', ;done
export const HIGHLIGHT_STYLE_LIST = [
    'default',
    'a11y-dark',
    'a11y-light',
    'agate',
    'an-old-hope',
    'androidstudio',
    'arduino-light',
    'arta',
    'ascetic',
    'atelier-cave-dark',
    'atelier-cave-light',
    'atelier-dune-dark',
    'atelier-dune-light',
    'atelier-estuary-dark',
    'atelier-estuary-light',
    'atelier-forest-dark',
    'atelier-forest-light',
    'atelier-heath-dark',
    'atelier-heath-light',
    'atelier-lakeside-dark',
    'atelier-lakeside-light',
    'atelier-plateau-dark',
    'atelier-plateau-light',
    'atelier-savanna-dark',
    'atelier-savanna-light',
    'atelier-seaside-dark',
    'atelier-seaside-light',
    'atelier-sulphurpool-dark',
    'atelier-sulphurpool-light',
    'atom-one-dark-reasonable',
    'atom-one-dark',
    'atom-one-light',
    'brown-paper',
    'brown-papersq',
    'codepen-embed',
    'color-brewer',
    'darcula',
    'dark',
    'darkula',
    'docco',
    'dracula',
    'far',
    'foundation',
    'github-gist',
    'github',
    'gml',
    'googlecode',
    'gradient-dark',
    'grayscale',
    'gruvbox-dark',
    'gruvbox-light',
    'hopscotch',
    'hybrid',
    'idea',
    'ir-black',
    'isbl-editor-dark',
    'isbl-editor-light',
    'kimbie',
    'kimbie',
    'lightfair',
    'magula',
    'mono-blue',
    'monokai-sublime',
    'monokai',
    'night-owl',
    'nord',
    'obsidian',
    'ocean',
    'paraiso-dark',
    'paraiso-light',
    'pojoaque',
    'pojoaque',
    'purebasic',
    'qtcreator_dark',
    'qtcreator_light',
    'railscasts',
    'rainbow',
    'routeros',
    'school-book',
    'school-book',
    'shades-of-purple',
    'solarized-dark',
    'solarized-light',
    'sunburst',
    'tomorrow-night-blue',
    'tomorrow-night-bright',
    'tomorrow-night-eighties',
    'tomorrow-night',
    'tomorrow',
    'vs',
    'vs2015',
    'xcode',
    'xt256',
    'zenburn',
];

export function getStyle(defaultStyle) {
    if (!defaultStyle) defaultStyle = _.get(storage.getUser(), "style", "");
    if (!defaultStyle) defaultStyle = "default";
    // handle ?style=xxx
    return getSearchValue('style', defaultStyle);
}
