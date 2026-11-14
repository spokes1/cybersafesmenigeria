// Icons live in one sprite: public/assets/icons.svg (2px line icons, drawn
// on a 24px grid, stroked in the current text colour). Add new symbols there.
export const SPRITE = '/assets/icons.svg';

export function icon(name) {
  return `<svg class="i" aria-hidden="true"><use href="${SPRITE}#${name}"/></svg>`;
}
