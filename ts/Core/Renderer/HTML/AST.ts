/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type HTMLAttributes from '../HTML/HTMLAttributes';
import type SVGAttributes from '../SVG/SVGAttributes';

import H from '../../Globals.js';
const { SVG_NS } = H;
import U from '../../Utilities.js';
const {
    attr,
    createElement,
    discardElement,
    error,
    isString,
    objectEach,
    splat
} = U;

/* *
 *
 *  Constants
 *
 * */

// In IE8, DOMParser is undefined. IE9 and PhantomJS are only able to parse XML.
const hasValidDOMParser = (function (): boolean {
    try {
        return Boolean(new DOMParser().parseFromString('', 'text/html'));
    } catch (e) {
        return false;
    }
}());

/* *
 *
 *  Class
 *
 * */

/**
 * The AST class represents an abstract syntax tree of HTML or SVG content. It
 * can take HTML as an argument, parse it, optionally transform it to SVG, then
 * perform sanitation before inserting it into the DOM.
 *
 * @class
 * @name Highcharts.AST
 *
 * @param {string|Array<Highcharts.ASTNode>} source
 * Either an HTML string or an ASTNode list to populate the tree.
 */
class AST {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * The list of allowed SVG or HTML attributes, used for sanitizing
     * potentially harmful content from the chart configuration before adding to
     * the DOM.
     *
     * @example
     * // Allow a custom, trusted attribute
     * Highcharts.AST.allowedAttributes.push('data-value');
     *
     * @name Highcharts.AST.allowedAttributes
     * @static
     */
    public static allowedAttributes = [
        'aria-controls',
        'aria-describedby',
        'aria-expanded',
        'aria-haspopup',
        'aria-hidden',
        'aria-label',
        'aria-labelledby',
        'aria-live',
        'aria-pressed',
        'aria-readonly',
        'aria-roledescription',
        'aria-selected',
        'class',
        'clip-path',
        'color',
        'colspan',
        'cx',
        'cy',
        'd',
        'dx',
        'dy',
        'disabled',
        'fill',
        'height',
        'href',
        'id',
        'in',
        'markerHeight',
        'markerWidth',
        'offset',
        'opacity',
        'orient',
        'padding',
        'paddingLeft',
        'paddingRight',
        'patternUnits',
        'r',
        'refX',
        'refY',
        'role',
        'scope',
        'slope',
        'src',
        'startOffset',
        'stdDeviation',
        'stroke',
        'stroke-linecap',
        'stroke-width',
        'style',
        'tableValues',
        'result',
        'rowspan',
        'summary',
        'target',
        'tabindex',
        'text-align',
        'textAnchor',
        'textLength',
        'type',
        'valign',
        'width',
        'x',
        'x1',
        'x2',
        'y',
        'y1',
        'y2',
        'zIndex'
    ];

    /**
     * The list of allowed references for referring attributes like `href` and
     * `src`. Attribute values will only be allowed if they start with one of
     * these strings.
     *
     * @example
     * // Allow tel:
     * Highcharts.AST.allowedReferences.push('tel:');
     *
     * @name Highcharts.AST.allowedReferences
     * @static
     */
    public static allowedReferences = [
        'https://',
        'http://',
        'mailto:',
        '/',
        '../',
        './',
        '#'
    ];

    /**
     * The list of allowed SVG or HTML tags, used for sanitizing potentially
     * harmful content from the chart configuration before adding to the DOM.
     *
     * @example
     * // Allow a custom, trusted tag
     * Highcharts.AST.allowedTags.push('blink'); // ;)
     *
     * @name Highcharts.AST.allowedTags
     * @static
     */
    public static allowedTags = [
        'a',
        'b',
        'br',
        'button',
        'caption',
        'circle',
        'clipPath',
        'code',
        'dd',
        'defs',
        'div',
        'dl',
        'dt',
        'em',
        'feComponentTransfer',
        'feFuncA',
        'feFuncB',
        'feFuncG',
        'feFuncR',
        'feGaussianBlur',
        'feOffset',
        'feMerge',
        'feMergeNode',
        'filter',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'hr',
        'i',
        'img',
        'li',
        'linearGradient',
        'marker',
        'ol',
        'p',
        'path',
        'pattern',
        'pre',
        'rect',
        'small',
        'span',
        'stop',
        'strong',
        'style',
        'sub',
        'sup',
        'svg',
        'table',
        'text',
        'thead',
        'tbody',
        'tspan',
        'td',
        'th',
        'tr',
        'u',
        'ul',
        '#text'
    ];

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Filter an object of SVG or HTML attributes against the allow list.
     *
     * @static
     *
     * @function Highcharts.AST#filterUserAttributes
     *
     * @param {Highcharts.SVGAttributes} attributes The attributes to filter
     *
     * @return {Highcharts.SVGAttributes}
     * The filtered attributes
     */
    public static filterUserAttributes(
        attributes: SVGAttributes
    ): SVGAttributes {
        objectEach(attributes, (val, key): void => {
            let valid = true;
            if (AST.allowedAttributes.indexOf(key) === -1) {
                valid = false;
            }
            if (
                ['background', 'dynsrc', 'href', 'lowsrc', 'src']
                    .indexOf(key) !== -1
            ) {
                valid = isString(val) && AST.allowedReferences.some(
                    (ref): boolean => val.indexOf(ref) === 0
                );
            }
            if (!valid) {
                error(`Highcharts warning: Invalid attribute '${key}' in config`);
                delete attributes[key];
            }
        });
        return attributes;
    }

    /**
     * Utility function to set html content for an element by passing in a
     * markup string. The markup is safely parsed by the AST class to avoid
     * XSS vulnerabilities. This function should be used instead of setting
     * `innerHTML` in all cases where the content is not fully trusted.
     *
     * @static
     * @function Highcharts.AST#setElementHTML
     *
     * @param {SVGDOMElement|HTMLDOMElement} el
     * Node to set content of.
     *
     * @param {string} html
     * Markup string
     */
    public static setElementHTML(el: Element, html: string): void {
        el.innerHTML = ''; // Clear previous
        if (html) {
            const ast = new AST(html);
            ast.addToDOM(el);
        }
    }

    /* *
     *
     *  Constructor
     *
     * */

    // Construct an AST from HTML markup, or wrap an array of existing AST nodes
    constructor(source: (string|Array<AST.Node>)) {
        this.nodes = typeof source === 'string' ?
            this.parseMarkup(source) : source;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * List of the nodes of this tree, can be modified before adding the tree to
     * the DOM.
     */
    public nodes: Array<AST.Node>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Add the tree defined as a hierarchical JS structure to the DOM
     *
     * @function Highcharts.AST#addToDOM
     *
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} parent
     * The node where it should be added
     *
     * @return {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement}
     * The inserted node.
     */
    public addToDOM(
        parent: Element
    ): HTMLElement|SVGElement {

        /**
         * @private
         * @param {Highcharts.ASTNode} subtree - HTML/SVG definition
         * @param {Element} [subParent] - parent node
         * @return {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement} The inserted node.
         */
        function recurse(
            subtree: (AST.Node|Array<AST.Node>),
            subParent: Element
        ): SVGElement|HTMLElement {
            let ret: any;

            splat(subtree).forEach(function (
                item: AST.Node
            ): void {
                const tagName = item.tagName;
                const textNode = item.textContent ?
                    H.doc.createTextNode(item.textContent) :
                    void 0;
                let node: Text|Element|undefined;

                if (tagName) {
                    if (tagName === '#text') {
                        node = textNode;

                    } else if (AST.allowedTags.indexOf(tagName) !== -1) {
                        const NS = tagName === 'svg' ?
                            SVG_NS :
                            (subParent.namespaceURI || SVG_NS);

                        const element = H.doc.createElementNS(NS, tagName);
                        const attributes = item.attributes || {};

                        // Apply attributes from root of AST node, legacy from
                        // from before TextBuilder
                        objectEach(item, function (val, key): void {
                            if (
                                key !== 'tagName' &&
                                key !== 'attributes' &&
                                key !== 'children' &&
                                key !== 'textContent'
                            ) {
                                (attributes as any)[key] = val;
                            }
                        });
                        attr(
                            element as any,
                            AST.filterUserAttributes(attributes)
                        );

                        // Add text content
                        if (textNode) {
                            element.appendChild(textNode);
                        }

                        // Recurse
                        recurse(item.children || [], element);
                        node = element;

                    } else {
                        error(`Highcharts warning: Invalid tagName '${tagName}' in config`);
                    }
                }

                // Add to the tree
                if (node) {
                    subParent.appendChild(node);
                }

                ret = node;
            });

            // Return last node added (on top level it's the only one)
            return ret;
        }

        return recurse(this.nodes, parent);
    }

    /**
     * Parse HTML/SVG markup into AST Node objects. Used internally from the
     * constructor.
     *
     * @private
     *
     * @function Highcharts.AST#getNodesFromMarkup
     *
     * @param {string} markup The markup string.
     *
     * @return {Array<Highcharts.ASTNode>} The parsed nodes.
     */
    private parseMarkup(markup: string): Array<AST.Node> {
        interface Attribute {
            name: (keyof SVGAttributes|keyof HTMLAttributes);
            value: string;
        }

        const nodes: Array<AST.Node> = [];

        markup = markup.trim();

        let doc;
        let body;
        if (hasValidDOMParser) {
            doc = new DOMParser().parseFromString(markup, 'text/html');
        } else {
            body = createElement('div');
            body.innerHTML = markup;
            doc = { body };
        }

        const appendChildNodes = (
            node: ChildNode,
            addTo: Array<AST.Node>
        ): void => {
            const tagName = node.nodeName.toLowerCase();

            // Add allowed tags
            const astNode: AST.Node = {
                tagName
            };
            if (tagName === '#text') {
                const textContent = node.textContent || '';

                // Leading whitespace text node, don't append it to the AST
                if (nodes.length === 0 && /^[\s]*$/.test(textContent)) {
                    return;
                }

                astNode.textContent = textContent;
            }
            const parsedAttributes = (node as any).attributes;

            // Add attributes
            if (parsedAttributes) {
                const attributes: HTMLAttributes&SVGAttributes = {};
                [].forEach.call(parsedAttributes, (attrib: Attribute): void => {
                    attributes[attrib.name] = attrib.value;
                });
                astNode.attributes = attributes;
            }

            // Handle children
            if (node.childNodes.length) {
                const children: Array<AST.Node> = [];
                [].forEach.call(
                    node.childNodes,
                    (childNode: ChildNode): void => {
                        appendChildNodes(childNode, children);
                    }
                );
                if (children.length) {
                    astNode.children = children;
                }
            }

            addTo.push(astNode);
        };

        [].forEach.call(
            doc.body.childNodes,
            (childNode): void => appendChildNodes(childNode, nodes)
        );

        if (body) {
            discardElement(body);
        }

        return nodes;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace AST {

    /* *
     *
     *  Declarations
     *
     * */

    export interface Node {
        attributes?: (HTMLAttributes&SVGAttributes);
        children?: Array<Node>;
        tagName?: string;
        textContent?: string;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default AST;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Serialized form of an SVG/HTML definition, including children.
 *
 * @interface Highcharts.ASTNode
 *//**
 * @name Highcharts.ASTNode#attributes
 * @type {Highcharts.SVGAttributes|undefined}
 *//**
 * @name Highcharts.ASTNode#children
 * @type {Array<Highcharts.ASTNode>|undefined}
 *//**
 * @name Highcharts.ASTNode#tagName
 * @type {string|undefined}
 *//**
 * @name Highcharts.ASTNode#textContent
 * @type {string|undefined}
 */

(''); // keeps doclets above in file
