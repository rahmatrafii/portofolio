import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import sharp from 'sharp';
import { projectCategories, projects, resolveProjectRoute } from '../src/data/projects.js';

test('category and detail URLs resolve within their own collection, including direct reloads', () => {
  assert.equal(resolveProjectRoute('/').type, 'home');
  assert.deepEqual(projectCategories.map(({ label }) => label), ['Web Apps', 'Mobile Apps', 'AI Integration']);
  for (const category of projectCategories) {
    const collection = projects.filter((project) => project.category === category.slug);
    assert.equal(collection.length, 4);
    assert.equal(new Set(collection.map((project) => project.slug)).size, 4);
    assert.deepEqual(resolveProjectRoute(`/${category.slug}/`), { type: 'category', category });
    for (const project of collection) {
      assert.deepEqual(resolveProjectRoute(`/${category.slug}/${project.slug}`), { type: 'detail', category, project });
      assert.equal(project.temporary, true, 'reused images must not become fabricated portfolio claims');
    }
  }
  for (const path of ['/missing', '/web-app/missing', '/web-app/pratinjau-1/extra', '/%E0%A4%A', '/web-app/%2Fpratinjau-1']) {
    assert.equal(resolveProjectRoute(path).type, 'not-found', path);
  }
});

test('old AI category and detail links open the merged AI Integration collection', () => {
  for (const alias of ['mobile-app-ai', 'web-app-ai']) {
    assert.deepEqual(resolveProjectRoute(`/${alias}`), resolveProjectRoute('/ai-integration'));
    assert.deepEqual(resolveProjectRoute(`/${alias}/pratinjau-2`), resolveProjectRoute('/ai-integration/pratinjau-2'));
    assert.equal(resolveProjectRoute(`/${alias}/missing`).type, 'not-found');
  }
});

test('all preview assets are local, compact 16:9 WebP images', async () => {
  for (const image of new Set(projects.map((project) => project.image))) {
    const buffer = readFileSync(new URL(`../public${image}`, import.meta.url));
    const metadata = await sharp(buffer).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width / metadata.height, 16 / 9);
    assert.ok(buffer.length < 80000);
  }
});

test('technology data follows the selected categories and AI pairings with local logos', () => {
  const expected = {
    'web-app': ['Next.js', 'React', 'Laravel', 'Firebase', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Motion', 'Vite', 'PHP'],
    'mobile-app': ['Flutter', 'Java', 'Supabase', 'Dart', 'PostgreSQL', 'SQLite', 'Android'],
    'ai-integration': ['Next.js', 'Flutter', 'Gemini', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Dart', 'Firebase', 'SQLite', 'Motion'],
  };
  for (const [category, allowed] of Object.entries(expected)) {
    const collection = projects.filter((project) => project.category === category);
    const displayed = new Set();
    for (const project of collection) {
      const names = project.technologies.map((technology) => technology.name);
      assert.ok(names.length >= 5 && names.length <= 6, 'every preview has a full stack and a +N overflow');
      assert.equal(new Set(names).size, names.length, 'a project never repeats a technology');
      assert.ok(names.every((name) => allowed.includes(name)), 'stacks stay within the user-selected category');
      if (names.includes('Flutter')) assert.ok(names.includes('Dart'));
      if (names.includes('Java')) assert.ok(names.includes('Android'));
      if (names.includes('Laravel')) assert.ok(names.includes('PHP'));
      if (names.includes('Supabase')) assert.ok(names.includes('PostgreSQL'));
      if (category === 'ai-integration') {
        assert.ok(['Next.js', 'Flutter'].includes(names[0]));
        assert.equal(names[1], 'Gemini', 'AI cards keep their framework/Gemini pairing first');
      }
      names.forEach((name) => displayed.add(name));
    }
    assert.deepEqual(displayed, new Set(allowed), 'all requested technologies appear in their category');
  }
  for (const icon of new Set(projects.flatMap((project) => project.technologies.map((technology) => technology.icon)))) {
    assert.ok(icon.startsWith('/icons/'));
    assert.match(readFileSync(new URL(`../public${icon}`, import.meta.url), 'utf8'), /<svg\b/);
  }
});

test('technology stacks show four logos, count overflow and expose the full stack in details', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  let preview;
  let original;
  try {
    const { default: ProjectPage } = await server.ssrLoadModule('/src/components/ProjectPage.jsx');
    const data = await server.ssrLoadModule('/src/data/projects.js');
    preview = data.projects[0];
    original = { ...preview };
    const card = () => renderToStaticMarkup(createElement(ProjectPage, { route: data.resolveProjectRoute('/web-app') }))
      .match(/<article class="project-card"[\s\S]*?<\/article>/)[0];
    assert.doesNotMatch(card(), /Contoh teknologi|project-tech-note/, 'the requested example label is removed');
    assert.doesNotMatch(card(), /project-card-category/, 'technology tags replace the repeated category');
    for (const technology of preview.technologies) {
      assert.match(readFileSync(new URL(`../public${technology.icon}`, import.meta.url), 'utf8'), /<svg\b/);
    }
    preview.temporary = false;
    const fixture = [
      { name: 'Next.js', icon: '/icons/nextjs.svg' },
      { name: 'Firebase', icon: '/icons/firebase.svg' },
      { name: 'React', icon: '/icons/react.svg' },
      { name: 'Node.js', icon: '/icons/nodejs.svg' },
      { name: 'Java', icon: '/icons/java.svg' },
      { name: 'Gemini', icon: '/icons/gemini.svg' },
    ];
    for (const count of [1, 4, 5, 6]) {
      preview.technologies = fixture.slice(0, count);
      const compact = card();
      assert.equal([...compact.matchAll(/class="project-tech-tag"/g)].length, Math.min(count, 4));
      assert.match(compact, /project-technologies-compact/);
      assert.doesNotMatch(compact, /Contoh teknologi|tabindex="0"/);
      const technologyList = compact.match(/<ul class="project-tech-list"[\s\S]*?<\/ul>/)[0];
      assert.doesNotMatch(technologyList, /<(?:a|button)\b|tabindex=|role="button"/, 'logos and count add no interactive controls');
      for (const technology of fixture.slice(0, Math.min(count, 4))) {
        assert.ok(compact.includes(`<span class="sr-only">${technology.name}</span>`), 'logo names remain accessible');
      }
      if (count > 4) {
        assert.ok(compact.includes(`>+${count - 4}<`));
        assert.ok(compact.includes(fixture.slice(4, count).map((technology) => technology.name).join(', ')), 'overflow names remain available');
      } else assert.doesNotMatch(compact, /project-tech-more/, 'no counter is shown for four or fewer technologies');
      const detail = renderToStaticMarkup(createElement(ProjectPage, { route: data.resolveProjectRoute(`/web-app/${preview.slug}`) }));
      assert.equal([...detail.matchAll(/class="project-tech-tag"/g)].length, count, 'detail shows every technology');
      assert.doesNotMatch(detail, /project-technologies-compact|project-tech-more/);
      for (const technology of preview.technologies) assert.ok(detail.includes(`<span>${technology.name}</span>`));
    }
    preview.technologies = [];
    assert.doesNotMatch(card(), /project-card-technologies|project-tech-tag/, 'empty stacks never receive sample defaults');
    delete preview.technologies;
    assert.doesNotMatch(card(), /project-card-technologies|project-tech-tag/, 'missing stacks remain empty');
  } finally {
    if (preview) Object.assign(preview, original);
    await server.close();
  }
});

test('project dialogs have an accessible close control and show the selected preview with its full technology stack', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: ProjectModal } = await server.ssrLoadModule('/src/components/ProjectModal.jsx');
    const { projects: modalProjects } = await server.ssrLoadModule('/src/data/projects.js');
    for (const project of modalProjects) {
      const markup = renderToStaticMarkup(createElement(ProjectModal, {
        selection: { project, source: null, trigger: null }, onClose() {},
      }));
      assert.match(markup, /<dialog\b[^>]*aria-labelledby="project-modal-title"/, 'the native dialog is named by its visible title');
      assert.ok(markup.includes(`<h2 id="project-modal-title">${project.title}</h2>`));
      const close = markup.match(/<button\b[^>]*class="project-modal-close"[\s\S]*?<\/button>/)[0];
      assert.match(close, /type="button"/);
      assert.match(close, /data-modal-close/);
      assert.match(close, /aria-label="Tutup pratinjau proyek"/);
      assert.ok(markup.includes(`class="project-modal-image" src="${project.image}"`), 'the selected local screenshot is shown');
      assert.ok(markup.includes(`alt="Tampilan ${project.title}"`));
      assert.equal([...markup.matchAll(/class="project-tech-tag"/g)].length, project.technologies.length, 'all five or six technologies are shown');
      assert.doesNotMatch(markup, /project-technologies-compact|project-tech-more/);
      for (const technology of project.technologies) {
        assert.ok(markup.includes(`<span>${technology.name}</span>`), 'technology names remain visible');
        assert.ok(markup.includes(`src="${technology.icon}"`), 'technology logos stay local');
      }
      assert.match(markup, /Detail proyek akan ditambahkan di sini\./, 'temporary previews keep the existing placeholder rather than inventing project claims');
      assert.doesNotMatch(markup, /<a\b/, 'the dialog adds no invented project or detail links');
      assert.doesNotMatch(markup, /Pratinjau sementara|Gambar yang sama digunakan di beberapa kategori|Konten sementara menggunakan gambar|Contoh teknologi/, 'removed disclaimers stay out of the dialog');
    }
  } finally { await server.close(); }
});

test('folder previews open collections, while only card images and CTA buttons trigger project dialogs', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Projects } = await server.ssrLoadModule('/src/components/Projects.jsx');
    const { default: ProjectPage } = await server.ssrLoadModule('/src/components/ProjectPage.jsx');
    const home = renderToStaticMarkup(createElement(Projects));
    assert.match(home, /<h2 id="projects-heading">My Projects<\/h2>/);
    assert.equal([...home.matchAll(/class="folder-sheet"/g)].length, 12);
    assert.equal([...home.matchAll(/aria-expanded="false"/g)].length, 3);
    assert.equal([...home.matchAll(/inert=""/g)].length, 3, 'closed preview links stay out of keyboard navigation');
    assert.doesNotMatch(home, /Mobile App \+ AI|Web App \+ AI|Proyek pilihan/);
    assert.doesNotMatch(home, /Lihat koleksi|folder-collection/, 'folder covers show only the category name');
    for (const category of projectCategories) {
      const folder = home.match(new RegExp(`<article[^>]*data-category="${category.slug}"[\\s\\S]*?</article>`))[0];
      const targets = [...folder.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
      assert.equal(targets.length, 4);
      assert.ok(targets.every((href) => href === `/${category.slug}`), 'every sheet opens the category');
      assert.match(folder, new RegExp(`aria-controls="previews-${category.slug}"`));
      const collection = renderToStaticMarkup(createElement(ProjectPage, { route: resolveProjectRoute(`/${category.slug}`) }));
      assert.equal([...collection.matchAll(/class="project-card"/g)].length, 4, 'all four cards use the same presentation');
      assert.match(collection, /class="collection-heading collection-heading-category"/);
      assert.match(collection, /class="collection-heading-arrow"[^>]*aria-hidden="true"[^>]*focusable="false"/, 'the header arrow remains decorative');
      assert.doesNotMatch(collection, /collection-categories|aria-label="Kategori proyek"/, 'category switching buttons are removed');
      assert.doesNotMatch(collection, /<dialog\b/, 'a project dialog is not mounted before a trigger is activated');
      const back = collection.match(/<a class="collection-home"[\s\S]*?<\/a>/)[0];
      assert.match(back, /href="\/#projects"/);
      assert.match(back, /aria-label="Kembali ke portofolio"/);
      assert.match(back, /<svg[\s\S]*aria-hidden="true"/);
      assert.doesNotMatch(back, /<img|>Kembali ke portofolio</, 'back is an icon with an accessible name, not a visible text link');
      assert.match(collection, /loading="eager"/);
      const imageNames = [...collection.matchAll(/view-transition-name:([^";]+)/g)].map((match) => match[1]);
      assert.equal(new Set(imageNames).size, 4, 'reused screenshots still have unique transition identities');
      assert.doesNotMatch(collection, /Pratinjau sementara|Gambar yang sama digunakan di beberapa kategori/, 'the requested footer disclaimer is removed');
      assert.doesNotMatch(collection, /Konten sementara menggunakan gambar dari koleksi proyek/, 'temporary-copy repetition stays out of every card');
      assert.deepEqual([...collection.matchAll(/data-project-index="(\d)"/g)].map((match) => Number(match[1])), [0, 1, 2, 3], 'each flying sheet has its own grid destination even with reused assets');
      for (const project of projects.filter((item) => item.category === category.slug)) {
        const card = [...collection.matchAll(/<article class="project-card"[\s\S]*?<\/article>/g)]
          .map(([markup]) => markup).find((markup) => markup.includes(`<h2>${project.title}</h2>`));
        assert.ok(card, 'the card is a non-interactive article');
        assert.match(card, /^<article class="project-card"><img\b[^>]*data-project-index=/, 'screenshots remain direct children for return transitions');
        assert.doesNotMatch(card, /onclick=|role="link"|tabindex=/, 'the card has no delegated click target or extra focus stop');
        assert.doesNotMatch(card, /<a\b|href=/, 'card interactions cannot navigate to a standalone detail URL');
        const triggers = [...card.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)].map(([markup]) => markup);
        assert.equal(triggers.length, 2, 'only the screenshot and CTA trigger the dialog');
        assert.match(triggers[0], /class="project-card-preview"/);
        assert.match(triggers[1], /class="project-card-action"/);
        assert.ok(triggers[0].includes(`aria-label="Lihat detail ${project.title}"`));
        assert.ok(triggers[1].includes(`aria-label="Lihat proyek ${project.title}"`));
        for (const trigger of triggers) {
          assert.match(trigger, /type="button"/);
          assert.match(trigger, /aria-haspopup="dialog"/);
          assert.doesNotMatch(trigger, /<h2|project-tech-/, 'the title and technologies are outside dialog triggers');
        }
        const detail = renderToStaticMarkup(createElement(ProjectPage, { route: resolveProjectRoute(`/${category.slug}/${project.slug}`) }));
        assert.ok(detail.includes(`href="/${category.slug}"`), 'detail can return to its category');
        assert.ok(detail.includes(`aria-label="Kembali ke koleksi ${category.label}"`));
        assert.ok(detail.includes(project.title));
        assert.doesNotMatch(detail, /collection-heading-category|collection-heading-arrow/, 'oversized headings apply only to collections');
        assert.ok(detail.includes(`view-transition-name:project-${category.slug}-${project.slug}`), 'card and detail share the same image identity');
        assert.doesNotMatch(detail, /Pratinjau sementara|Gambar yang sama digunakan di beberapa kategori/, 'detail also omits the removed footer disclaimer');
      }
    }
    const missing = renderToStaticMarkup(createElement(ProjectPage, { route: resolveProjectRoute('/web-app/missing') }));
    assert.match(missing, /Halaman tidak ditemukan/);
    assert.match(missing, /href="\/web-app"/);
  } finally { await server.close(); }
});
