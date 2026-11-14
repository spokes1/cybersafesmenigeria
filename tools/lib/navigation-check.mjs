const routeOf = href => href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
const sectionOf = section => section === 'Protect' ? 'Protect Your Business' : section;

/** One owner per topic, consistently reflected in menus, pages and search. */
export function assertNavigationOwnership({ pages, nav, search, footer }) {
  const pageByRoute = new Map(pages.map(page => [page.path, page]));
  const menus = nav.filter(item => item.columns);
  const owners = new Map();
  const labels = new Set();
  for (const menu of menus) for (const link of menu.columns.flat()) {
    const route = routeOf(link.href);
    const label = link.label.trim().toLowerCase();
    if (owners.has(route)) throw new Error(`Duplicate menu topic: ${route}`);
    if (labels.has(label)) throw new Error(`Duplicate menu label: ${link.label}`);
    const page = pageByRoute.get(route);
    if (!page || page.section !== menu.label || !route.startsWith(menu.href + '/')) {
      throw new Error(`Wrong menu owner: ${route} under ${menu.label}`);
    }
    owners.set(route, menu.label);labels.add(label);
  }
  for (const page of pages) {
    const menu = menus.find(item => page.path.startsWith(item.href + '/'));
    if (menu && !owners.has(page.path)) throw new Error(`Published topic missing from menu: ${page.path}`);
  }
  for (const entry of search) {
    const route = routeOf(entry.url);
    const owner = pageByRoute.get(route)?.section;
    const validHub = entry.section === 'Hub' && menus.some(menu => menu.href === route);
    if (owner && !validHub && sectionOf(entry.section) !== owner) throw new Error(`Wrong search owner: ${entry.url}`);
  }
  for (const group of footer) for (const link of group.links) {
    const owner = owners.get(routeOf(link.href));
    const section = group.heading === 'Company' ? 'About' : group.heading;
    if (owner && owner !== section) throw new Error(`Wrong footer owner: ${link.href}`);
  }
  return owners;
}
