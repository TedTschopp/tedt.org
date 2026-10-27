/**
 * Connect the Value column to Out in diagram-local coordinates. Both edges
 * share an x progression and bend near Out, so the ribbon stays below the
 * attention matrix without folding beyond either endpoint.
 */
export function valueToOutputRibbon(source, target, origin, curveOffset) {
  const startX = source.right - origin.left;
  const endX = target.left - origin.left;
  const distance = endX - startX;
  const bend = Math.min(Math.abs(curveOffset), Math.abs(distance));
  const bendX = endX - Math.sign(distance) * bend;
  const sourceTop = source.top - origin.top;
  const sourceBottom = source.bottom - origin.top;
  const targetTop = target.top - origin.top;
  const targetBottom = target.bottom - origin.top;

  return `M ${startX},${sourceTop}
    C ${bendX},${sourceTop} ${bendX},${sourceTop} ${endX},${targetTop}
    L ${endX},${targetBottom}
    C ${bendX},${sourceBottom} ${bendX},${sourceBottom} ${startX},${sourceBottom}
    Z`;
}
