import { gsap } from 'gsap';
import { Flip } from 'gsap/dist/Flip';

gsap.registerPlugin(Flip);

// Honor elapsed time on throttled devices so reveal animations do not leave cells hidden.
gsap.ticker.lagSmoothing(0);

export * from 'gsap';
export { Flip };
