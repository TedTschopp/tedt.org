// js/grid/virtualGrid.js

export class VirtualGrid {
    constructor(cols, rows, apps) {
        this.cols = cols;
        this.rows = rows;
        this.apps = apps;
        this.matrix = this.buildMatrix(apps);
        this.appMap = new Map(apps.map(a => [a.id, a]));
    }

    buildMatrix(apps) {
        const m = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        for (const app of apps) {
            // FORCE INT: Protect against string coordinates causing OOB errors
            const ax = parseInt(app.x);
            const ay = parseInt(app.y);
            const ac = parseInt(app.cols);
            const ar = parseInt(app.rows);

            for (let r = 0; r < ar; r++) {
                for (let c = 0; c < ac; c++) {
                    const y = ay + r - 1;
                    const x = ax + c - 1;
                    if (this.isInBounds(x, y)) {
                        m[y][x] = app.id;
                    }
                }
            }
        }
        return m;
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
    }

    isAreaFree(x, y, w, h, ignoreId = null) {
        for (let r = 0; r < h; r++) {
            for (let c = 0; c < w; c++) {
                const targetY = y + r - 1;
                const targetX = x + c - 1;
                if (!this.isInBounds(targetX, targetY)) return false;
                const cellId = this.matrix[targetY][targetX];
                if (cellId !== null && cellId !== ignoreId) return false;
            }
        }
        return true;
    }

    getAppsInArea(x, y, w, h, ignoreId = null) {
        const foundIds = new Set();
        const foundApps = [];

        for (let r = 0; r < h; r++) {
            for (let c = 0; c < w; c++) {
                const targetY = y + r - 1;
                const targetX = x + c - 1;
                if (!this.isInBounds(targetX, targetY)) continue;
                const cellId = this.matrix[targetY][targetX];
                if (cellId !== null && cellId !== ignoreId) {
                    if (!foundIds.has(cellId)) {
                        foundIds.add(cellId);
                        foundApps.push(this.appMap.get(cellId));
                    }
                }
            }
        }
        return foundApps;
    }

    // Helper: Generic Intersection Check
    rectsIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 && x1 + w1 > x2 &&
               y1 < y2 + h2 && y1 + h1 > y2;
    }

    checkMove(sourceApp, targetX, targetY) {
        // 1. Basic Boundary Check
        if (targetX < 1 || targetY < 1 ||
            targetX + sourceApp.cols - 1 > this.cols ||
            targetY + sourceApp.rows - 1 > this.rows) {
            return { possible: false, reason: 'bounds' };
        }

        const collisions = this.getAppsInArea(targetX, targetY, sourceApp.cols, sourceApp.rows, sourceApp.id);

        // CASE A: FREE MOVE
        if (collisions.length === 0) {
            return { possible: true, type: 'move', targetX, targetY, displaced: [] };
        }

        // CASE B: ATOMIC SWAP (Big moves to Small/Empty)
        const isIntegritySound = collisions.every(c => {
            return c.x >= targetX &&
                   c.y >= targetY &&
                   (c.x + c.cols) <= (targetX + sourceApp.cols) &&
                   (c.y + c.rows) <= (targetY + sourceApp.rows);
        });

        if (isIntegritySound) {
            // Normalize Bounding Box (Fixes "Far Destination" bug)
            const minX = Math.min(...collisions.map(c => c.x));
            const minY = Math.min(...collisions.map(c => c.y));

            const proposedMoves = collisions.map(c => {
                const relX = c.x - minX;
                const relY = c.y - minY;
                return {
                    app: c,
                    nx: sourceApp.x + relX,
                    ny: sourceApp.y + relY
                };
            });

            // Validate
            const ignoreIds = [sourceApp.id, ...collisions.map(c => c.id)];
            let valid = this.canFitAt(proposedMoves, ignoreIds);

            // Stacking Protection: Do displaced apps overlap the NEW Source position?
            if (valid) {
                for (const m of proposedMoves) {
                    if (this.rectsIntersect(m.nx, m.ny, m.app.cols, m.app.rows, targetX, targetY, sourceApp.cols, sourceApp.rows)) {
                        valid = false; break;
                    }
                }
            }

            if (valid) {
                return { possible: true, type: 'swap', targetX, targetY, displaced: proposedMoves };
            }
        }

        // CASE C: REVERSE CLEARANCE (Small moves to Big)
        if (collisions.length === 1) {
            const bigApp = collisions[0];

            const offsetX = targetX - bigApp.x;
            const offsetY = targetY - bigApp.y;
            const shadowX = sourceApp.x - offsetX;
            const shadowY = sourceApp.y - offsetY;

            const moveProposal = [{ app: bigApp, nx: shadowX, ny: shadowY }];
            const ignoreIds = [sourceApp.id, bigApp.id];

            // 1. Determine Big App New Position
            let valid = this.canFitAt(moveProposal, ignoreIds);
            let bigAppNewPos = valid ? moveProposal[0] : null;

            // 2. Fallback: Try Snapping Big App to Source Origin (Strict Swap)
            if (!valid) {
                const strictProposal = [{ app: bigApp, nx: sourceApp.x, ny: sourceApp.y }];
                if (this.canFitAt(strictProposal, ignoreIds)) {
                    valid = true;
                    bigAppNewPos = strictProposal[0];
                }
            }

            // 3. Find Best Spot for Source App (A)
            // It must fit in the grid (ignoring A & B) AND not overlap New Big App
            if (valid && bigAppNewPos) {
                const candidates = [
                    // A. Top-Left of Big App Old Pos (Standard)
                    { x: bigApp.x, y: bigApp.y },
                    // B. Bottom-Left (Good for Vertical Swaps)
                    { x: bigApp.x, y: bigApp.y + bigApp.rows - sourceApp.rows },
                    // C. Top-Right (Good for Horizontal Swaps)
                    { x: bigApp.x + bigApp.cols - sourceApp.cols, y: bigApp.y },
                    // D. Bottom-Right
                    { x: bigApp.x + bigApp.cols - sourceApp.cols, y: bigApp.y + bigApp.rows - sourceApp.rows }
                ];

                // Remove duplicates to be clean
                const uniqueCandidates = [];
                const seen = new Set();
                candidates.forEach(c => {
                    const k = `${c.x},${c.y}`;
                    if(!seen.has(k)) { seen.add(k); uniqueCandidates.push(c); }
                });

                for (const cand of uniqueCandidates) {
                    // Check Intersection with New Big App
                    if (this.rectsIntersect(cand.x, cand.y, sourceApp.cols, sourceApp.rows,
                                            bigAppNewPos.nx, bigAppNewPos.ny, bigApp.cols, bigApp.rows)) {
                        continue;
                    }

                    // Check Grid Fit
                    if (this.canFitAt([{ app: sourceApp, nx: cand.x, ny: cand.y }], ignoreIds)) {
                        return {
                            possible: true, type: 'swap',
                            targetX: cand.x, targetY: cand.y,
                            displaced: [{ app: bigApp, nx: bigAppNewPos.nx, ny: bigAppNewPos.ny }]
                        };
                    }
                }
            }
        }

        return { possible: false, reason: 'collision' };
    }

    canFitAt(moves, ignoreIds) {
        for (const m of moves) {
            // 1. Bounds Check
            if (m.nx < 1 || m.ny < 1 ||
                m.nx + m.app.cols - 1 > this.cols ||
                m.ny + m.app.rows - 1 > this.rows) {
                return false;
            }

            // 2. Collision Check
            const obstacles = this.getAppsInArea(m.nx, m.ny, m.app.cols, m.app.rows, null);
            for (const obs of obstacles) {
                if (!ignoreIds.includes(obs.id)) return false;
            }
        }
        return true;
    }
}