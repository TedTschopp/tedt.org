// From http://www.redblobgames.com/grids/hexagons/implementation.html
// Copyright 2015 Red Blob Games <redblobgames@gmail.com>
// License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>

// This code is used to generate the diagrams on implementation.html

/* global Hex, Layout, Point */

function drawHex(ctx, layout, hex) {
    var corners = layout.polygonCorners(hex);
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.moveTo(corners[5].x, corners[5].y);
    for (var i = 0; i < 6; i++) {
        ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.stroke();
}


function colorForHex(hex) {
    // Match the color style used in the main article
    if (hex.q === 0 && hex.r === 0 && hex.s === 0) {
        return "hsl(0, 50%, 0%)";
    } else if (hex.q === 0) {
        return "hsl(90, 70%, 35%)";
    } else if (hex.r === 0) {
        return "hsl(200, 100%, 35%)";
    } else if (hex.s === 0) {
        return "hsl(300, 40%, 50%)";
    } else {
        return "hsl(0, 0%, 50%)";
    }
}


function drawHexLabel(ctx, layout, hex) {
    var center = layout.hexToPixel(hex);
    ctx.fillStyle = colorForHex(hex);
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(hex.len() === 0? "q,r,s" : (hex.q + "," + hex.r + "," + hex.s), center.x, center.y);
}


function permuteQRS(q, r, s) { return new Hex(q, r, s); }
function permuteSRQ(q, r, s) { return new Hex(s, r, q); }
function permuteSQR(q, r, s) { return new Hex(s, q, r); }
function permuteRQS(q, r, s) { return new Hex(r, q, s); }
function permuteRSQ(q, r, s) { return new Hex(r, s, q); }
function permuteQSR(q, r, s) { return new Hex(q, s, r); }

function shapeParallelogram(q1, r1, q2, r2, constructor) {
    var hexes = [];
    for (var q = q1; q <= q2; q++) {
        for (var r = r1; r <= r2; r++) {
            hexes.push(constructor(q, r, -q-r));
        }
    }
    return hexes;
}


function shapeTriangle1(size) {
    var hexes = [];
    for (var q = 0; q <= size; q++) {
        for (var r = 0; r <= size-q; r++) {
            hexes.push(new Hex(q, r, -q-r));
        }
    }
    return hexes;
}


function shapeTriangle2(size) {
    var hexes = [];
    for (var q = 0; q <= size; q++) {
        for (var r = size-q; r <= size; r++) {
            hexes.push(new Hex(q, r, -q-r));
        }
    }
    return hexes;
}


function shapeHexagon(size) {
    var hexes = [];
    for (var q = -size; q <= size; q++) {
        var r1 = Math.max(-size, -q-size);
        var r2 = Math.min(size, -q+size);
        for (var r = r1; r <= r2; r++) {
            hexes.push(new Hex(q, r, -q-r));
        }
    }
    return hexes;
}


function shapeRectangle(w, h, constructor) {
    var hexes = [];
    var i1 = -Math.floor(w/2), i2 = i1 + w;
    var j1 = -Math.floor(h/2), j2 = j1 + h;
    for (var j = j1; j < j2; j++) {
        var jOffset = -Math.floor(j/2);
        for (var i = i1 + jOffset; i < i2 + jOffset; i++) {
            hexes.push(constructor(i, j, -i-j));
        }
    }
    return hexes;
}


function drawGrid(id, backgroundColor, withLabels, layout, hexes) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (window.devicePixelRatio && window.devicePixelRatio != 1) {
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    if (hexes === undefined) {
        hexes = shapeRectangle(15, 15, permuteQRS);
    }
    
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width/2, height/2);
    hexes.forEach(function(hex) {
        drawHex(ctx, layout, hex);
        if (withLabels) drawHexLabel(ctx, layout, hex);
    });
}

drawGrid("layout-test-orientation-pointy", //Canvis ID
         "hsla(60, 10%, 90%, 0)",          // Background color
         false,                            // With Lables?
         new Layout(Layout.pointy,         // :aupit 
                    new Point(10, 10), 
                    new Point(0, 0)
                    ),
         shapeHexagon(50)
         );
drawGrid("layout-test-orientation-pointy", 
         "hsla(60, 10%, 90%, 0)", 
         false,
         new Layout(Layout.pointy, 
                    new Point(90, 90), 
                    new Point(0, 0)
                ),
         shapeHexagon(30)
         );

drawGrid("layout-test-orientation-pointy", 
         "hsla(60, 10%, 90%, 0)", 
         false,
         new Layout(Layout.pointy, 
                    new Point(540, 540), 
                    new Point(0, 0)
                ),
         shapeHexagon(10)
         );



/*drawGrid("layout-test-size-1", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.pointy, new Point(10, 10), new Point(0, 0)));
drawGrid("layout-test-size-2", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.pointy, new Point(20, 20), new Point(0, 0)));
drawGrid("layout-test-size-3", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.pointy, new Point(40, 40), new Point(0, 0)));

drawGrid("layout-test-size-tall", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.flat, new Point(15, 25), new Point(0, 0)));
drawGrid("layout-test-size-wide", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.flat, new Point(25, 15), new Point(0, 0)));

drawGrid("layout-test-y-down", "hsl(60, 10%, 85%)", true,
         new Layout(Layout.pointy, new Point(25, 25), new Point(0, 0)));
drawGrid("layout-test-y-up", "hsl(60, 10%, 90%)", true,
         new Layout(Layout.pointy, new Point(25, -25), new Point(0, 0)));

drawGrid("shape-pointy-parallelogram-qr", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.pointy, new Point(15, 15), new Point(0, 0)),
         shapeParallelogram(-2, -2, 2, 2, permuteQRS));
drawGrid("shape-pointy-parallelogram-sq", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.pointy, new Point(15, 15), new Point(0, 0)),
         shapeParallelogram(-2, -2, 2, 2, permuteSQR));
drawGrid("shape-pointy-parallelogram-rs", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.pointy, new Point(13, 13), new Point(0, 0)),
         shapeParallelogram(-2, -2, 2, 2, permuteRSQ));

drawGrid("shape-flat-parallelogram-qr", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.flat, new Point(15, 15), new Point(0, 0)),
         shapeParallelogram(-2, -2, 2, 2, permuteQRS));
drawGrid("shape-flat-parallelogram-sq", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.flat, new Point(13, 13), new Point(0, 0)),
         shapeParallelogram(-2, -2, 2, 2, permuteSQR));
drawGrid("shape-flat-parallelogram-rs", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.flat, new Point(15, 15), new Point(0, 0)),
         shapeParallelogram(-2, -2, 2, 2, permuteRSQ));

drawGrid("shape-pointy-triangle-1", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.pointy, new Point(15, 15), new Point(-70, -60)),
         shapeTriangle1(5));
drawGrid("shape-pointy-triangle-2", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.pointy, new Point(15, 15), new Point(-130, -60)),
         shapeTriangle2(5));

drawGrid("shape-flat-triangle-1", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.flat, new Point(15, 15), new Point(-60, -70)),
         shapeTriangle1(5));
drawGrid("shape-flat-triangle-2", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.flat, new Point(15, 15), new Point(-60, -130)),
         shapeTriangle2(5));

drawGrid("shape-pointy-hexagon", 
         "hsl(60, 10%, 85%)", 
         false,
         new Layout(Layout.pointy, new Point(15, 15), new Point(0, 0)),
         shapeHexagon(3));


drawGrid("shape-flat-hexagon", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.flat, new Point(15, 15), new Point(0, 0)),
         shapeHexagon(3));

drawGrid("shape-pointy-rectangle-qr", "hsl(200, 20%, 87%)", false,
         new Layout(Layout.pointy, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteQRS));
drawGrid("shape-pointy-rectangle-rs", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.pointy, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteRSQ));
drawGrid("shape-pointy-rectangle-sq", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.pointy, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteSQR));
drawGrid("shape-pointy-rectangle-rq", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.pointy, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteRQS));
drawGrid("shape-pointy-rectangle-sr", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.pointy, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteSRQ));
drawGrid("shape-pointy-rectangle-qs", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.pointy, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteQSR));

drawGrid("shape-flat-rectangle-qr", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.flat, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteQRS));
drawGrid("shape-flat-rectangle-rs", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.flat, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteRSQ));
drawGrid("shape-flat-rectangle-sq", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.flat, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteSQR));
drawGrid("shape-flat-rectangle-rq", "hsl(200, 15%, 85%)", false,
         new Layout(Layout.flat, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteRQS));
drawGrid("shape-flat-rectangle-sr", "hsl(60, 10%, 90%)", false,
         new Layout(Layout.flat, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteSRQ));
drawGrid("shape-flat-rectangle-qs", "hsl(60, 10%, 85%)", false,
         new Layout(Layout.flat, new Point(10, 10), new Point(0, 0)),
         shapeRectangle(8, 6, permuteQSR));
*/
