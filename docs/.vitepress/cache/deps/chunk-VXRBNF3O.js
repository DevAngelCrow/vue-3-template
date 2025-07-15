import {
  s
} from "./chunk-7BTXCNCE.js";

// node_modules/@primeuix/utils/dist/object/index.mjs
var oe = Object.defineProperty;
var K = Object.getOwnPropertySymbols;
var ue = Object.prototype.hasOwnProperty;
var fe = Object.prototype.propertyIsEnumerable;
var N = (e, t2, n) => t2 in e ? oe(e, t2, { enumerable: true, configurable: true, writable: true, value: n }) : e[t2] = n;
var d = (e, t2) => {
  for (var n in t2 || (t2 = {})) ue.call(t2, n) && N(e, n, t2[n]);
  if (K) for (var n of K(t2)) fe.call(t2, n) && N(e, n, t2[n]);
  return e;
};
function a(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function x(e, t2, n, r = 1) {
  let o = -1, u = a(e), f2 = a(t2);
  return u && f2 ? o = 0 : u ? o = r : f2 ? o = -r : typeof e == "string" && typeof t2 == "string" ? o = n(e, t2) : o = e < t2 ? -1 : e > t2 ? 1 : 0, o;
}
function R(e, t2, n = /* @__PURE__ */ new WeakSet()) {
  if (e === t2) return true;
  if (!e || !t2 || typeof e != "object" || typeof t2 != "object" || n.has(e) || n.has(t2)) return false;
  n.add(e).add(t2);
  let r = Array.isArray(e), o = Array.isArray(t2), u, f2, h2;
  if (r && o) {
    if (f2 = e.length, f2 != t2.length) return false;
    for (u = f2; u-- !== 0; ) if (!R(e[u], t2[u], n)) return false;
    return true;
  }
  if (r != o) return false;
  let A3 = e instanceof Date, S3 = t2 instanceof Date;
  if (A3 != S3) return false;
  if (A3 && S3) return e.getTime() == t2.getTime();
  let I2 = e instanceof RegExp, L = t2 instanceof RegExp;
  if (I2 != L) return false;
  if (I2 && L) return e.toString() == t2.toString();
  let O3 = Object.keys(e);
  if (f2 = O3.length, f2 !== Object.keys(t2).length) return false;
  for (u = f2; u-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(t2, O3[u])) return false;
  for (u = f2; u-- !== 0; ) if (h2 = O3[u], !R(e[h2], t2[h2], n)) return false;
  return true;
}
function y(e, t2) {
  return R(e, t2);
}
function l(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function s2(e) {
  return !a(e);
}
function c(e, t2) {
  if (!e || !t2) return null;
  try {
    let n = e[t2];
    if (s2(n)) return n;
  } catch (n) {
  }
  if (Object.keys(e).length) {
    if (l(t2)) return t2(e);
    if (t2.indexOf(".") === -1) return e[t2];
    {
      let n = t2.split("."), r = e;
      for (let o = 0, u = n.length; o < u; ++o) {
        if (r == null) return null;
        r = r[n[o]];
      }
      return r;
    }
  }
  return null;
}
function k(e, t2, n) {
  return n ? c(e, n) === c(t2, n) : y(e, t2);
}
function B(e, t2) {
  if (e != null && t2 && t2.length) {
    for (let n of t2) if (k(e, n)) return true;
  }
  return false;
}
function i(e, t2 = true) {
  return e instanceof Object && e.constructor === Object && (t2 || Object.keys(e).length !== 0);
}
function $(e = {}, t2 = {}) {
  let n = d({}, e);
  return Object.keys(t2).forEach((r) => {
    let o = r;
    i(t2[o]) && o in e && i(e[o]) ? n[o] = $(e[o], t2[o]) : n[o] = t2[o];
  }), n;
}
function w(...e) {
  return e.reduce((t2, n, r) => r === 0 ? n : $(t2, n), {});
}
function C(e, t2) {
  let n = -1;
  if (t2) {
    for (let r = 0; r < t2.length; r++) if (t2[r] === e) {
      n = r;
      break;
    }
  }
  return n;
}
function q(e, t2) {
  let n;
  if (s2(e)) try {
    n = e.findLast(t2);
  } catch (r) {
    n = [...e].reverse().find(t2);
  }
  return n;
}
function M(e, t2) {
  let n = -1;
  if (s2(e)) try {
    n = e.findLastIndex(t2);
  } catch (r) {
    n = e.lastIndexOf([...e].reverse().find(t2));
  }
  return n;
}
function m(e, ...t2) {
  return l(e) ? e(...t2) : e;
}
function p(e, t2 = true) {
  return typeof e == "string" && (t2 || e !== "");
}
function g(e) {
  return p(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function F(e, t2 = "", n = {}) {
  let r = g(t2).split("."), o = r.shift();
  if (o) {
    if (i(e)) {
      let u = Object.keys(e).find((f2) => g(f2) === o) || "";
      return F(m(e[u], n), r.join("."), n);
    }
    return;
  }
  return m(e, n);
}
function b(e, t2 = true) {
  return Array.isArray(e) && (t2 || e.length !== 0);
}
function _(e) {
  return s2(e) && !isNaN(e);
}
function j(e = "") {
  return s2(e) && e.length === 1 && !!e.match(/\S| /);
}
function W() {
  return new Intl.Collator(void 0, { numeric: true }).compare;
}
function z(e, t2) {
  if (t2) {
    let n = t2.test(e);
    return t2.lastIndex = 0, n;
  }
  return false;
}
function U(...e) {
  return w(...e);
}
function G(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function Y(e) {
  if (e && /[\xC0-\xFF\u0100-\u017E]/.test(e)) {
    let n = { A: /[\xC0-\xC5\u0100\u0102\u0104]/g, AE: /[\xC6]/g, C: /[\xC7\u0106\u0108\u010A\u010C]/g, D: /[\xD0\u010E\u0110]/g, E: /[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g, G: /[\u011C\u011E\u0120\u0122]/g, H: /[\u0124\u0126]/g, I: /[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g, IJ: /[\u0132]/g, J: /[\u0134]/g, K: /[\u0136]/g, L: /[\u0139\u013B\u013D\u013F\u0141]/g, N: /[\xD1\u0143\u0145\u0147\u014A]/g, O: /[\xD2-\xD6\xD8\u014C\u014E\u0150]/g, OE: /[\u0152]/g, R: /[\u0154\u0156\u0158]/g, S: /[\u015A\u015C\u015E\u0160]/g, T: /[\u0162\u0164\u0166]/g, U: /[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g, W: /[\u0174]/g, Y: /[\xDD\u0176\u0178]/g, Z: /[\u0179\u017B\u017D]/g, a: /[\xE0-\xE5\u0101\u0103\u0105]/g, ae: /[\xE6]/g, c: /[\xE7\u0107\u0109\u010B\u010D]/g, d: /[\u010F\u0111]/g, e: /[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g, g: /[\u011D\u011F\u0121\u0123]/g, i: /[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g, ij: /[\u0133]/g, j: /[\u0135]/g, k: /[\u0137,\u0138]/g, l: /[\u013A\u013C\u013E\u0140\u0142]/g, n: /[\xF1\u0144\u0146\u0148\u014B]/g, p: /[\xFE]/g, o: /[\xF2-\xF6\xF8\u014D\u014F\u0151]/g, oe: /[\u0153]/g, r: /[\u0155\u0157\u0159]/g, s: /[\u015B\u015D\u015F\u0161]/g, t: /[\u0163\u0165\u0167]/g, u: /[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g, w: /[\u0175]/g, y: /[\xFD\xFF\u0177]/g, z: /[\u017A\u017C\u017E]/g };
    for (let r in n) e = e.replace(n[r], r);
  }
  return e;
}
function Q(e, t2, n) {
  e && t2 !== n && (n >= e.length && (n %= e.length, t2 %= e.length), e.splice(n, 0, e.splice(t2, 1)[0]));
}
function X(e, t2, n = 1, r, o = 1) {
  let u = x(e, t2, r, n), f2 = n;
  return (a(e) || a(t2)) && (f2 = o === 1 ? n : o), f2 * u;
}
function v(e) {
  return p(e, false) ? e[0].toUpperCase() + e.slice(1) : e;
}
function ee(e) {
  return p(e) ? e.replace(/(_)/g, "-").replace(/[A-Z]/g, (t2, n) => n === 0 ? t2 : "-" + t2.toLowerCase()).toLowerCase() : e;
}

// node_modules/@primeuix/utils/dist/classnames/index.mjs
function f(...e) {
  if (e) {
    let t2 = [];
    for (let i2 = 0; i2 < e.length; i2++) {
      let n = e[i2];
      if (!n) continue;
      let s4 = typeof n;
      if (s4 === "string" || s4 === "number") t2.push(n);
      else if (s4 === "object") {
        let c3 = Array.isArray(n) ? [f(...n)] : Object.entries(n).map(([r, o]) => o ? r : void 0);
        t2 = c3.length ? t2.concat(c3.filter((r) => !!r)) : t2;
      }
    }
    return t2.join(" ").trim();
  }
}

// node_modules/@primeuix/utils/dist/dom/index.mjs
function R2(t2, e) {
  return t2 ? t2.classList ? t2.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t2.className) : false;
}
function W2(t2, e) {
  if (t2 && e) {
    let o = (n) => {
      R2(t2, n) || (t2.classList ? t2.classList.add(n) : t2.className += " " + n);
    };
    [e].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(o));
  }
}
function B2() {
  return window.innerWidth - document.documentElement.offsetWidth;
}
function st(t2) {
  typeof t2 == "string" ? W2(document.body, t2 || "p-overflow-hidden") : (t2 != null && t2.variableName && document.body.style.setProperty(t2.variableName, B2() + "px"), W2(document.body, (t2 == null ? void 0 : t2.className) || "p-overflow-hidden"));
}
function F2(t2) {
  if (t2) {
    let e = document.createElement("a");
    if (e.download !== void 0) {
      let { name: o, src: n } = t2;
      return e.setAttribute("href", n), e.setAttribute("download", o), e.style.display = "none", document.body.appendChild(e), e.click(), document.body.removeChild(e), true;
    }
  }
  return false;
}
function at(t2, e) {
  let o = new Blob([t2], { type: "application/csv;charset=utf-8;" });
  window.navigator.msSaveOrOpenBlob ? navigator.msSaveOrOpenBlob(o, e + ".csv") : F2({ name: e + ".csv", src: URL.createObjectURL(o) }) || (t2 = "data:text/csv;charset=utf-8," + t2, window.open(encodeURI(t2)));
}
function O(t2, e) {
  if (t2 && e) {
    let o = (n) => {
      t2.classList ? t2.classList.remove(n) : t2.className = t2.className.replace(new RegExp("(^|\\b)" + n.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [e].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(o));
  }
}
function dt(t2) {
  typeof t2 == "string" ? O(document.body, t2 || "p-overflow-hidden") : (t2 != null && t2.variableName && document.body.style.removeProperty(t2.variableName), O(document.body, (t2 == null ? void 0 : t2.className) || "p-overflow-hidden"));
}
function x2(t2) {
  for (let e of document == null ? void 0 : document.styleSheets) try {
    for (let o of e == null ? void 0 : e.cssRules) for (let n of o == null ? void 0 : o.style) if (t2.test(n)) return { name: n, value: o.style.getPropertyValue(n).trim() };
  } catch (o) {
  }
  return null;
}
function w2(t2) {
  let e = { width: 0, height: 0 };
  if (t2) {
    let [o, n] = [t2.style.visibility, t2.style.display];
    t2.style.visibility = "hidden", t2.style.display = "block", e.width = t2.offsetWidth, e.height = t2.offsetHeight, t2.style.display = n, t2.style.visibility = o;
  }
  return e;
}
function h() {
  let t2 = window, e = document, o = e.documentElement, n = e.getElementsByTagName("body")[0], r = t2.innerWidth || o.clientWidth || n.clientWidth, i2 = t2.innerHeight || o.clientHeight || n.clientHeight;
  return { width: r, height: i2 };
}
function E(t2) {
  return t2 ? Math.abs(t2.scrollLeft) : 0;
}
function k2() {
  let t2 = document.documentElement;
  return (window.pageXOffset || E(t2)) - (t2.clientLeft || 0);
}
function $2() {
  let t2 = document.documentElement;
  return (window.pageYOffset || t2.scrollTop) - (t2.clientTop || 0);
}
function V(t2) {
  return t2 ? getComputedStyle(t2).direction === "rtl" : false;
}
function D(t2, e, o = true) {
  var n, r, i2, l2;
  if (t2) {
    let d3 = t2.offsetParent ? { width: t2.offsetWidth, height: t2.offsetHeight } : w2(t2), s4 = d3.height, a2 = d3.width, u = e.offsetHeight, p2 = e.offsetWidth, f2 = e.getBoundingClientRect(), g4 = $2(), it = k2(), lt2 = h(), L, N2, ot = "top";
    f2.top + u + s4 > lt2.height ? (L = f2.top + g4 - s4, ot = "bottom", L < 0 && (L = g4)) : L = u + f2.top + g4, f2.left + a2 > lt2.width ? N2 = Math.max(0, f2.left + it + p2 - a2) : N2 = f2.left + it, V(t2) ? t2.style.insetInlineEnd = N2 + "px" : t2.style.insetInlineStart = N2 + "px", t2.style.top = L + "px", t2.style.transformOrigin = ot, o && (t2.style.marginTop = ot === "bottom" ? `calc(${(r = (n = x2(/-anchor-gutter$/)) == null ? void 0 : n.value) != null ? r : "2px"} * -1)` : (l2 = (i2 = x2(/-anchor-gutter$/)) == null ? void 0 : i2.value) != null ? l2 : "");
  }
}
function S(t2, e) {
  t2 && (typeof e == "string" ? t2.style.cssText = e : Object.entries(e || {}).forEach(([o, n]) => t2.style[o] = n));
}
function v2(t2, e) {
  if (t2 instanceof HTMLElement) {
    let o = t2.offsetWidth;
    if (e) {
      let n = getComputedStyle(t2);
      o += parseFloat(n.marginLeft) + parseFloat(n.marginRight);
    }
    return o;
  }
  return 0;
}
function I(t2, e, o = true, n = void 0) {
  var r;
  if (t2) {
    let i2 = t2.offsetParent ? { width: t2.offsetWidth, height: t2.offsetHeight } : w2(t2), l2 = e.offsetHeight, d3 = e.getBoundingClientRect(), s4 = h(), a2, u, p2 = n != null ? n : "top";
    if (!n && d3.top + l2 + i2.height > s4.height ? (a2 = -1 * i2.height, p2 = "bottom", d3.top + a2 < 0 && (a2 = -1 * d3.top)) : a2 = l2, i2.width > s4.width ? u = d3.left * -1 : d3.left + i2.width > s4.width ? u = (d3.left + i2.width - s4.width) * -1 : u = 0, t2.style.top = a2 + "px", t2.style.insetInlineStart = u + "px", t2.style.transformOrigin = p2, o) {
      let f2 = (r = x2(/-anchor-gutter$/)) == null ? void 0 : r.value;
      t2.style.marginTop = p2 === "bottom" ? `calc(${f2 != null ? f2 : "2px"} * -1)` : f2 != null ? f2 : "";
    }
  }
}
function y2(t2) {
  if (t2) {
    let e = t2.parentNode;
    return e && e instanceof ShadowRoot && e.host && (e = e.host), e;
  }
  return null;
}
function T(t2) {
  return !!(t2 !== null && typeof t2 != "undefined" && t2.nodeName && y2(t2));
}
function c2(t2) {
  return typeof Element != "undefined" ? t2 instanceof Element : t2 !== null && typeof t2 == "object" && t2.nodeType === 1 && typeof t2.nodeName == "string";
}
var rt;
function P(t2) {
  if (t2) {
    let e = getComputedStyle(t2);
    return t2.offsetWidth - t2.clientWidth - parseFloat(e.borderLeftWidth) - parseFloat(e.borderRightWidth);
  } else {
    if (rt != null) return rt;
    let e = document.createElement("div");
    S(e, { width: "100px", height: "100px", overflow: "scroll", position: "absolute", top: "-9999px" }), document.body.appendChild(e);
    let o = e.offsetWidth - e.clientWidth;
    return document.body.removeChild(e), rt = o, o;
  }
}
function pt() {
  if (window.getSelection) {
    let t2 = window.getSelection() || {};
    t2.empty ? t2.empty() : t2.removeAllRanges && t2.rangeCount > 0 && t2.getRangeAt(0).getClientRects().length > 0 && t2.removeAllRanges();
  }
}
function A(t2, e = {}) {
  if (c2(t2)) {
    let o = (n, r) => {
      var l2, d3;
      let i2 = (l2 = t2 == null ? void 0 : t2.$attrs) != null && l2[n] ? [(d3 = t2 == null ? void 0 : t2.$attrs) == null ? void 0 : d3[n]] : [];
      return [r].flat().reduce((s4, a2) => {
        if (a2 != null) {
          let u = typeof a2;
          if (u === "string" || u === "number") s4.push(a2);
          else if (u === "object") {
            let p2 = Array.isArray(a2) ? o(n, a2) : Object.entries(a2).map(([f2, g4]) => n === "style" && (g4 || g4 === 0) ? `${f2.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${g4}` : g4 ? f2 : void 0);
            s4 = p2.length ? s4.concat(p2.filter((f2) => !!f2)) : s4;
          }
        }
        return s4;
      }, i2);
    };
    Object.entries(e).forEach(([n, r]) => {
      if (r != null) {
        let i2 = n.match(/^on(.+)/);
        i2 ? t2.addEventListener(i2[1].toLowerCase(), r) : n === "p-bind" || n === "pBind" ? A(t2, r) : (r = n === "class" ? [...new Set(o("class", r))].join(" ").trim() : n === "style" ? o("style", r).join(";").trim() : r, (t2.$attrs = t2.$attrs || {}) && (t2.$attrs[n] = r), t2.setAttribute(n, r));
      }
    });
  }
}
function U2(t2, e = {}, ...o) {
  if (t2) {
    let n = document.createElement(t2);
    return A(n, e), n.append(...o), n;
  }
}
function q2(t2, e = {}) {
  return t2 ? `<style${Object.entries(e).reduce((o, [n, r]) => o + ` ${n}="${r}"`, "")}>${t2}</style>` : "";
}
function ht(t2, e) {
  if (t2) {
    t2.style.opacity = "0";
    let o = +/* @__PURE__ */ new Date(), n = "0", r = function() {
      n = `${+t2.style.opacity + ((/* @__PURE__ */ new Date()).getTime() - o) / e}`, t2.style.opacity = n, o = +/* @__PURE__ */ new Date(), +n < 1 && ("requestAnimationFrame" in window ? requestAnimationFrame(r) : setTimeout(r, 16));
    };
    r();
  }
}
function Y2(t2, e) {
  return c2(t2) ? Array.from(t2.querySelectorAll(e)) : [];
}
function z2(t2, e) {
  return c2(t2) ? t2.matches(e) ? t2 : t2.querySelector(e) : null;
}
function bt(t2, e) {
  t2 && document.activeElement !== t2 && t2.focus(e);
}
function Q2(t2, e) {
  if (c2(t2)) {
    let o = t2.getAttribute(e);
    return isNaN(o) ? o === "true" || o === "false" ? o === "true" : o : +o;
  }
}
function b2(t2, e = "") {
  let o = Y2(t2, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e}`), n = [];
  for (let r of o) getComputedStyle(r).display != "none" && getComputedStyle(r).visibility != "hidden" && n.push(r);
  return n;
}
function vt(t2, e) {
  let o = b2(t2, e);
  return o.length > 0 ? o[0] : null;
}
function Tt(t2) {
  if (t2) {
    let e = t2.offsetHeight, o = getComputedStyle(t2);
    return e -= parseFloat(o.paddingTop) + parseFloat(o.paddingBottom) + parseFloat(o.borderTopWidth) + parseFloat(o.borderBottomWidth), e;
  }
  return 0;
}
function G2(t2) {
  if (t2) {
    let [e, o] = [t2.style.visibility, t2.style.display];
    t2.style.visibility = "hidden", t2.style.display = "block";
    let n = t2.offsetHeight;
    return t2.style.display = o, t2.style.visibility = e, n;
  }
  return 0;
}
function J(t2) {
  if (t2) {
    let [e, o] = [t2.style.visibility, t2.style.display];
    t2.style.visibility = "hidden", t2.style.display = "block";
    let n = t2.offsetWidth;
    return t2.style.display = o, t2.style.visibility = e, n;
  }
  return 0;
}
function Ht(t2) {
  var e;
  if (t2) {
    let o = (e = y2(t2)) == null ? void 0 : e.childNodes, n = 0;
    if (o) for (let r = 0; r < o.length; r++) {
      if (o[r] === t2) return n;
      o[r].nodeType === 1 && n++;
    }
  }
  return -1;
}
function Lt(t2, e) {
  let o = b2(t2, e);
  return o.length > 0 ? o[o.length - 1] : null;
}
function Wt(t2, e) {
  let o = t2.nextElementSibling;
  for (; o; ) {
    if (o.matches(e)) return o;
    o = o.nextElementSibling;
  }
  return null;
}
function K2(t2) {
  if (t2) {
    let e = t2.getBoundingClientRect();
    return { top: e.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: e.left + (window.pageXOffset || E(document.documentElement) || E(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function C2(t2, e) {
  if (t2) {
    let o = t2.offsetHeight;
    if (e) {
      let n = getComputedStyle(t2);
      o += parseFloat(n.marginTop) + parseFloat(n.marginBottom);
    }
    return o;
  }
  return 0;
}
function M2(t2, e = []) {
  let o = y2(t2);
  return o === null ? e : M2(o, e.concat([o]));
}
function Pt(t2, e) {
  let o = t2.previousElementSibling;
  for (; o; ) {
    if (o.matches(e)) return o;
    o = o.previousElementSibling;
  }
  return null;
}
function At(t2) {
  let e = [];
  if (t2) {
    let o = M2(t2), n = /(auto|scroll)/, r = (i2) => {
      try {
        let l2 = window.getComputedStyle(i2, null);
        return n.test(l2.getPropertyValue("overflow")) || n.test(l2.getPropertyValue("overflowX")) || n.test(l2.getPropertyValue("overflowY"));
      } catch (l2) {
        return false;
      }
    };
    for (let i2 of o) {
      let l2 = i2.nodeType === 1 && i2.dataset.scrollselectors;
      if (l2) {
        let d3 = l2.split(",");
        for (let s4 of d3) {
          let a2 = z2(i2, s4);
          a2 && r(a2) && e.push(a2);
        }
      }
      i2.nodeType !== 9 && r(i2) && e.push(i2);
    }
  }
  return e;
}
function Mt() {
  if (window.getSelection) return window.getSelection().toString();
  if (document.getSelection) return document.getSelection().toString();
}
function Nt() {
  return navigator.userAgent;
}
function Rt(t2) {
  if (t2) {
    let e = t2.offsetWidth, o = getComputedStyle(t2);
    return e -= parseFloat(o.paddingLeft) + parseFloat(o.paddingRight) + parseFloat(o.borderLeftWidth) + parseFloat(o.borderRightWidth), e;
  }
  return 0;
}
function Bt(t2) {
  if (t2) {
    let e = getComputedStyle(t2);
    return parseFloat(e.getPropertyValue("animation-duration") || "0") > 0;
  }
  return false;
}
function kt(t2, e, o) {
  let n = t2[e];
  typeof n == "function" && n.apply(t2, o != null ? o : []);
}
function $t() {
  return /(android)/i.test(navigator.userAgent);
}
function _2(t2, e, o) {
  return c2(t2) ? Q2(t2, e) === o : false;
}
function Dt(t2) {
  if (t2) {
    let e = t2.nodeName, o = t2.parentElement && t2.parentElement.nodeName;
    return e === "INPUT" || e === "TEXTAREA" || e === "BUTTON" || e === "A" || o === "INPUT" || o === "TEXTAREA" || o === "BUTTON" || o === "A" || !!t2.closest(".p-button, .p-checkbox, .p-radiobutton");
  }
  return false;
}
function tt() {
  return !!(typeof window != "undefined" && window.document && window.document.createElement);
}
function It(t2, e = "") {
  return c2(t2) ? t2.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e}`) : false;
}
function et(t2) {
  return !!(t2 && t2.offsetParent != null);
}
function Yt() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function zt(t2, e) {
  var o, n;
  if (t2) {
    let r = t2.parentElement, i2 = K2(r), l2 = h(), d3 = t2.offsetParent ? t2.offsetWidth : J(t2), s4 = t2.offsetParent ? t2.offsetHeight : G2(t2), a2 = v2((o = r == null ? void 0 : r.children) == null ? void 0 : o[0]), u = C2((n = r == null ? void 0 : r.children) == null ? void 0 : n[0]), p2 = "", f2 = "";
    i2.left + a2 + d3 > l2.width - P() ? i2.left < d3 ? e % 2 === 1 ? p2 = i2.left ? "-" + i2.left + "px" : "100%" : e % 2 === 0 && (p2 = l2.width - d3 - P() + "px") : p2 = "-100%" : p2 = "100%", t2.getBoundingClientRect().top + u + s4 > l2.height ? f2 = `-${s4 - u}px` : f2 = "0px", t2.style.top = f2, t2.style.insetInlineStart = p2;
  }
}
function Jt(t2, e) {
  let o = getComputedStyle(t2).getPropertyValue("borderTopWidth"), n = o ? parseFloat(o) : 0, r = getComputedStyle(t2).getPropertyValue("paddingTop"), i2 = r ? parseFloat(r) : 0, l2 = t2.getBoundingClientRect(), s4 = e.getBoundingClientRect().top + document.body.scrollTop - (l2.top + document.body.scrollTop) - n - i2, a2 = t2.scrollTop, u = t2.clientHeight, p2 = C2(e);
  s4 < 0 ? t2.scrollTop = a2 + s4 : s4 + p2 > u && (t2.scrollTop = a2 + s4 - u + p2);
}
function Kt(t2, e = "", o) {
  c2(t2) && o !== null && o !== void 0 && t2.setAttribute(e, o);
}
function _t(t2, e, o = null, n) {
  var r;
  e && ((r = t2 == null ? void 0 : t2.style) == null || r.setProperty(e, o, n));
}

// node_modules/@primeuix/utils/dist/uuid/index.mjs
var t = {};
function s3(n = "pui_id_") {
  return Object.hasOwn(t, n) || (t[n] = 0), t[n]++, `${n}${t[n]}`;
}

// node_modules/@primeuix/utils/dist/zindex/index.mjs
function g2() {
  let r = [], i2 = (e, n, t2 = 999) => {
    let s4 = u(e, n, t2), o = s4.value + (s4.key === e ? 0 : t2) + 1;
    return r.push({ key: e, value: o }), o;
  }, d3 = (e) => {
    r = r.filter((n) => n.value !== e);
  }, a2 = (e, n) => u(e, n).value, u = (e, n, t2 = 0) => [...r].reverse().find((s4) => n ? true : s4.key === e) || { key: e, value: t2 }, l2 = (e) => e && parseInt(e.style.zIndex, 10) || 0;
  return { get: l2, set: (e, n, t2) => {
    n && (n.style.zIndex = String(i2(e, true, t2)));
  }, clear: (e) => {
    e && (d3(l2(e)), e.style.zIndex = "");
  }, getCurrent: (e) => a2(e, true) };
}
var x3 = g2();

// node_modules/@primeuix/styled/dist/index.mjs
var Qe = Object.defineProperty;
var Ye = Object.defineProperties;
var et2 = Object.getOwnPropertyDescriptors;
var F3 = Object.getOwnPropertySymbols;
var fe2 = Object.prototype.hasOwnProperty;
var ye = Object.prototype.propertyIsEnumerable;
var he = (e, t2, r) => t2 in e ? Qe(e, t2, { enumerable: true, configurable: true, writable: true, value: r }) : e[t2] = r;
var d2 = (e, t2) => {
  for (var r in t2 || (t2 = {})) fe2.call(t2, r) && he(e, r, t2[r]);
  if (F3) for (var r of F3(t2)) ye.call(t2, r) && he(e, r, t2[r]);
  return e;
};
var _3 = (e, t2) => Ye(e, et2(t2));
var b3 = (e, t2) => {
  var r = {};
  for (var s4 in e) fe2.call(e, s4) && t2.indexOf(s4) < 0 && (r[s4] = e[s4]);
  if (e != null && F3) for (var s4 of F3(e)) t2.indexOf(s4) < 0 && ye.call(e, s4) && (r[s4] = e[s4]);
  return r;
};
function Se(...e) {
  return w(...e);
}
var st2 = s();
var R3 = st2;
var v3 = /{([^}]*)}/g;
var lt = /(\d+\s+[\+\-\*\/]\s+\d+)/g;
var ct = /var\([^)]+\)/g;
function Vt(e) {
  return p(e) ? e.replace(/[A-Z]/g, (t2, r) => r === 0 ? t2 : "." + t2.toLowerCase()).toLowerCase() : e;
}
function Et(e, t2) {
  b(e) ? e.push(...t2 || []) : i(e) && Object.assign(e, t2);
}
function ke(e) {
  return i(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function Lt2(e, t2 = "") {
  return ["opacity", "z-index", "line-height", "font-weight", "flex", "flex-grow", "flex-shrink", "order"].some((s4) => t2.endsWith(s4)) ? e : `${e}`.trim().split(" ").map((a2) => _(a2) ? `${a2}px` : a2).join(" ");
}
function mt(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function Q3(e = "", t2 = "") {
  return mt(`${p(e, false) && p(t2, false) ? `${e}-` : e}${t2}`);
}
function ne(e = "", t2 = "") {
  return `--${Q3(e, t2)}`;
}
function dt2(e = "") {
  let t2 = (e.match(/{/g) || []).length, r = (e.match(/}/g) || []).length;
  return (t2 + r) % 2 !== 0;
}
function Y3(e, t2 = "", r = "", s4 = [], o) {
  if (p(e)) {
    let a2 = e.trim();
    if (dt2(a2)) return;
    if (z(a2, v3)) {
      let n = a2.replaceAll(v3, (l2) => {
        let c3 = l2.replace(/{|}/g, "").split(".").filter((m2) => !s4.some((u) => z(m2, u)));
        return `var(${ne(r, ee(c3.join("-")))}${s2(o) ? `, ${o}` : ""})`;
      });
      return z(n.replace(ct, "0"), lt) ? `calc(${n})` : n;
    }
    return a2;
  } else if (_(e)) return e;
}
function Mt2(e = {}, t2) {
  if (p(t2)) {
    let r = t2.trim();
    return z(r, v3) ? r.replaceAll(v3, (s4) => F(e, s4.replace(/{|}/g, ""))) : r;
  } else if (_(t2)) return t2;
}
function _e(e, t2, r) {
  p(t2, false) && e.push(`${t2}:${r};`);
}
function T2(e, t2) {
  return e ? `${e}{${t2}}` : "";
}
function oe2(e, t2) {
  if (e.indexOf("dt(") === -1) return e;
  function r(n, l2) {
    let i2 = [], c3 = 0, m2 = "", u = null, p2 = 0;
    for (; c3 <= n.length; ) {
      let h2 = n[c3];
      if ((h2 === '"' || h2 === "'" || h2 === "`") && n[c3 - 1] !== "\\" && (u = u === h2 ? null : h2), !u && (h2 === "(" && p2++, h2 === ")" && p2--, (h2 === "," || c3 === n.length) && p2 === 0)) {
        let y3 = m2.trim();
        y3.startsWith("dt(") ? i2.push(oe2(y3, l2)) : i2.push(s4(y3)), m2 = "", c3++;
        continue;
      }
      h2 !== void 0 && (m2 += h2), c3++;
    }
    return i2;
  }
  function s4(n) {
    let l2 = n[0];
    if ((l2 === '"' || l2 === "'" || l2 === "`") && n[n.length - 1] === l2) return n.slice(1, -1);
    let i2 = Number(n);
    return isNaN(i2) ? n : i2;
  }
  let o = [], a2 = [];
  for (let n = 0; n < e.length; n++) if (e[n] === "d" && e.slice(n, n + 3) === "dt(") a2.push(n), n += 2;
  else if (e[n] === ")" && a2.length > 0) {
    let l2 = a2.pop();
    a2.length === 0 && o.push([l2, n]);
  }
  if (!o.length) return e;
  for (let n = o.length - 1; n >= 0; n--) {
    let [l2, i2] = o[n], c3 = e.slice(l2 + 3, i2), m2 = r(c3, t2), u = t2(...m2);
    e = e.slice(0, l2) + u + e.slice(i2 + 1);
  }
  return e;
}
function be(e) {
  return e.length === 4 ? `#${e[1]}${e[1]}${e[2]}${e[2]}${e[3]}${e[3]}` : e;
}
function $e(e) {
  let t2 = parseInt(e.substring(1), 16), r = t2 >> 16 & 255, s4 = t2 >> 8 & 255, o = t2 & 255;
  return { r, g: s4, b: o };
}
function ut(e, t2, r) {
  return `#${e.toString(16).padStart(2, "0")}${t2.toString(16).padStart(2, "0")}${r.toString(16).padStart(2, "0")}`;
}
var A2 = (e, t2, r) => {
  e = be(e), t2 = be(t2);
  let a2 = (r / 100 * 2 - 1 + 1) / 2, n = 1 - a2, l2 = $e(e), i2 = $e(t2), c3 = Math.round(l2.r * a2 + i2.r * n), m2 = Math.round(l2.g * a2 + i2.g * n), u = Math.round(l2.b * a2 + i2.b * n);
  return ut(c3, m2, u);
};
var ae = (e, t2) => A2("#000000", e, t2);
var ie = (e, t2) => A2("#ffffff", e, t2);
var Re = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
var gt = (e) => {
  if (z(e, v3)) {
    let t2 = e.replace(/{|}/g, "");
    return Re.reduce((r, s4) => (r[s4] = `{${t2}.${s4}}`, r), {});
  }
  return typeof e == "string" ? Re.reduce((t2, r, s4) => (t2[r] = s4 <= 5 ? ie(e, (5 - s4) * 19) : ae(e, (s4 - 5) * 15), t2), {}) : e;
};
var tr = (e) => {
  var a2;
  let t2 = g3.getTheme(), r = le(t2, e, void 0, "variable"), s4 = (a2 = r == null ? void 0 : r.match(/--[\w-]+/g)) == null ? void 0 : a2[0], o = le(t2, e, void 0, "value");
  return { name: s4, variable: r, value: o };
};
var P2 = (...e) => le(g3.getTheme(), ...e);
var le = (e = {}, t2, r, s4) => {
  if (t2) {
    let { variable: o, options: a2 } = g3.defaults || {}, { prefix: n, transform: l2 } = (e == null ? void 0 : e.options) || a2 || {}, i2 = z(t2, v3) ? t2 : `{${t2}}`;
    return s4 === "value" || a(s4) && l2 === "strict" ? g3.getTokenValue(t2) : Y3(i2, void 0, n, [o.excludedKeyRegex], r);
  }
  return "";
};
function ar(e, ...t2) {
  if (e instanceof Array) {
    let r = e.reduce((s4, o, a2) => {
      var n;
      return s4 + o + ((n = m(t2[a2], { dt: P2 })) != null ? n : "");
    }, "");
    return oe2(r, P2);
  }
  return m(e, { dt: P2 });
}
var O2 = (e = {}) => {
  let { preset: t2, options: r } = e;
  return { preset(s4) {
    return t2 = t2 ? U(t2, s4) : s4, this;
  }, options(s4) {
    return r = r ? d2(d2({}, r), s4) : s4, this;
  }, primaryPalette(s4) {
    let { semantic: o } = t2 || {};
    return t2 = _3(d2({}, t2), { semantic: _3(d2({}, o), { primary: s4 }) }), this;
  }, surfacePalette(s4) {
    var i2, c3;
    let { semantic: o } = t2 || {}, a2 = s4 && Object.hasOwn(s4, "light") ? s4.light : s4, n = s4 && Object.hasOwn(s4, "dark") ? s4.dark : s4, l2 = { colorScheme: { light: d2(d2({}, (i2 = o == null ? void 0 : o.colorScheme) == null ? void 0 : i2.light), !!a2 && { surface: a2 }), dark: d2(d2({}, (c3 = o == null ? void 0 : o.colorScheme) == null ? void 0 : c3.dark), !!n && { surface: n }) } };
    return t2 = _3(d2({}, t2), { semantic: d2(d2({}, o), l2) }), this;
  }, define({ useDefaultPreset: s4 = false, useDefaultOptions: o = false } = {}) {
    return { preset: s4 ? g3.getPreset() : t2, options: o ? g3.getOptions() : r };
  }, update({ mergePresets: s4 = true, mergeOptions: o = true } = {}) {
    let a2 = { preset: s4 ? U(g3.getPreset(), t2) : t2, options: o ? d2(d2({}, g3.getOptions()), r) : r };
    return g3.setTheme(a2), a2;
  }, use(s4) {
    let o = this.define(s4);
    return g3.setTheme(o), o;
  } };
};
function ce(e, t2 = {}) {
  let r = g3.defaults.variable, { prefix: s4 = r.prefix, selector: o = r.selector, excludedKeyRegex: a2 = r.excludedKeyRegex } = t2, n = [], l2 = [], i2 = [{ node: e, path: s4 }];
  for (; i2.length; ) {
    let { node: m2, path: u } = i2.pop();
    for (let p2 in m2) {
      let h2 = m2[p2], y3 = ke(h2), x4 = z(p2, a2) ? Q3(u) : Q3(u, ee(p2));
      if (i(y3)) i2.push({ node: y3, path: x4 });
      else {
        let k3 = ne(x4), w3 = Y3(y3, x4, s4, [a2]);
        _e(l2, k3, w3);
        let $3 = x4;
        s4 && $3.startsWith(s4 + "-") && ($3 = $3.slice(s4.length + 1)), n.push($3.replace(/-/g, "."));
      }
    }
  }
  let c3 = l2.join("");
  return { value: l2, tokens: n, declarations: c3, css: T2(o, c3) };
}
var S2 = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
  return { type: "class", selector: e, matched: this.pattern.test(e.trim()) };
} }, attr: { pattern: /^\[(.*)\]$/, resolve(e) {
  return { type: "attr", selector: `:root${e}`, matched: this.pattern.test(e.trim()) };
} }, media: { pattern: /^@media (.*)$/, resolve(e) {
  return { type: "media", selector: e, matched: this.pattern.test(e.trim()) };
} }, system: { pattern: /^system$/, resolve(e) {
  return { type: "system", selector: "@media (prefers-color-scheme: dark)", matched: this.pattern.test(e.trim()) };
} }, custom: { resolve(e) {
  return { type: "custom", selector: e, matched: true };
} } }, resolve(e) {
  let t2 = Object.keys(this.rules).filter((r) => r !== "custom").map((r) => this.rules[r]);
  return [e].flat().map((r) => {
    var s4;
    return (s4 = t2.map((o) => o.resolve(r)).find((o) => o.matched)) != null ? s4 : this.rules.custom.resolve(r);
  });
} }, _toVariables(e, t2) {
  return ce(e, { prefix: t2 == null ? void 0 : t2.prefix });
}, getCommon({ name: e = "", theme: t2 = {}, params: r, set: s4, defaults: o }) {
  var w3, $3, j2, V2, D2, z3, E2;
  let { preset: a2, options: n } = t2, l2, i2, c3, m2, u, p2, h2;
  if (s2(a2) && n.transform !== "strict") {
    let { primitive: L, semantic: te, extend: re } = a2, y3 = te || {}, { colorScheme: K3 } = y3, M3 = b3(y3, ["colorScheme"]), N2 = re || {}, { colorScheme: X2 } = N2, B3 = b3(N2, ["colorScheme"]), x4 = K3 || {}, { dark: G3 } = x4, I2 = b3(x4, ["dark"]), k3 = X2 || {}, { dark: U3 } = k3, H = b3(k3, ["dark"]), W3 = s2(L) ? this._toVariables({ primitive: L }, n) : {}, q3 = s2(M3) ? this._toVariables({ semantic: M3 }, n) : {}, Z = s2(I2) ? this._toVariables({ light: I2 }, n) : {}, de = s2(G3) ? this._toVariables({ dark: G3 }, n) : {}, ue2 = s2(B3) ? this._toVariables({ semantic: B3 }, n) : {}, pe = s2(H) ? this._toVariables({ light: H }, n) : {}, ge = s2(U3) ? this._toVariables({ dark: U3 }, n) : {}, [Le, Me] = [(w3 = W3.declarations) != null ? w3 : "", W3.tokens], [Ae, je] = [($3 = q3.declarations) != null ? $3 : "", q3.tokens || []], [De, ze] = [(j2 = Z.declarations) != null ? j2 : "", Z.tokens || []], [Ke, Xe] = [(V2 = de.declarations) != null ? V2 : "", de.tokens || []], [Be, Ge] = [(D2 = ue2.declarations) != null ? D2 : "", ue2.tokens || []], [Ie, Ue] = [(z3 = pe.declarations) != null ? z3 : "", pe.tokens || []], [He, We] = [(E2 = ge.declarations) != null ? E2 : "", ge.tokens || []];
    l2 = this.transformCSS(e, Le, "light", "variable", n, s4, o), i2 = Me;
    let qe = this.transformCSS(e, `${Ae}${De}`, "light", "variable", n, s4, o), Ze = this.transformCSS(e, `${Ke}`, "dark", "variable", n, s4, o);
    c3 = `${qe}${Ze}`, m2 = [.../* @__PURE__ */ new Set([...je, ...ze, ...Xe])];
    let Fe = this.transformCSS(e, `${Be}${Ie}color-scheme:light`, "light", "variable", n, s4, o), Je = this.transformCSS(e, `${He}color-scheme:dark`, "dark", "variable", n, s4, o);
    u = `${Fe}${Je}`, p2 = [.../* @__PURE__ */ new Set([...Ge, ...Ue, ...We])], h2 = m(a2.css, { dt: P2 });
  }
  return { primitive: { css: l2, tokens: i2 }, semantic: { css: c3, tokens: m2 }, global: { css: u, tokens: p2 }, style: h2 };
}, getPreset({ name: e = "", preset: t2 = {}, options: r, params: s4, set: o, defaults: a2, selector: n }) {
  var y3, N2, x4;
  let l2, i2, c3;
  if (s2(t2) && r.transform !== "strict") {
    let k3 = e.replace("-directive", ""), m2 = t2, { colorScheme: w3, extend: $3, css: j2 } = m2, V2 = b3(m2, ["colorScheme", "extend", "css"]), u = $3 || {}, { colorScheme: D2 } = u, z3 = b3(u, ["colorScheme"]), p2 = w3 || {}, { dark: E2 } = p2, L = b3(p2, ["dark"]), h2 = D2 || {}, { dark: te } = h2, re = b3(h2, ["dark"]), K3 = s2(V2) ? this._toVariables({ [k3]: d2(d2({}, V2), z3) }, r) : {}, M3 = s2(L) ? this._toVariables({ [k3]: d2(d2({}, L), re) }, r) : {}, X2 = s2(E2) ? this._toVariables({ [k3]: d2(d2({}, E2), te) }, r) : {}, [B3, G3] = [(y3 = K3.declarations) != null ? y3 : "", K3.tokens || []], [I2, U3] = [(N2 = M3.declarations) != null ? N2 : "", M3.tokens || []], [H, W3] = [(x4 = X2.declarations) != null ? x4 : "", X2.tokens || []], q3 = this.transformCSS(k3, `${B3}${I2}`, "light", "variable", r, o, a2, n), Z = this.transformCSS(k3, H, "dark", "variable", r, o, a2, n);
    l2 = `${q3}${Z}`, i2 = [.../* @__PURE__ */ new Set([...G3, ...U3, ...W3])], c3 = m(j2, { dt: P2 });
  }
  return { css: l2, tokens: i2, style: c3 };
}, getPresetC({ name: e = "", theme: t2 = {}, params: r, set: s4, defaults: o }) {
  var i2;
  let { preset: a2, options: n } = t2, l2 = (i2 = a2 == null ? void 0 : a2.components) == null ? void 0 : i2[e];
  return this.getPreset({ name: e, preset: l2, options: n, params: r, set: s4, defaults: o });
}, getPresetD({ name: e = "", theme: t2 = {}, params: r, set: s4, defaults: o }) {
  var c3, m2;
  let a2 = e.replace("-directive", ""), { preset: n, options: l2 } = t2, i2 = ((c3 = n == null ? void 0 : n.components) == null ? void 0 : c3[a2]) || ((m2 = n == null ? void 0 : n.directives) == null ? void 0 : m2[a2]);
  return this.getPreset({ name: a2, preset: i2, options: l2, params: r, set: s4, defaults: o });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === false);
}, getColorSchemeOption(e, t2) {
  var r;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === true ? t2.options.darkModeSelector : (r = e.darkModeSelector) != null ? r : t2.options.darkModeSelector) : [];
}, getLayerOrder(e, t2 = {}, r, s4) {
  let { cssLayer: o } = t2;
  return o ? `@layer ${m(o.order || o.name || "primeui", r)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t2 = {}, params: r, props: s4 = {}, set: o, defaults: a2 }) {
  let n = this.getCommon({ name: e, theme: t2, params: r, set: o, defaults: a2 }), l2 = Object.entries(s4).reduce((i2, [c3, m2]) => i2.push(`${c3}="${m2}"`) && i2, []).join(" ");
  return Object.entries(n || {}).reduce((i2, [c3, m2]) => {
    if (i(m2) && Object.hasOwn(m2, "css")) {
      let u = G(m2.css), p2 = `${c3}-variables`;
      i2.push(`<style type="text/css" data-primevue-style-id="${p2}" ${l2}>${u}</style>`);
    }
    return i2;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t2 = {}, params: r, props: s4 = {}, set: o, defaults: a2 }) {
  var c3;
  let n = { name: e, theme: t2, params: r, set: o, defaults: a2 }, l2 = (c3 = e.includes("-directive") ? this.getPresetD(n) : this.getPresetC(n)) == null ? void 0 : c3.css, i2 = Object.entries(s4).reduce((m2, [u, p2]) => m2.push(`${u}="${p2}"`) && m2, []).join(" ");
  return l2 ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${i2}>${G(l2)}</style>` : "";
}, createTokens(e = {}, t2, r = "", s4 = "", o = {}) {
  return {};
}, getTokenValue(e, t2, r) {
  var l2;
  let o = ((i2) => i2.split(".").filter((m2) => !z(m2.toLowerCase(), r.variable.excludedKeyRegex)).join("."))(t2), a2 = t2.includes("colorScheme.light") ? "light" : t2.includes("colorScheme.dark") ? "dark" : void 0, n = [(l2 = e[o]) == null ? void 0 : l2.computed(a2)].flat().filter((i2) => i2);
  return n.length === 1 ? n[0].value : n.reduce((i2 = {}, c3) => {
    let p2 = c3, { colorScheme: m2 } = p2, u = b3(p2, ["colorScheme"]);
    return i2[m2] = u, i2;
  }, void 0);
}, getSelectorRule(e, t2, r, s4) {
  return r === "class" || r === "attr" ? T2(s2(t2) ? `${e}${t2},${e} ${t2}` : e, s4) : T2(e, T2(t2 != null ? t2 : ":root", s4));
}, transformCSS(e, t2, r, s4, o = {}, a2, n, l2) {
  if (s2(t2)) {
    let { cssLayer: i2 } = o;
    if (s4 !== "style") {
      let c3 = this.getColorSchemeOption(o, n);
      t2 = r === "dark" ? c3.reduce((m2, { type: u, selector: p2 }) => (s2(p2) && (m2 += p2.includes("[CSS]") ? p2.replace("[CSS]", t2) : this.getSelectorRule(p2, l2, u, t2)), m2), "") : T2(l2 != null ? l2 : ":root", t2);
    }
    if (i2) {
      let c3 = { name: "primeui", order: "primeui" };
      i(i2) && (c3.name = m(i2.name, { name: e, type: s4 })), s2(c3.name) && (t2 = T2(`@layer ${c3.name}`, t2), a2 == null || a2.layerNames(c3.name));
    }
    return t2;
  }
  return "";
} };
var g3 = { defaults: { variable: { prefix: "p", selector: ":root", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: false } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t2 } = e;
  t2 && (this._theme = _3(d2({}, t2), { options: d2(d2({}, this.defaults.options), t2.options) }), this._tokens = S2.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
}, get theme() {
  return this._theme;
}, get preset() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.preset) || {};
}, get options() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.options) || {};
}, get tokens() {
  return this._tokens;
}, getTheme() {
  return this.theme;
}, setTheme(e) {
  this.update({ theme: e }), R3.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = _3(d2({}, this.theme), { preset: e }), this._tokens = S2.createTokens(e, this.defaults), this.clearLoadedStyleNames(), R3.emit("preset:change", e), R3.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = _3(d2({}, this.theme), { options: e }), this.clearLoadedStyleNames(), R3.emit("options:change", e), R3.emit("theme:change", this.theme);
}, getLayerNames() {
  return [...this._layerNames];
}, setLayerNames(e) {
  this._layerNames.add(e);
}, getLoadedStyleNames() {
  return this._loadedStyleNames;
}, isStyleNameLoaded(e) {
  return this._loadedStyleNames.has(e);
}, setLoadedStyleName(e) {
  this._loadedStyleNames.add(e);
}, deleteLoadedStyleName(e) {
  this._loadedStyleNames.delete(e);
}, clearLoadedStyleNames() {
  this._loadedStyleNames.clear();
}, getTokenValue(e) {
  return S2.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t2) {
  return S2.getCommon({ name: e, theme: this.theme, params: t2, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t2) {
  let r = { name: e, theme: this.theme, params: t2, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return S2.getPresetC(r);
}, getDirective(e = "", t2) {
  let r = { name: e, theme: this.theme, params: t2, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return S2.getPresetD(r);
}, getCustomPreset(e = "", t2, r, s4) {
  let o = { name: e, preset: t2, options: this.options, selector: r, params: s4, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return S2.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return S2.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t2, r = "style", s4) {
  return S2.transformCSS(e, t2, s4, r, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t2, r = {}) {
  return S2.getCommonStyleSheet({ name: e, theme: this.theme, params: t2, props: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t2, r = {}) {
  return S2.getStyleSheet({ name: e, theme: this.theme, params: t2, props: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t2 }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t2), R3.emit(`theme:${t2}:load`, e), !this._loadingStyles.size && R3.emit("theme:load"));
} };
function we(...e) {
  let t2 = w(g3.getPreset(), ...e);
  return g3.setPreset(t2), t2;
}
function Ce(e) {
  return O2().primaryPalette(e).update().preset;
}
function Oe(e) {
  return O2().surfacePalette(e).update().preset;
}
function Ve(...e) {
  let t2 = w(...e);
  return g3.setPreset(t2), t2;
}
function Ee(e) {
  return O2(e).update({ mergePresets: false });
}
var me = class {
  constructor({ attrs: t2 } = {}) {
    this._styles = /* @__PURE__ */ new Map(), this._attrs = t2 || {};
  }
  get(t2) {
    return this._styles.get(t2);
  }
  has(t2) {
    return this._styles.has(t2);
  }
  delete(t2) {
    this._styles.delete(t2);
  }
  clear() {
    this._styles.clear();
  }
  add(t2, r) {
    if (s2(r)) {
      let s4 = { name: t2, css: r, attrs: this._attrs, markup: q2(r, this._attrs) };
      this._styles.set(t2, _3(d2({}, s4), { element: this.createStyleElement(s4) }));
    }
  }
  update() {
  }
  getStyles() {
    return this._styles;
  }
  getAllCSS() {
    return [...this._styles.values()].map((t2) => t2.css).filter(String);
  }
  getAllMarkup() {
    return [...this._styles.values()].map((t2) => t2.markup).filter(String);
  }
  getAllElements() {
    return [...this._styles.values()].map((t2) => t2.element);
  }
  createStyleElement(t2 = {}) {
  }
};
var vt2 = me;

export {
  a,
  l,
  s2 as s,
  c,
  k,
  B,
  i,
  C,
  q,
  M,
  m,
  p,
  g,
  F,
  b,
  j,
  W,
  U,
  G,
  Y,
  Q,
  X,
  v,
  f,
  R2 as R,
  W2,
  st,
  at,
  O,
  dt,
  h,
  k2,
  $2 as $,
  V,
  D,
  S,
  v2,
  I,
  T,
  c2,
  pt,
  A,
  U2,
  ht,
  Y2,
  z2 as z,
  bt,
  Q2,
  b2,
  vt,
  Tt,
  G2,
  J,
  Ht,
  Lt,
  Wt,
  K2 as K,
  C2,
  Pt,
  At,
  Mt,
  Nt,
  Rt,
  Bt,
  kt,
  $t,
  _2 as _,
  Dt,
  tt,
  It,
  et,
  Yt,
  zt,
  Jt,
  Kt,
  _t,
  s3 as s2,
  x3 as x,
  Se,
  R3 as R2,
  v3,
  lt,
  ct,
  Vt,
  Et,
  ke,
  Lt2,
  mt,
  Q3,
  ne,
  dt2,
  Y3,
  Mt2,
  _e,
  T2,
  oe2 as oe,
  A2,
  ae,
  ie,
  gt,
  tr,
  P2 as P,
  le,
  ar,
  O2,
  ce,
  S2,
  g3 as g2,
  we,
  Ce,
  Oe,
  Ve,
  Ee,
  vt2
};
//# sourceMappingURL=chunk-VXRBNF3O.js.map
