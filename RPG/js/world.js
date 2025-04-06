// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// world.js // version 1.0.2
//
// written by drow <drow@bin.sh>
// http://creativecommons.org/licenses/by-nc/3.0/

'use strict';
((D, A) => A(D))(window, D => {
    function A() {
        $("seed").setValue(random(2147483647));
        r()
    }
    function N() {
        r()
    }
    function O() {
        x("pct_water", 0, 100);
        r()
    }
    function P() {
        x("pct_ice", 0, 100);
        r()
    }
    function Q() {
        x("height", 100, max_height);
        r()
    }
    function R() {
        x("iter", 1E3, max_iter);
        r()
    }
    function S() {
        x("rotate", 0, 360);
        r()
    }
    function x(a, e, c) {
        let b = $(a).intValue();
        b < e && (b = e);
        c && b > c && (b = c);
        $(a).setValue(b);
        return b
    }
    function r() {
        var a = {
                seed: set_Prng_Seed($("seed").intValue()),
                algorithm: "voss_a7",
                iter: $("iter").intValue(),
                hack_theta: !0,
                erode: !0,
                pct_water: $("pct_water").intValue(),
                pct_ice: $("pct_ice").intValue(),
                height: $("height").intValue(),
                rotate: $("rotate").intValue() % 360,
                projection: $("projection").getValue(),
                palette: $("palette").getValue(),
                timing: {
                    marks: [],
                    t0: Date.now(),
                    t: Date.now()
                }
            },
            e = a.timing;
        a = T(a);
        "voss" == a.algorithm ? a = E(a) : "voss_x3" == a.algorithm ? a = F(3, "x", a) : "voss_a7" == a.algorithm && (a = F(7, "a", a));
        if (a.erode) {
            var c = B(a, 0),
                b;
            for (b = 0; b < a.rows; b++) {
                var d = void 0;
                for (d = 0; d < a.cols; d++) {
                    var g = c[b],
                        h = d;
                    var f = a;
                    var l =
                        b,
                        m = d;
                    f = q(f, l - 1, m - 1) + q(f, l, m - 1) + q(f, l + 1, m - 1) + q(f, l - 1, m) + q(f, l, m) + q(f, l + 1, m) + q(f, l - 1, m + 1) + q(f, l, m + 1) + q(f, l + 1, m + 1);
                    g[h] = f / 9
                }
            }
            a.map = c;
            a = G(a)
        }
        g = a.palette;
        h = 2147483647;
        for (b = c = 0; b < a.rows; b++)
            for (d = 0; d < a.cols; d++)
                a.map[b][d] < h && (h = a.map[b][d]),
                a.map[b][d] > c && (c = a.map[b][d]);
        f = g.n_terrain;
        l = (f - 1) / (c - h);
        m = [];
        for (b = 0; b < f; b++)
            m[b] = 0;
        for (b = 1; b < a.rows; b++)
            for (d = 0; d < a.cols; d++)
                m[Math.floor((a.map[b][d] - h) * l)]++;
        d = Math.floor(a.pct_water / 100 * a.map_len);
        var n = 0;
        for (b = 0; b < f; b++)
            if (n += m[b], n > d) {
                var k = b;
                break
            }
        k = Math.floor(k /
        l) + h;
        f = g.n_sea / (k - h + 1);
        c = g.n_land / (c - k + 1);
        for (b = 0; b < a.rows; b++)
            for (d = 0; d < a.cols; d++)
                a.map[b][d] = a.map[b][d] < k ? Math.floor((a.map[b][d] - h) * f) + g.sea_idx : Math.floor((a.map[b][d] - k) * c) + g.land_idx;
        k = a = U(a);
        e = H(e, "create");
        a = {};
        "mercator" == k.projection || "transmerc" == k.projection ? (a.height = k.height, a.width = Math.floor(Math.PI / 2 * k.height)) : "icosahedral" == k.projection ? (a.height = k.height, a.width = Math.floor(2.116950987 * k.height), a.col_w = a.width / 11, a.row_h = a.height / 3) : (a.height = k.rows, a.width = k.cols);
        if ("mollweide" ==
        k.projection || "sinusoidal" == k.projection)
            a.wd2 = Math.floor(a.width / 2);
        g = new_image("map", a.width, a.height);
        cache_pixels(!0);
        if ("mercator" == k.projection) {
            h = g;
            c = k.palette.cmap;
            for (b = 0; b < a.width; b++)
                I[b] = Math.floor(b / a.width * k.cols);
            for (b = 0; b < a.height; b++)
                y[b] = Math.floor((.5 - Math.atan(Math.sinh((.5 - b / a.height) * Math.PI)) / Math.PI) * k.rows);
            for (b = 0; b < a.width; b++)
                for (d = 0; d < a.height; d++)
                    f = t(k, y[d], I[b]),
                    0 < f && set_pixel(h, b, d, c[f])
        } else if ("transmerc" == k.projection)
            for (h = g, c = k.palette.cmap, b = 0; b < a.width; b++)
                for (d =
                0; d < a.height; d++)
                    f = b / a.width * 2 * Math.PI,
                    l = 4 * (d / a.height - .5),
                    m = Math.atan(Math.sinh(l) / Math.cos(f)),
                    n = Math.PI / 2,
                    f > n && f <= 3 * n && (m += Math.PI),
                    f = t(k, Math.floor((.5 - Math.asin(Math.sin(f) / Math.cosh(l)) / Math.PI) * k.rows), Math.floor(m / (2 * Math.PI) * k.cols)),
                    0 < f && set_pixel(h, b, d, c[f]);
        else if ("icosahedral" == k.projection)
            for (h = g, c = k.palette.cmap, b = 0; b < a.width; b++)
                for (d = 0; d < a.height; d++) {
                    {
                        f = Math.floor(b / a.col_w);
                        l = Math.floor(d / a.row_h);
                        m = Math.floor(b - f * a.col_w);
                        n = Math.floor(.5773502692 * Math.floor(d - l * a.row_h));
                        let p =
                        -1;
                        0 == (l + f) % 2 && (m = Math.floor(a.col_w - m));
                        0 == l ? 10 > f && m < n && (p = Math.floor(m / n * a.col_w)) : 1 == l ? 0 == f ? m > n && (p = m) : 10 > f ? p = m : 10 == f && m < n && (p = m) : 2 == l && 0 < f && m > n && (m = Math.floor(a.col_w - m), n = Math.floor(a.col_w - n), p = Math.floor(m / n * a.col_w), p = Math.floor(a.col_w - p));
                        -1 < p ? (0 == (l + f) % 2 && (p = Math.floor(a.col_w - p)), p += Math.floor(f * a.col_w), f = t(k, d, p)) : f = 0
                    }
                    0 < f && set_pixel(h, b, d, c[f])
                }
        else if ("mollweide" == k.projection) {
            h = g;
            c = k.palette.cmap;
            for (b = 0; b < a.height; b++)
                u[b] = Math.sqrt(Math.sin(b / a.height * Math.PI)),
                v[b] = Math.floor(a.wd2 *
                u[b]),
                d = Math.asin(2.8284271247 * (.5 - b / a.height) / Math.sqrt(2)),
                y[b] = Math.floor((.5 - Math.asin((2 * d + Math.sin(2 * d)) / Math.PI) / Math.PI) * k.rows);
            for (b = 0; b < a.width; b++)
                for (d = 0; d < a.height; d++)
                    f = b > a.wd2 - v[d] && b < a.wd2 + v[d] ? t(k, y[d], Math.floor((b - a.wd2) / u[d]) + k.cd2) : 0,
                    0 < f && set_pixel(h, b, d, c[f])
        } else if ("sinusoidal" == k.projection) {
            h = g;
            c = k.palette.cmap;
            for (b = 0; b < a.height; b++)
                u[b] = Math.sin(b / a.height * Math.PI),
                v[b] = Math.floor(a.wd2 * u[b]);
            for (b = 0; b < a.width; b++)
                for (d = 0; d < a.height; d++)
                    f = b > a.wd2 - v[d] && b < a.wd2 + v[d] ? t(k,
                    d, Math.floor((b - a.wd2) / u[d]) + k.cd2) : 0,
                    0 < f && set_pixel(h, b, d, c[f])
        } else
            for (h = g, c = k.palette.cmap, b = 0; b < a.width; b++)
                for (d = 0; d < a.height; d++)
                    f = t(k, d, b),
                    0 < f && set_pixel(h, b, d, c[f]);
        draw_pixels(g);
        e = H(e, "image");
        k = $("dt");
        a = k.update;
        e.marks.push("total " + J(e.t0));
        e = e.marks.join("; ");
        a.call(k, e)
    }
    function H(a, e) {
        a.marks.push(`${e} ` + J(a.t));
        a.t = Date.now();
        return a
    }
    function J(a) {
        return (Date.now() - a) / 1E3
    }
    function T(a) {
        "mercator" == a.projection || "transmerc" == a.projection ? (a.rows = 2 * a.height, a.cols = 2 * a.rows) : "icosahedral" ==
        a.projection ? (a.rows = a.height, a.cols = Math.floor(1.9245008973 * a.rows)) : (a.rows = a.height, a.cols = 2 * a.rows);
        a.map_len = a.rows * a.cols;
        a.rl1 = a.rows - 1;
        a.rd2 = Math.floor(a.rows / 2);
        a.rdp = Math.floor(a.rows / Math.PI);
        a.cd2 = Math.floor(a.cols / 2);
        a.cdp = Math.floor(a.cols / Math.PI);
        a.rpx = Math.floor(a.rotate / 360 * a.cols);
        let e;
        if (e = palette[a.palette]) {
            a.palette = K(e);
            let c;
            (c = e.set) && Object.keys(c).forEach(b => {
                a[b] = c[b]
            })
        } else
            a.palette = K(palette.mogensen);
        return a
    }
    function K(a) {
        var e = {
            n_sea: 50,
            n_land: 100,
            cmap: []
        };
        e.n_terrain =
        e.n_sea + e.n_land;
        e.n_ice = e.n_land + 1;
        e.sea_idx = 1;
        e.land_idx = e.sea_idx + e.n_sea;
        e.ice_idx = e.land_idx + e.n_land;
        var c = a.sea,
            b = c.length - 1,
            d;
        for (d = e.sea_idx; d < e.land_idx; d++) {
            var g = (d - e.sea_idx) / e.n_sea * b;
            let h = Math.floor(g);
            e.cmap[d] = C(c[h], c[h + 1], g - h)
        }
        a = a.land;
        c = a.length - 1;
        for (b = e.land_idx; b < e.ice_idx; b++)
            d = (b - e.land_idx) / e.n_land * c,
            g = Math.floor(d),
            e.cmap[b] = C(a[g], a[g + 1], d - g);
        a = e;
        e = a.ice_idx + a.n_ice;
        c = [255, 255, 255];
        b = [175, 175, 175];
        for (d = a.ice_idx; d < e; d++)
            a.cmap[d] = C(c, b, (d - a.ice_idx) / (a.n_ice - 1));
        return a
    }
    function C(a, e, c) {
        return rgb2hex(Math.floor(a[0] + (e[0] - a[0]) * c), Math.floor(a[1] + (e[1] - a[1]) * c), Math.floor(a[2] + (e[2] - a[2]) * c))
    }
    function E(a) {
        a.map = B(a, 0);
        var e = a.cols;
        var c = [],
            b;
        for (b = 0; b < e; b++)
            c[b] = Math.sin(b / e * 2 * Math.PI);
        e = c;
        for (c = 0; c < a.iter; c++) {
            {
                var d = void 0,
                    g = void 0;
                b = void 0;
                var h = e,
                    f = (random(32767) / 32767 - .5) * Math.PI,
                    l = random(32767) / 32767 - .5;
                let n = Math.floor(a.cd2 - a.cols * l);
                f = Math.tan(Math.acos(Math.cos(f) * Math.cos(l * Math.PI)));
                if (!isNaN(f)) {
                    l = 50 > random(100) ? 1 : -1;
                    if (a.hack_theta) {
                        b = random(32767) /
                        32767 * .5 + .5;
                        g = Math;
                        d = g.floor;
                        var m = (1 - b) * a.rl1;
                        m *= random(32767) / 32767;
                        g = d.call(g, m) + 1
                    }
                    for (d = 0; d < a.cols; d++)
                        m = Math.floor(Math.atan(h[(n - d + a.cols) % a.cols] * f) * a.rdp),
                        isNaN(m) || (m += a.rd2, a.hack_theta && (m = Math.floor(m * b) + g), a.map[m][d] += l)
                }
            }
        }
        e = a;
        for (c = 1; c < e.rows; c++)
            for (b = 0; b < e.cols; b++)
                e.map[c][b] += e.map[c - 1][b];
        return a = G(e)
    }
    function B(a, e) {
        let c = [],
            b;
        for (b = 0; b < a.rows; b++) {
            c[b] = [];
            let d;
            for (d = 0; d < a.cols; d++)
                c[b][d] = e
        }
        return c
    }
    function G(a) {
        let e = 2147483647,
            c,
            b;
        for (c = 0; c < a.rows; c++)
            for (b = 0; b < a.cols; b++)
                a.map[c][b] <
                e && (e = a.map[c][b]);
        for (c = 0; c < a.rows; c++)
            for (b = 0; b < a.cols; b++)
                a.map[c][b] -= e - 1;
        return a
    }
    function F(a, e, c) {
        var b = B(c, 1);
        let d = c.iter;
        c.iter = Math.floor(d / a);
        let g;
        for (g = 0; g < a; g++) {
            c = E(c);
            if ("x" == e) {
                var h = void 0,
                    f = c;
                for (h = 0; h < f.rows; h++) {
                    var l = void 0;
                    for (l = 0; l < f.cols; l++)
                        b[h][l] *= f.map[h][l]
                }
            } else if ("a" == e)
                for (f = c, h = 0; h < f.rows; h++)
                    for (l = 0; l < f.cols; l++)
                        b[h][l] += f.map[h][l],
                        b[h][l] /= 2;
            c.map = !1
        }
        c.iter = d;
        c.map = b;
        return c
    }
    function q(a, e, c) {
        if (0 <= e && e < a.rows && 0 <= c && c < a.cols)
            return a.map[e][c];
        e = L(a, e, c);
        return a.map[e.row][e.col]
    }
    function M(a, e, c, b) {
        0 <= e && e < a.rows && 0 <= c && c < a.cols ? a.map[e][c] = b : (e = L(a, e, c), a.map[e.row][e.col] = b)
    }
    function L(a, e, c) {
        for (; 0 > e;)
            e += 2 * a.rows;
        e >= 2 * a.rows && (e %= 2 * a.rows);
        e >= a.rows && (e = 2 * a.rows - (e + 1), c += Math.floor(a.cols / 2));
        for (; 0 > c;)
            c += a.cols;
        c >= a.cols && (c %= a.cols);
        return {
            row: e,
            col: c
        }
    }
    function U(a) {
        let e = a.palette;
        if (0 < a.pct_ice) {
            let c = Math.floor(a.pct_ice / 100 * a.map_len / 2);
            (() => {
                let b = 0,
                    d;
                for (d = 0; d < a.rows; d++) {
                    let g;
                    for (g = 0; g < a.cols && !(a.map[d][g] < e.ice_idx && (b += w(a, d, g, a.map[d][g], 0)), b > c); g++)
                        ;
                    if (b >
                    c)
                        break
                }
            })();
            (() => {
                let b = 0,
                    d;
                for (d = a.rl1; 0 < d; d--) {
                    let g;
                    for (g = 0; g < a.cols && !(a.map[d][g] < e.ice_idx && (b += w(a, d, g, a.map[d][g], 0)), b > c); g++)
                        ;
                    if (b > c)
                        break
                }
            })()
        }
        return a
    }
    function w(a, e, c, b, d) {
        let g = a.palette,
            h = q(a, e, c),
            f = 0;
        h == b && (h >= g.land_idx ? M(a, e, c, h - g.land_idx + g.ice_idx + 1) : M(a, e, c, g.ice_idx), f++, d++ < a.height / 6 && (f += w(a, e, c - 1, b, d), f += w(a, e, c + 1, b, d), 1 < e && (f += w(a, e - 1, c, b, d)), e < a.rl1 && (f += w(a, e + 1, c, b, d))));
        return f
    }
    function t(a, e, c) {
        c -= a.rpx;
        0 > e && (e = 0);
        for (e >= a.rows && (e = a.rl1); 0 > c;)
            c += a.cols;
        c >= a.cols &&
        (c %= a.cols);
        return a.map[e][c]
    }
    function V() {
        let a = $("seed").getValue();
        save_canvas($("map"), `${a}.png`)
    }
    let z = {
        projection: {
            square: {
                title: "Square"
            },
            mercator: {
                title: "Mercator"
            },
            transmerc: {
                title: "Transverse"
            },
            icosahedral: {
                title: "Icosahedral"
            },
            mollweide: {
                title: "Mollweide"
            },
            sinusoidal: {
                title: "Sinusoidal"
            }
        },
        palette
    };
    document.observe("dom:loaded", () => {
        Object.keys(z).forEach(a => {
            Object.keys(z[a]).forEach(e => {
                let c = z[a][e].title;
                var b = $(a),
                    d = b.insert;
                e = (new Element("option", {
                    value: e
                })).update(c);
                d.call(b,
                e)
            })
        });
        Object.keys(default_query).forEach(a => {
            $(a).setValue(default_query[a])
        });
        r();
        $("seed").observe("change", N);
        $("new_seed").observe("click", A);
        Object.keys(z).forEach(a => {
            $(a).observe("change", r)
        });
        $("pct_water").observe("change", O);
        $("pct_ice").observe("change", P);
        $("height").observe("change", Q);
        $("iter").observe("change", R);
        $("rotate").observe("change", S);
        $("save_map").observe("click", V);
        $("print_map").observe("click", () => {
            window.print()
        })
    });
    Element.addMethods(["INPUT", "SELECT"], {
        intValue: function(a) {
            return parseInt($(a).getValue(),
            10)
        },
        floatValue: function(a) {
            return parseFloat($(a).getValue())
        }
    });
    let u = [],
        v = [],
        y = [],
        I = []
});