// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// prng.js
// seeded pseudo-random number generator
//
// written by drow <drow@bin.sh>
// http://creativecommons.org/licenses/by-nc/3.0/

'use strict';

((globalContext, initialize) => initialize(globalContext))(window, globalContext => {
    function generateRandomNumber(maxValue) {
        seed = 1103515245 * seed + 12345;
        seed &= 2147483647;
        return maxValue > 1 ? (seed >> 8) % maxValue : 0;
    }

    let seed = Date.now();

    globalContext.set_Prng_Seed = function (input) {
        if (typeof input === "number") {
            seed = Math.floor(input);
        } else if (typeof input === "string") {
            let hash = 42;
            for (let index = 0; index < input.length; index++) {
                hash = (hash << 5) - hash + input.charCodeAt(index);
                hash &= 2147483647;
            }
            seed = hash;
        } else {
            seed = Date.now();
        }
        return seed;
    };

    globalContext.random = generateRandomNumber;

    globalContext.randomFloatingPoint = function () {
        return generateRandomNumber(32768) / 32768;
    };
});

