// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// canvas.js
//
// written by drow <drow@bin.sh>
// http://creativecommons.org/licenses/by-nc/3.0/

"use strict";
((g, l) => l(g))(window, (g) => {
  function l(a, c, b) {
    let d =
      "#" +
      [
        ("00" + a.toString(16)).substr(-2),
        ("00" + c.toString(16)).substr(-2),
        ("00" + b.toString(16)).substr(-2),
      ].join("");
    m[d] = [a, c, b, 255];
    return d;
  }
  function q(a) {
    if (m[a]) return m[a];
    {
      let b;
      var c =
        (b = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(a)) ||
        (b = /^#([0-9a-f])([0-9a-f])([0-9a-f])/i.exec(a))
          ? [parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16), 255]
          : (b = /^rgb[(](\d+),(\d+),(\d+)[)]/i.exec(a))
          ? [parseInt(b[1], 10), parseInt(b[2], 10), parseInt(b[3], 10), 255]
          : !1;
    }
    return c ? (m[a] = c) : [0, 0, 0, 255];
  }
  function r(a) {
    let c = a[0];
    var b = a[2] / 100;
    a = (a[1] / 100) * b;
    let d = a * (1 - Math.abs(((c / 60) % 2) - 1));
    b -= a;
    let e = 0,
      f = 0,
      h = 0;
    60 > c
      ? ((e = a), (f = d))
      : 120 > c
      ? ((e = d), (f = a))
      : 180 > c
      ? ((f = a), (h = d))
      : 240 > c
      ? ((f = d), (h = a))
      : 300 > c
      ? ((e = d), (h = a))
      : ((e = a), (h = d));
    e = Math.min(Math.max(Math.floor(255 * (e + b)), 0), 255);
    f = Math.min(Math.max(Math.floor(255 * (f + b)), 0), 255);
    h = Math.min(Math.max(Math.floor(255 * (h + b)), 0), 255);
    return [e, f, h];
  }
  function t(a, c, b, d) {
    n ? (k[d] ? k[d].push([c, b]) : (k[d] = [[c, b]])) : p(a, c, b, c, b, d);
  }
  function p(a, c, b, d, e, f) {
    a.fillStyle = f;
    a.fillRect(c, b, d - c + 1, e - b + 1);
  }
  let m = {},
    n = !1,
    k = {};
  g.new_image = function (a, c, b) {
    a = $(a);
    a.width = c;
    a.height = b;
    a = a.getContext("2d");
    p(a, 0, 0, c, b, "#ffffff");
    return a;
  };
  g.rgb2hex = l;
  g.hsv2hex = function (a) {
    a = r(a);
    return l(a[0], a[1], a[2]);
  };
  g.color2rgb = q;
  g.rgb2hsv = function (a) {
    var c = a[0] / 255,
      b = a[1] / 255;
    let d = a[2] / 255;
    a = Math.max(c, b, d);
    let e = a - Math.min(c, b, d);
    c =
      (Math.floor(
        60 *
          (0 == e
            ? 0
            : a == c
            ? ((b - d) / e) % 6
            : a == b
            ? (d - c) / e + 2
            : (c - b) / e + 4)
      ) +
        360) %
      360;
    b = Math.min(Math.max(Math.floor(100 * (0 == a ? 0 : e / a)), 0), 100);
    a = Math.min(Math.max(Math.floor(100 * a), 0), 100);
    return [c, b, a];
  };
  g.hsv2rgb = r;
  g.set_pixel = t;
  g.cache_pixels = function (a) {
    n = a;
  };
  g.draw_pixels = function (a) {
    let c = a.canvas.width,
      b = a.getImageData(0, 0, c, a.canvas.height);
    Object.keys(k).forEach((d) => {
      let e = q(d);
      k[d].forEach((f) => {
        f = (f[1] * c + f[0]) << 2;
        let h;
        for (h = 0; 4 > h; h++) b.data[f + h] = e[h];
      });
    });
    a.putImageData(b, 0, 0);
    n = !1;
    k = {};
  };
  g.draw_line = function (a, c, b, d, e, f) {
    d == c && e == b
      ? t(a, c, b, f)
      : (a.beginPath(),
        a.moveTo(c + 0.5, b + 0.5),
        a.lineTo(d + 0.5, e + 0.5),
        (a.strokeStyle = f),
        a.stroke());
  };
  g.fill_rect = p;
  g.stroke_rect = function (a, c, b, d, e, f) {
    a.strokeStyle = f;
    a.strokeRect(c, b, d - c + 1, e - b + 1);
  };
  g.draw_string = function (a, c, b, d, e, f) {
    a.textBaseline = "middle";
    a.textAlign = "center";
    a.font = e;
    a.fillStyle = f;
    a.fillText(c, b, d);
  };
  g.draw_image = function (a, c, b, d) {
    a.drawImage(c, b, d);
  };
  g.save_canvas = function (a, c) {
    a = a.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let b = document.createElement("a");
    "string" == typeof b.download
      ? ((b.href = a), (b.download = c), b.click())
      : window.location.assign(a);
  };
});
