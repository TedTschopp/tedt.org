export const ga = (..._args: any[]) => {};
export function scrollToDiv(e: Event, _goTo: string) { e.stopPropagation(); document.getElementById("inside-ai-guide")?.scrollIntoView({behavior: "auto"}); }
export const onClickReadMore = scrollToDiv;
