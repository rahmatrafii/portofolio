import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attachProjectNavigation, canNavigateProjectLink, validProjectOrigin } from '../src/lib/projectNavigation.js';

const deferred = () => {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
};

function emit(target, type, values = {}) {
  const event = new Event(type, { cancelable: true });
  Object.entries(values).forEach(([key, value]) => Object.defineProperty(event, key, { value }));
  target.dispatchEvent(event);
  return event;
}

function environment({ reduced = false, path = '/', transition } = {}) {
  const media = Object.assign(new EventTarget(), { matches: reduced });
  const doc = Object.assign(new EventTarget(), {
    visibilityState: 'visible', title: 'Rafi | AI Engineer', documentElement: { dataset: {} },
  });
  const frames = new Set();
  const renders = [];
  const calls = [];
  const flights = [];
  const browser = Object.assign(new EventTarget(), {
    location: new URL(path, 'http://localhost:5173'), scrollY: path === '/' ? 4200 : 0,
    innerWidth: 1440, innerHeight: 900, CSS: { escape: (value) => value },
    matchMedia: () => media,
    scrollTo({ top }) { this.scrollY = top; },
    getComputedStyle: () => ({ scrollPaddingTop: '112px' }),
    Image: class { decode() { return Promise.resolve(); } },
  });
  const entries = [{ href: browser.location.href, state: { projectFolder: 'web-app' } }];
  let index = 0;
  browser.history = {
    scrollRestoration: 'auto',
    get state() { return entries[index].state; },
    replaceState(state, _, href) {
      entries[index] = { state: structuredClone(state), href: href ? new URL(href, browser.location).href : browser.location.href };
      browser.location = new URL(entries[index].href);
    },
    pushState(state, _, href) {
      entries.splice(index + 1);
      entries.push({ state: structuredClone(state), href: new URL(href, browser.location).href });
      index++;
      browser.location = new URL(entries[index].href);
    },
  };
  function link(href, category, sheetIndex = 0) {
    const node = {
      href: new URL(href, browser.location).href, target: '', dataset: { sheetIndex: String(sheetIndex) },
      hasAttribute: () => false, getAttribute: () => href,
      matches: (selector) => selector === '.folder-sheet' && Boolean(category),
      closest: (selector) => selector === 'a[href]' ? node : { dataset: { category }, querySelector: () => ({ getBoundingClientRect: () => ({ top: 300 }) }) },
      focus() { doc.activeElement = node; calls.push('focus-sheet'); },
    };
    return node;
  }
  const sheets = new Map();
  for (const category of ['web-app', 'mobile-app', 'ai-integration']) {
    for (let i = 0; i < 4; i++) sheets.set(`${category}:${i}`, link(`/${category}`, category, i));
  }
  const home = { querySelector(selector) {
    const match = selector.match(/data-category="([^"]+)".*data-sheet-index="(\d)"/);
    if (match) return sheets.get(`${match[1]}:${match[2]}`);
    if (selector === '#projects') return { getBoundingClientRect: () => ({ top: 5000 - browser.scrollY }), focus() { calls.push('focus-projects'); } };
    return null;
  } };
  const page = {
    querySelector: () => ({ focus() { calls.push('focus-heading'); } }),
    animate() { return { finished: Promise.resolve(), cancel() { calls.push('cancel-fade'); } }; },
  };
  const navigation = {
    pause() { calls.push('pause'); },
    resume() { calls.push('resume'); },
    restore(y) { calls.push(`restore:${y}`); browser.scrollY = y; },
  };
  const cleanup = attachProjectNavigation({ render: (view) => renders.push(view), home: () => home, page: () => page, navigation }, {
    browser, doc, frameLoop: { postRender: (callback) => frames.add(callback) }, cancel: (callback) => frames.delete(callback),
    makeTransition(sheet) {
      const flight = transition?.(sheet) ?? {
        leaveFolder: () => Promise.resolve(true), reveal: () => Promise.resolve(true),
        returnToFolder() { calls.push(`return:${browser.scrollY}:${sheet.dataset.sheetIndex}`); return Promise.resolve(true); },
        dispose() { calls.push('dispose'); },
      };
      flights.push(flight);
      return flight;
    },
  });
  async function flush(count = 5) {
    for (let i = 0; i < count; i++) {
      await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
      const pending = [...frames]; frames.clear(); pending.forEach((callback) => callback());
    }
    await Promise.resolve(); await Promise.resolve();
  }
  function click(node, extra = {}) { return emit(doc, 'click', { target: node, button: 0, ...extra }); }
  function history(delta) {
    index += delta;
    browser.location = new URL(entries[index].href);
    emit(browser, 'popstate', { state: entries[index].state });
  }
  return { browser, doc, media, calls, flights, frames, entries, renders, sheets, link, click, history, flush, cleanup };
}

test('the category is prepared before departure and its URL waits until the upward sheets leave', async () => {
  const passes = deferred();
  const reveal = deferred();
  const e = environment({ transition: () => ({
    async leaveFolder(page, commit) { assert.ok(page); await passes.promise; commit(); return true; },
    reveal: () => reveal.promise, dispose() {} }) });
  assert.equal(e.click(e.sheets.get('web-app:2')).defaultPrevented, true);
  await e.flush();
  assert.equal(e.browser.location.pathname, '/');
  assert.equal(e.entries.length, 1);
  assert.equal(e.renders.at(-1).incoming.category.slug, 'web-app');
  assert.equal(e.renders.at(-1).showHome, true);
  assert.equal(e.browser.location.pathname, '/', 'the route stays Home while sheets float upward');
  passes.resolve(true); await e.flush();
  assert.equal(e.browser.location.pathname, '/web-app');
  assert.equal(e.renders.at(-1).showHome, false);
  assert.equal(e.browser.history.state.portfolio.origin.index, 2);
  assert.equal(e.browser.history.state.portfolio.origin.scrollY, 4200);
  assert.equal(e.doc.documentElement.dataset.projectTransition, 'true', 'the collection is revealed after the sheets leave');
  assert.ok(!e.calls.includes('focus-heading'));
  reveal.resolve(true); await e.flush();
  assert.equal(e.entries.length, 2, 'revealing the category does not push the URL a second time');
  assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
  assert.ok(e.calls.includes('focus-heading'));
  assert.equal(e.browser.history.scrollRestoration, 'auto');
  e.cleanup();
});

test('Back restores Home geometry and the selected slot before returning the sheet; Forward remains client-side', async () => {
  const e = environment();
  e.click(e.sheets.get('web-app:3')); await e.flush();
  e.browser.scrollY = 680;
  e.history(-1);
  assert.equal(e.renders.at(-1).returning, true);
  assert.equal(e.renders.at(-1).restoredFolder, 'web-app');
  await e.flush();
  assert.equal(e.browser.location.pathname, '/');
  assert.equal(e.browser.scrollY, 4200);
  assert.ok(e.calls.includes('return:4200:3'));
  assert.equal(e.doc.activeElement, e.sheets.get('web-app:3'));
  assert.equal(e.renders.at(-1).route.type, 'home');
  e.history(1); await e.flush();
  assert.equal(e.browser.location.pathname, '/web-app');
  assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
  e.cleanup();
});

for (const input of ['pointerdown', 'Escape']) {
  for (const phase of ['preparation', 'landing']) {
    test(`${input} during Home return ${phase} settles Home instead of reopening the collection`, async () => {
      const landing = deferred();
      let returning = 0;
      const e = environment({ transition: () => ({
        leaveFolder: () => Promise.resolve(true), reveal: () => Promise.resolve(true),
        returnToFolder() { returning++; return landing.promise; }, dispose() {},
      }) });
      try {
        e.click(e.sheets.get('web-app:2')); await e.flush();
        assert.equal(e.browser.location.pathname, '/web-app');
        e.click(e.link('/#projects'));
        if (phase === 'landing') {
          await e.flush();
          assert.equal(returning, 1, 'the sheets are still returning when input arrives');
        } else assert.equal(returning, 0, 'input can also arrive before Home geometry is restored');
        assert.equal(e.renders.at(-1).returning, true);
        if (input === 'Escape') emit(e.doc, 'keydown', { key: input });
        else {
          emit(e.browser, input);
          assert.equal(e.click({ closest: () => null }).defaultPrevented, false, 'an empty-area click remains native');
        }
        await e.flush();
        assert.equal(e.browser.location.pathname, '/');
        assert.equal(e.browser.location.hash, '#projects');
        assert.equal(e.browser.scrollY, 4200);
        assert.equal(e.renders.at(-1).route.type, 'home');
        assert.equal(e.renders.at(-1).returning, undefined, 'Home is interactive after settling');
        assert.equal(e.entries.length, 3, 'the Home link commits exactly once');
        assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
        assert.equal(e.browser.history.scrollRestoration, 'auto');
        const renders = e.renders.length;
        const focus = e.doc.activeElement;
        landing.resolve(true); await e.flush();
        assert.equal(e.renders.length, renders, 'late landing completion cannot render the old route');
        assert.equal(e.entries.length, 3);
        assert.equal(e.doc.activeElement, focus, 'late landing completion cannot change focus');
      } finally { e.cleanup(); }
    });
  }
}

test('reduced motion navigates categories/details without a flight and preserves the origin for the Home link', async () => {
  const e = environment({ reduced: true });
  e.click(e.sheets.get('ai-integration:1')); await e.flush();
  assert.equal(e.browser.location.pathname, '/ai-integration');
  e.click(e.link('/ai-integration/pratinjau-2')); await e.flush();
  assert.equal(e.browser.location.pathname, '/ai-integration/pratinjau-2');
  e.click(e.link('/#projects')); await e.flush();
  assert.equal(e.browser.location.pathname, '/');
  assert.equal(e.browser.location.hash, '#projects');
  assert.equal(e.browser.scrollY, 4200);
  assert.equal(e.flights.length, 0);
  assert.equal(e.doc.activeElement, e.sheets.get('ai-integration:1'));
  e.cleanup();
});

test('a direct category entry has a simple return and a valid Home anchor, without inventing a source sheet', async () => {
  const e = environment({ path: '/web-app' });
  e.click(e.link('/#projects')); await e.flush();
  assert.equal(e.browser.location.pathname, '/');
  assert.equal(e.browser.scrollY, 4888);
  assert.equal(e.flights.length, 0);
  assert.ok(e.calls.includes('focus-projects'));
  e.cleanup();
});

test('new navigation wins over a pending departure and late promises cannot commit the older category', async () => {
  const first = deferred();
  const e = environment({ transition: (sheet) => sheet.href.includes('/web-app') ? {
    leaveFolder: () => first.promise, reveal: () => Promise.resolve(true), dispose() {},
  } : undefined });
  e.click(e.sheets.get('web-app:0')); await e.flush();
  e.click(e.sheets.get('mobile-app:0')); await e.flush();
  first.resolve(true); await e.flush();
  assert.equal(e.browser.location.pathname, '/mobile-app');
  assert.equal(e.entries.length, 2);
  assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
  e.cleanup();
});

for (const interruption of ['resize', 'wheel', 'touchstart', 'visibilitychange', 'reduced']) {
  test(`${interruption} settles a pending transition and rejects its old animation completion`, async () => {
    const departure = deferred();
    let disposed = 0;
    const e = environment({ transition: () => ({ leaveFolder: () => departure.promise, dispose() { disposed++; } }) });
    e.click(e.sheets.get('web-app:0')); await e.flush();
    if (interruption === 'reduced') { e.media.matches = true; emit(e.media, 'change'); }
    else if (interruption === 'visibilitychange') { e.doc.visibilityState = 'hidden'; emit(e.doc, interruption); }
    else emit(e.browser, interruption);
    await e.flush();
    departure.resolve(true); await e.flush();
    assert.equal(e.browser.location.pathname, '/web-app');
    assert.equal(e.entries.length, 2);
    assert.equal(disposed, 1);
    assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
    assert.equal(e.browser.history.scrollRestoration, 'auto');
    e.cleanup();
  });
}

test('Escape can cancel an uncommitted click; cleanup removes listeners and queued return work across StrictMode remounts', async () => {
  const departure = deferred();
  const e = environment({ transition: () => ({ leaveFolder: () => departure.promise, dispose() {} }) });
  e.click(e.sheets.get('web-app:0')); await e.flush();
  emit(e.doc, 'keydown', { key: 'Escape' });
  departure.resolve(true); await e.flush();
  assert.equal(e.browser.location.pathname, '/');
  assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
  e.cleanup();
  const count = e.renders.length;
  assert.equal(e.click(e.sheets.get('web-app:0')).defaultPrevented, false);
  emit(e.browser, 'resize'); await e.flush();
  assert.equal(e.renders.length, count);
  assert.equal(e.frames.size, 0);
});

test('non-links, modified clicks, downloads, external links and native Home hashes keep browser behavior', async () => {
  const e = environment();
  assert.equal(e.click({ closest: () => null }).defaultPrevented, false, 'card background, title and technology icons have no link to intercept');
  const sheet = e.sheets.get('web-app:0');
  for (const extra of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    assert.equal(e.click(sheet, extra).defaultPrevented, false);
  }
  assert.equal(e.click(e.link('#about')).defaultPrevented, false);
  assert.equal(e.click(e.link('https://example.com/web-app')).defaultPrevented, false);
  const download = { ...sheet, hasAttribute: (name) => name === 'download' };
  assert.equal(canNavigateProjectLink({ button: 0 }, download, e.browser.location), false);
  assert.equal(validProjectOrigin({ category: 'invented', index: 0, scrollY: 0, width: 100, height: 100, folderTop: 0 }), null);
  assert.equal(e.entries.length, 1);
  e.cleanup();
});

test('a new pointer action cancels an uncommitted departure without hijacking the next action', async () => {
  const departure = deferred();
  const e = environment({ transition: () => ({ leaveFolder: () => departure.promise, dispose() {} }) });
  e.click(e.sheets.get('web-app:0')); await e.flush();
  emit(e.browser, 'pointerdown');
  departure.resolve(true); await e.flush();
  assert.equal(e.browser.location.pathname, '/');
  assert.equal(e.entries.length, 1);
  assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
  e.cleanup();
});

test('a breakpoint change while in the collection remeasures the destination folder rather than using stale scroll', async () => {
  const e = environment();
  const source = e.sheets.get('web-app:1');
  e.click(source); await e.flush();
  e.browser.innerWidth = 375; e.browser.innerHeight = 812;
  const closest = source.closest;
  source.closest = (selector) => selector === '.project-folder'
    ? { querySelector: () => ({ getBoundingClientRect: () => ({ top: 2100 - e.browser.scrollY }) }) }
    : closest(selector);
  e.history(-1); await e.flush();
  assert.equal(e.browser.scrollY, 1800);
  assert.ok(e.calls.includes('return:1800:1'));
  assert.equal(e.doc.activeElement, source);
  e.cleanup();
});

test('a failed departure falls back to the requested collection and cleanup cancels pending return frames', async () => {
  const e = environment({ transition: () => ({ leaveFolder: () => Promise.resolve(false), dispose() {} }) });
  e.click(e.sheets.get('web-app:0')); await e.flush();
  assert.equal(e.browser.location.pathname, '/web-app');
  assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
  e.history(-1);
  assert.ok(e.frames.size > 0);
  const count = e.renders.length;
  e.cleanup(); await e.flush();
  assert.equal(e.frames.size, 0);
  assert.equal(e.renders.length, count);
  assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
});

test('collection and detail share a native transition in both directions and preserve history scroll', async () => {
  const e = environment({ path: '/web-app' });
  const views = [];
  e.doc.startViewTransition = (update) => {
    const done = deferred();
    const view = { update, done, skipped: 0 };
    views.push(view);
    return { ready: Promise.resolve(), finished: done.promise, skipTransition() { view.skipped++; done.resolve(); } };
  };
  e.browser.scrollY = 620;
  e.click(e.link('/web-app/pratinjau-3'));
  assert.equal(e.browser.location.pathname, '/web-app', 'capture old image before committing the detail');
  views[0].update();
  assert.equal(e.browser.location.pathname, '/web-app/pratinjau-3');
  assert.equal(e.browser.scrollY, 0);
  views[0].done.resolve(); await e.flush();
  assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
  assert.ok(e.calls.includes('focus-heading'));
  e.history(-1);
  assert.equal(views.length, 2);
  views[1].update();
  assert.equal(e.browser.scrollY, 620);
  views[1].done.resolve(); await e.flush();
  assert.equal(e.renders.at(-1).route.type, 'category');
  e.cleanup();
});

test('the detail back link returns to the collection position where the card was opened', async () => {
  const e = environment({ path: '/web-app' });
  e.browser.scrollY = 620;
  e.click(e.link('/web-app/pratinjau-3')); await e.flush();
  assert.equal(e.browser.location.pathname, '/web-app/pratinjau-3');
  assert.equal(e.browser.scrollY, 0);
  e.click(e.link('/web-app')); await e.flush();
  assert.equal(e.browser.location.pathname, '/web-app');
  assert.equal(e.browser.scrollY, 620);
  assert.equal(e.entries.length, 3);
  e.cleanup();

  const direct = environment({ path: '/web-app/pratinjau-1' });
  direct.click(direct.link('/web-app')); await direct.flush();
  assert.equal(direct.browser.scrollY, 0, 'a direct detail visit does not invent a collection position');
  direct.cleanup();
});

test('cancelled native snapshots cannot commit after a newer navigation or cleanup', async () => {
  const e = environment({ path: '/web-app' });
  const views = [];
  e.doc.startViewTransition = (update) => {
    const done = deferred();
    const view = { update, skipped: false };
    views.push(view);
    return { ready: Promise.reject(new Error('snapshot skipped')), finished: done.promise,
      skipTransition() { view.skipped = true; done.resolve(); } };
  };
  e.click(e.link('/web-app/pratinjau-1'));
  e.click(e.link('/mobile-app')); await e.flush();
  views[0].update(); await e.flush();
  assert.equal(views[0].skipped, true);
  assert.equal(e.browser.location.pathname, '/mobile-app');
  e.click(e.link('/mobile-app/pratinjau-2'));
  e.cleanup();
  views[1].update(); await e.flush();
  assert.equal(views[1].skipped, true);
  assert.equal(e.browser.location.pathname, '/mobile-app');
  assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
});

test('reduced motion bypasses native image transitions; resize settles a pending snapshot once', async () => {
  const e = environment({ path: '/web-app', reduced: true });
  e.doc.startViewTransition = () => { throw new Error('reduced motion must bypass capture'); };
  e.click(e.link('/web-app/pratinjau-1')); await e.flush();
  assert.equal(e.browser.location.pathname, '/web-app/pratinjau-1');
  e.media.matches = false;
  let update;
  const done = deferred();
  let skipped = 0;
  e.doc.startViewTransition = (callback) => {
    update = callback;
    return { ready: Promise.resolve(), finished: done.promise, skipTransition() { skipped++; done.resolve(); } };
  };
  e.click(e.link('/web-app'));
  emit(e.browser, 'resize'); await e.flush();
  update(); await e.flush();
  assert.equal(skipped, 1);
  assert.equal(e.browser.location.pathname, '/web-app');
  assert.equal(e.entries.length, 3, 'the skipped snapshot does not push a duplicate history entry');
  assert.equal(e.doc.documentElement.dataset.projectTransition, undefined);
  e.cleanup();
});


