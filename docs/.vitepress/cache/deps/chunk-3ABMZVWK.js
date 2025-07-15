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
function l(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function s2(e) {
  return !a(e);
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
      let u = Object.keys(e).find((f) => g(f) === o) || "";
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
function v(e) {
  return p(e, false) ? e[0].toUpperCase() + e.slice(1) : e;
}
function ee(e) {
  return p(e) ? e.replace(/(_)/g, "-").replace(/[A-Z]/g, (t2, n) => n === 0 ? t2 : "-" + t2.toLowerCase()).toLowerCase() : e;
}

// node_modules/@primeuix/utils/dist/dom/index.mjs
function R(t2, e) {
  return t2 ? t2.classList ? t2.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t2.className) : false;
}
function W(t2, e) {
  if (t2 && e) {
    let o = (n) => {
      R(t2, n) || (t2.classList ? t2.classList.add(n) : t2.className += " " + n);
    };
    [e].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(o));
  }
}
function O(t2, e) {
  if (t2 && e) {
    let o = (n) => {
      t2.classList ? t2.classList.remove(n) : t2.className = t2.className.replace(new RegExp("(^|\\b)" + n.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [e].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(o));
  }
}
function h() {
  let t2 = window, e = document, o = e.documentElement, n = e.getElementsByTagName("body")[0], r = t2.innerWidth || o.clientWidth || n.clientWidth, i2 = t2.innerHeight || o.clientHeight || n.clientHeight;
  return { width: r, height: i2 };
}
function E(t2) {
  return t2 ? Math.abs(t2.scrollLeft) : 0;
}
function k() {
  let t2 = document.documentElement;
  return (window.pageXOffset || E(t2)) - (t2.clientLeft || 0);
}
function $2() {
  let t2 = document.documentElement;
  return (window.pageYOffset || t2.scrollTop) - (t2.clientTop || 0);
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
function y(t2) {
  if (t2) {
    let e = t2.parentNode;
    return e && e instanceof ShadowRoot && e.host && (e = e.host), e;
  }
  return null;
}
function T(t2) {
  return !!(t2 !== null && typeof t2 != "undefined" && t2.nodeName && y(t2));
}
function c(t2) {
  return typeof Element != "undefined" ? t2 instanceof Element : t2 !== null && typeof t2 == "object" && t2.nodeType === 1 && typeof t2.nodeName == "string";
}
function A(t2, e = {}) {
  if (c(t2)) {
    let o = (n, r) => {
      var l2, d3;
      let i2 = (l2 = t2 == null ? void 0 : t2.$attrs) != null && l2[n] ? [(d3 = t2 == null ? void 0 : t2.$attrs) == null ? void 0 : d3[n]] : [];
      return [r].flat().reduce((s4, a2) => {
        if (a2 != null) {
          let u = typeof a2;
          if (u === "string" || u === "number") s4.push(a2);
          else if (u === "object") {
            let p2 = Array.isArray(a2) ? o(n, a2) : Object.entries(a2).map(([f, g4]) => n === "style" && (g4 || g4 === 0) ? `${f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${g4}` : g4 ? f : void 0);
            s4 = p2.length ? s4.concat(p2.filter((f) => !!f)) : s4;
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
function q(t2, e = {}) {
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
function Y(t2, e) {
  return c(t2) ? Array.from(t2.querySelectorAll(e)) : [];
}
function z2(t2, e) {
  return c(t2) ? t2.matches(e) ? t2 : t2.querySelector(e) : null;
}
function bt(t2, e) {
  t2 && document.activeElement !== t2 && t2.focus(e);
}
function Q(t2, e) {
  if (c(t2)) {
    let o = t2.getAttribute(e);
    return isNaN(o) ? o === "true" || o === "false" ? o === "true" : o : +o;
  }
}
function b2(t2, e = "") {
  let o = Y(t2, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
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
function Lt(t2, e) {
  let o = b2(t2, e);
  return o.length > 0 ? o[o.length - 1] : null;
}
function K2(t2) {
  if (t2) {
    let e = t2.getBoundingClientRect();
    return { top: e.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: e.left + (window.pageXOffset || E(document.documentElement) || E(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function C(t2, e) {
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
function M(t2, e = []) {
  let o = y(t2);
  return o === null ? e : M(o, e.concat([o]));
}
function At(t2) {
  let e = [];
  if (t2) {
    let o = M(t2), n = /(auto|scroll)/, r = (i2) => {
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
function Rt(t2) {
  if (t2) {
    let e = t2.offsetWidth, o = getComputedStyle(t2);
    return e -= parseFloat(o.paddingLeft) + parseFloat(o.paddingRight) + parseFloat(o.borderLeftWidth) + parseFloat(o.borderRightWidth), e;
  }
  return 0;
}
function tt() {
  return !!(typeof window != "undefined" && window.document && window.document.createElement);
}
function It(t2, e = "") {
  return c(t2) ? t2.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e}`) : false;
}
function Yt() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function Kt(t2, e = "", o) {
  c(t2) && o !== null && o !== void 0 && t2.setAttribute(e, o);
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
var x = g2();

// node_modules/@primeuix/styled/dist/index.mjs
var Qe = Object.defineProperty;
var Ye = Object.defineProperties;
var et = Object.getOwnPropertyDescriptors;
var F2 = Object.getOwnPropertySymbols;
var fe2 = Object.prototype.hasOwnProperty;
var ye = Object.prototype.propertyIsEnumerable;
var he = (e, t2, r) => t2 in e ? Qe(e, t2, { enumerable: true, configurable: true, writable: true, value: r }) : e[t2] = r;
var d2 = (e, t2) => {
  for (var r in t2 || (t2 = {})) fe2.call(t2, r) && he(e, r, t2[r]);
  if (F2) for (var r of F2(t2)) ye.call(t2, r) && he(e, r, t2[r]);
  return e;
};
var _2 = (e, t2) => Ye(e, et(t2));
var b3 = (e, t2) => {
  var r = {};
  for (var s4 in e) fe2.call(e, s4) && t2.indexOf(s4) < 0 && (r[s4] = e[s4]);
  if (e != null && F2) for (var s4 of F2(e)) t2.indexOf(s4) < 0 && ye.call(e, s4) && (r[s4] = e[s4]);
  return r;
};
function Se(...e) {
  return w(...e);
}
var st = s();
var R2 = st;
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
function Q2(e = "", t2 = "") {
  return mt(`${p(e, false) && p(t2, false) ? `${e}-` : e}${t2}`);
}
function ne(e = "", t2 = "") {
  return `--${Q2(e, t2)}`;
}
function dt(e = "") {
  let t2 = (e.match(/{/g) || []).length, r = (e.match(/}/g) || []).length;
  return (t2 + r) % 2 !== 0;
}
function Y2(e, t2 = "", r = "", s4 = [], o) {
  if (p(e)) {
    let a2 = e.trim();
    if (dt(a2)) return;
    if (z(a2, v3)) {
      let n = a2.replaceAll(v3, (l2) => {
        let c2 = l2.replace(/{|}/g, "").split(".").filter((m2) => !s4.some((u) => z(m2, u)));
        return `var(${ne(r, ee(c2.join("-")))}${s2(o) ? `, ${o}` : ""})`;
      });
      return z(n.replace(ct, "0"), lt) ? `calc(${n})` : n;
    }
    return a2;
  } else if (_(e)) return e;
}
function Mt(e = {}, t2) {
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
    let i2 = [], c2 = 0, m2 = "", u = null, p2 = 0;
    for (; c2 <= n.length; ) {
      let h2 = n[c2];
      if ((h2 === '"' || h2 === "'" || h2 === "`") && n[c2 - 1] !== "\\" && (u = u === h2 ? null : h2), !u && (h2 === "(" && p2++, h2 === ")" && p2--, (h2 === "," || c2 === n.length) && p2 === 0)) {
        let y2 = m2.trim();
        y2.startsWith("dt(") ? i2.push(oe2(y2, l2)) : i2.push(s4(y2)), m2 = "", c2++;
        continue;
      }
      h2 !== void 0 && (m2 += h2), c2++;
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
    let [l2, i2] = o[n], c2 = e.slice(l2 + 3, i2), m2 = r(c2, t2), u = t2(...m2);
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
  let a2 = (r / 100 * 2 - 1 + 1) / 2, n = 1 - a2, l2 = $e(e), i2 = $e(t2), c2 = Math.round(l2.r * a2 + i2.r * n), m2 = Math.round(l2.g * a2 + i2.g * n), u = Math.round(l2.b * a2 + i2.b * n);
  return ut(c2, m2, u);
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
var P = (...e) => le(g3.getTheme(), ...e);
var le = (e = {}, t2, r, s4) => {
  if (t2) {
    let { variable: o, options: a2 } = g3.defaults || {}, { prefix: n, transform: l2 } = (e == null ? void 0 : e.options) || a2 || {}, i2 = z(t2, v3) ? t2 : `{${t2}}`;
    return s4 === "value" || a(s4) && l2 === "strict" ? g3.getTokenValue(t2) : Y2(i2, void 0, n, [o.excludedKeyRegex], r);
  }
  return "";
};
function ar(e, ...t2) {
  if (e instanceof Array) {
    let r = e.reduce((s4, o, a2) => {
      var n;
      return s4 + o + ((n = m(t2[a2], { dt: P })) != null ? n : "");
    }, "");
    return oe2(r, P);
  }
  return m(e, { dt: P });
}
var O2 = (e = {}) => {
  let { preset: t2, options: r } = e;
  return { preset(s4) {
    return t2 = t2 ? U(t2, s4) : s4, this;
  }, options(s4) {
    return r = r ? d2(d2({}, r), s4) : s4, this;
  }, primaryPalette(s4) {
    let { semantic: o } = t2 || {};
    return t2 = _2(d2({}, t2), { semantic: _2(d2({}, o), { primary: s4 }) }), this;
  }, surfacePalette(s4) {
    var i2, c2;
    let { semantic: o } = t2 || {}, a2 = s4 && Object.hasOwn(s4, "light") ? s4.light : s4, n = s4 && Object.hasOwn(s4, "dark") ? s4.dark : s4, l2 = { colorScheme: { light: d2(d2({}, (i2 = o == null ? void 0 : o.colorScheme) == null ? void 0 : i2.light), !!a2 && { surface: a2 }), dark: d2(d2({}, (c2 = o == null ? void 0 : o.colorScheme) == null ? void 0 : c2.dark), !!n && { surface: n }) } };
    return t2 = _2(d2({}, t2), { semantic: d2(d2({}, o), l2) }), this;
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
      let h2 = m2[p2], y2 = ke(h2), x2 = z(p2, a2) ? Q2(u) : Q2(u, ee(p2));
      if (i(y2)) i2.push({ node: y2, path: x2 });
      else {
        let k2 = ne(x2), w2 = Y2(y2, x2, s4, [a2]);
        _e(l2, k2, w2);
        let $3 = x2;
        s4 && $3.startsWith(s4 + "-") && ($3 = $3.slice(s4.length + 1)), n.push($3.replace(/-/g, "."));
      }
    }
  }
  let c2 = l2.join("");
  return { value: l2, tokens: n, declarations: c2, css: T2(o, c2) };
}
var S = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
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
  var w2, $3, j, V, D, z3, E2;
  let { preset: a2, options: n } = t2, l2, i2, c2, m2, u, p2, h2;
  if (s2(a2) && n.transform !== "strict") {
    let { primitive: L, semantic: te, extend: re } = a2, y2 = te || {}, { colorScheme: K3 } = y2, M2 = b3(y2, ["colorScheme"]), N2 = re || {}, { colorScheme: X } = N2, B = b3(N2, ["colorScheme"]), x2 = K3 || {}, { dark: G2 } = x2, I = b3(x2, ["dark"]), k2 = X || {}, { dark: U3 } = k2, H = b3(k2, ["dark"]), W2 = s2(L) ? this._toVariables({ primitive: L }, n) : {}, q2 = s2(M2) ? this._toVariables({ semantic: M2 }, n) : {}, Z = s2(I) ? this._toVariables({ light: I }, n) : {}, de = s2(G2) ? this._toVariables({ dark: G2 }, n) : {}, ue2 = s2(B) ? this._toVariables({ semantic: B }, n) : {}, pe = s2(H) ? this._toVariables({ light: H }, n) : {}, ge = s2(U3) ? this._toVariables({ dark: U3 }, n) : {}, [Le, Me] = [(w2 = W2.declarations) != null ? w2 : "", W2.tokens], [Ae, je] = [($3 = q2.declarations) != null ? $3 : "", q2.tokens || []], [De, ze] = [(j = Z.declarations) != null ? j : "", Z.tokens || []], [Ke, Xe] = [(V = de.declarations) != null ? V : "", de.tokens || []], [Be, Ge] = [(D = ue2.declarations) != null ? D : "", ue2.tokens || []], [Ie, Ue] = [(z3 = pe.declarations) != null ? z3 : "", pe.tokens || []], [He, We] = [(E2 = ge.declarations) != null ? E2 : "", ge.tokens || []];
    l2 = this.transformCSS(e, Le, "light", "variable", n, s4, o), i2 = Me;
    let qe = this.transformCSS(e, `${Ae}${De}`, "light", "variable", n, s4, o), Ze = this.transformCSS(e, `${Ke}`, "dark", "variable", n, s4, o);
    c2 = `${qe}${Ze}`, m2 = [.../* @__PURE__ */ new Set([...je, ...ze, ...Xe])];
    let Fe = this.transformCSS(e, `${Be}${Ie}color-scheme:light`, "light", "variable", n, s4, o), Je = this.transformCSS(e, `${He}color-scheme:dark`, "dark", "variable", n, s4, o);
    u = `${Fe}${Je}`, p2 = [.../* @__PURE__ */ new Set([...Ge, ...Ue, ...We])], h2 = m(a2.css, { dt: P });
  }
  return { primitive: { css: l2, tokens: i2 }, semantic: { css: c2, tokens: m2 }, global: { css: u, tokens: p2 }, style: h2 };
}, getPreset({ name: e = "", preset: t2 = {}, options: r, params: s4, set: o, defaults: a2, selector: n }) {
  var y2, N2, x2;
  let l2, i2, c2;
  if (s2(t2) && r.transform !== "strict") {
    let k2 = e.replace("-directive", ""), m2 = t2, { colorScheme: w2, extend: $3, css: j } = m2, V = b3(m2, ["colorScheme", "extend", "css"]), u = $3 || {}, { colorScheme: D } = u, z3 = b3(u, ["colorScheme"]), p2 = w2 || {}, { dark: E2 } = p2, L = b3(p2, ["dark"]), h2 = D || {}, { dark: te } = h2, re = b3(h2, ["dark"]), K3 = s2(V) ? this._toVariables({ [k2]: d2(d2({}, V), z3) }, r) : {}, M2 = s2(L) ? this._toVariables({ [k2]: d2(d2({}, L), re) }, r) : {}, X = s2(E2) ? this._toVariables({ [k2]: d2(d2({}, E2), te) }, r) : {}, [B, G2] = [(y2 = K3.declarations) != null ? y2 : "", K3.tokens || []], [I, U3] = [(N2 = M2.declarations) != null ? N2 : "", M2.tokens || []], [H, W2] = [(x2 = X.declarations) != null ? x2 : "", X.tokens || []], q2 = this.transformCSS(k2, `${B}${I}`, "light", "variable", r, o, a2, n), Z = this.transformCSS(k2, H, "dark", "variable", r, o, a2, n);
    l2 = `${q2}${Z}`, i2 = [.../* @__PURE__ */ new Set([...G2, ...U3, ...W2])], c2 = m(j, { dt: P });
  }
  return { css: l2, tokens: i2, style: c2 };
}, getPresetC({ name: e = "", theme: t2 = {}, params: r, set: s4, defaults: o }) {
  var i2;
  let { preset: a2, options: n } = t2, l2 = (i2 = a2 == null ? void 0 : a2.components) == null ? void 0 : i2[e];
  return this.getPreset({ name: e, preset: l2, options: n, params: r, set: s4, defaults: o });
}, getPresetD({ name: e = "", theme: t2 = {}, params: r, set: s4, defaults: o }) {
  var c2, m2;
  let a2 = e.replace("-directive", ""), { preset: n, options: l2 } = t2, i2 = ((c2 = n == null ? void 0 : n.components) == null ? void 0 : c2[a2]) || ((m2 = n == null ? void 0 : n.directives) == null ? void 0 : m2[a2]);
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
  let n = this.getCommon({ name: e, theme: t2, params: r, set: o, defaults: a2 }), l2 = Object.entries(s4).reduce((i2, [c2, m2]) => i2.push(`${c2}="${m2}"`) && i2, []).join(" ");
  return Object.entries(n || {}).reduce((i2, [c2, m2]) => {
    if (i(m2) && Object.hasOwn(m2, "css")) {
      let u = G(m2.css), p2 = `${c2}-variables`;
      i2.push(`<style type="text/css" data-primevue-style-id="${p2}" ${l2}>${u}</style>`);
    }
    return i2;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t2 = {}, params: r, props: s4 = {}, set: o, defaults: a2 }) {
  var c2;
  let n = { name: e, theme: t2, params: r, set: o, defaults: a2 }, l2 = (c2 = e.includes("-directive") ? this.getPresetD(n) : this.getPresetC(n)) == null ? void 0 : c2.css, i2 = Object.entries(s4).reduce((m2, [u, p2]) => m2.push(`${u}="${p2}"`) && m2, []).join(" ");
  return l2 ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${i2}>${G(l2)}</style>` : "";
}, createTokens(e = {}, t2, r = "", s4 = "", o = {}) {
  return {};
}, getTokenValue(e, t2, r) {
  var l2;
  let o = ((i2) => i2.split(".").filter((m2) => !z(m2.toLowerCase(), r.variable.excludedKeyRegex)).join("."))(t2), a2 = t2.includes("colorScheme.light") ? "light" : t2.includes("colorScheme.dark") ? "dark" : void 0, n = [(l2 = e[o]) == null ? void 0 : l2.computed(a2)].flat().filter((i2) => i2);
  return n.length === 1 ? n[0].value : n.reduce((i2 = {}, c2) => {
    let p2 = c2, { colorScheme: m2 } = p2, u = b3(p2, ["colorScheme"]);
    return i2[m2] = u, i2;
  }, void 0);
}, getSelectorRule(e, t2, r, s4) {
  return r === "class" || r === "attr" ? T2(s2(t2) ? `${e}${t2},${e} ${t2}` : e, s4) : T2(e, T2(t2 != null ? t2 : ":root", s4));
}, transformCSS(e, t2, r, s4, o = {}, a2, n, l2) {
  if (s2(t2)) {
    let { cssLayer: i2 } = o;
    if (s4 !== "style") {
      let c2 = this.getColorSchemeOption(o, n);
      t2 = r === "dark" ? c2.reduce((m2, { type: u, selector: p2 }) => (s2(p2) && (m2 += p2.includes("[CSS]") ? p2.replace("[CSS]", t2) : this.getSelectorRule(p2, l2, u, t2)), m2), "") : T2(l2 != null ? l2 : ":root", t2);
    }
    if (i2) {
      let c2 = { name: "primeui", order: "primeui" };
      i(i2) && (c2.name = m(i2.name, { name: e, type: s4 })), s2(c2.name) && (t2 = T2(`@layer ${c2.name}`, t2), a2 == null || a2.layerNames(c2.name));
    }
    return t2;
  }
  return "";
} };
var g3 = { defaults: { variable: { prefix: "p", selector: ":root", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: false } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t2 } = e;
  t2 && (this._theme = _2(d2({}, t2), { options: d2(d2({}, this.defaults.options), t2.options) }), this._tokens = S.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this.update({ theme: e }), R2.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = _2(d2({}, this.theme), { preset: e }), this._tokens = S.createTokens(e, this.defaults), this.clearLoadedStyleNames(), R2.emit("preset:change", e), R2.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = _2(d2({}, this.theme), { options: e }), this.clearLoadedStyleNames(), R2.emit("options:change", e), R2.emit("theme:change", this.theme);
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
  return S.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t2) {
  return S.getCommon({ name: e, theme: this.theme, params: t2, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t2) {
  let r = { name: e, theme: this.theme, params: t2, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return S.getPresetC(r);
}, getDirective(e = "", t2) {
  let r = { name: e, theme: this.theme, params: t2, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return S.getPresetD(r);
}, getCustomPreset(e = "", t2, r, s4) {
  let o = { name: e, preset: t2, options: this.options, selector: r, params: s4, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return S.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return S.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t2, r = "style", s4) {
  return S.transformCSS(e, t2, s4, r, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t2, r = {}) {
  return S.getCommonStyleSheet({ name: e, theme: this.theme, params: t2, props: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t2, r = {}) {
  return S.getStyleSheet({ name: e, theme: this.theme, params: t2, props: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t2 }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t2), R2.emit(`theme:${t2}:load`, e), !this._loadingStyles.size && R2.emit("theme:load"));
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
      let s4 = { name: t2, css: r, attrs: this._attrs, markup: q(r, this._attrs) };
      this._styles.set(t2, _2(d2({}, s4), { element: this.createStyleElement(s4) }));
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
  i,
  m,
  p,
  g,
  F,
  b,
  U,
  G,
  v,
  R,
  W,
  O,
  h,
  k,
  $2 as $,
  v2,
  T,
  A,
  U2,
  ht,
  z2 as z,
  bt,
  Q,
  vt,
  Tt,
  Lt,
  K2 as K,
  C,
  At,
  Rt,
  tt,
  It,
  Yt,
  Kt,
  s3 as s2,
  x,
  Se,
  R2,
  v3,
  lt,
  ct,
  Vt,
  Et,
  ke,
  Lt2,
  mt,
  Q2,
  ne,
  dt,
  Y2 as Y,
  Mt,
  _e,
  T2,
  oe2 as oe,
  A2,
  ae,
  ie,
  gt,
  tr,
  P,
  le,
  ar,
  O2,
  ce,
  S,
  g3 as g2,
  we,
  Ce,
  Oe,
  Ve,
  Ee,
  vt2
};
//# sourceMappingURL=chunk-3ABMZVWK.js.map
