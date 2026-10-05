# Content Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved content fixes from the audit report §6 (items 1–5 plus dead-code cleanup) to sumbono.github.io without changing the visual template.

**Architecture:** Single-page static site (`index.html` + `assets/css/style.css`). All edits are in-place HTML content changes plus a small appended CSS block for the new footer/captions. No framework, no build step, no test suite — verification is grep-based checks plus an HTML parse smoke test.

**Tech Stack:** HTML5, Bootstrap 4 (vendored), jQuery (vendored), custom CSS.

**Spec:** `/home/bono/portfolio/audit-report.md` §4 (minor fixes), §6 (priority order items 1–5 and dead-code cleanup). The user approved "Content pass first" on 2026-10-05.

## Global Constraints

- Do not change colours, fonts, layout grid, or section order (redesign is a later, separate pass).
- Do not invent metrics, outcomes, or claims anywhere; all copy must be derived from existing text in the repo.
- Introduce **no new hex colours**: greys are expressed as `rgba(255, 255, 255, α)` (the template palette is white-on-navy; measured existing hexes: `#010e1b`, `#09203a`, `#12d640`, `#1c7d32`, `#dee2e6`, `#ffc107`).
- This is a run-once migration, not an idempotent script: each task's "expected" grep results assume the pre-state; re-running a completed task will fail its gate by design.
- Keep the GTM noscript `<iframe style="display:none;visibility:hidden">` — it is the one allowed inline style (global gate in Task 8).
- Keep the BootstrapMade license comment in `<head>` (index.html lines ~50–55) — the free license requires retaining it.
- Keep Google Tag Manager (`GTM-5BB8W2X`); remove only the dead Universal Analytics tag (`UA-169007209-3`).
- Every commit message ends with `Co-Authored-By: Claude Code <noreply@anthropic.com>`.
- Work only inside the worktree `/home/bono/portfolio/sumbono.github.io/.claude/worktrees/content-pass`.

## Review Focus

- **JS-dependent behaviours after hero edit:** removing typed.js must not break `main.js` (nav, mobile nav). Test: grep that `Typed` appears nowhere in index.html after Task 2; page still contains `assets/js/main.js` include.
- **Filter tabs after id fix:** renaming the duplicate `portfolio-flters` id must not break Isotope filtering. Test: `grep -c 'id="portfolio-flters"' index.html` returns exactly 1.
- **Commented-block removal must not eat live markup:** run `python3 -c` HTMLParser balance check after Task 3 (script in each task).
- **Overlay still works after captions:** hover overlay (`.portfolio-info`) must still show the details link after always-visible captions are added. Test: `.portfolio-wrap:hover .portfolio-info` rule still exists in style.css.
- **Mobile nav unaffected:** `main.js` clones `.nav-menu` — do not change `.nav-menu` structure. Test: nav `<ul>` still contains the same 8 `<li>` items after all tasks.

---

### Task 1: Head/meta fixes + dead analytics

**Files:**
- Modify: `index.html` (head section, lines 1–56)

**Interfaces:**
- Produces: `<title>` "Sumbono — Senior Fullstack Engineer"; valid meta description; single analytics tag (GTM only).

- [ ] **Step 1: Replace title and meta block**

Replace lines 18–20:

```html
  <title>Personal Website</title>
  <meta content="" name="descriptison">
  <meta content="" name="keywords">
```

with:

```html
  <title>Sumbono — Senior Fullstack Engineer</title>
  <meta name="description" content="Portfolio of Sumbono — Senior Fullstack Engineer with 10 years of experience in Python, software & data engineering, cloud infrastructure, and AI systems.">
```

- [ ] **Step 2: Fix favicon MIME type**

Replace `<link rel="icon" type="image/jpg" href="/bono-topi.jpg"/>` with:

```html
  <link rel="icon" type="image/jpeg" href="/bono-topi.jpg"/> <!-- Bot icons created by deemakdaksina - Flaticon -->
```

(Remove the two commented-out favicon lines 12 and 14.)

- [ ] **Step 3: Remove dead Universal Analytics tag**

Delete lines 38–46 (the `UA-169007209-3` gtag script block). Keep the GTM snippet at the top of head and the GTM `<noscript>` in body.

- [ ] **Step 4: Verify**

Run: `grep -c "UA-169007209-3" index.html` → expected `0`
Run: `grep -c "Personal Website" index.html` → expected `0`
Run: `grep -c "GTM-5BB8W2X" index.html` → expected `2` (snippet + noscript)
Run: `grep -c 'type="image/jpg"' index.html` → expected `0`

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "fix: real title/meta, valid favicon type, drop dead UA analytics tag

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2: Static hero headline (retire typed rotator)

**Files:**
- Modify: `index.html` (header line ~70; scripts lines ~624–632)

**Interfaces:**
- Consumes: nothing.
- Produces: static `<h2>` + `<p>` in `#header`; no `Typed` references remain.

- [ ] **Step 1: Replace the typed hero line**

Replace line 70:

```html
      <h2 style="color:#fff">I'm <span class="typing" style="color:#12D640"></span></h2>
```

with:

```html
      <h2>I'm a Senior Fullstack Engineer.</h2>
      <p class="hero-sub">10 years building software &amp; data systems — Python, cloud, and AI.</p>
```

- [ ] **Step 2: Remove typed.js include and init**

Delete the vendor script line:

```html
  <script src="assets/vendor/typed.js/typed.min.js"></script>
```

and the inline init block:

```html
  <script type="text/javascript">
    var typed = new Typed('.typing',{
      strings: ["Coder", "Developer", "Software Engineer", "Pythonist", "Data Expert", "AI Enthusiast"],
      loop: true,
      typeSpeed: 65,
      backSpeed: 65
    });
  </script>
```

- [ ] **Step 3: Style the sub-line (append to style.css)**

Append at the end of `assets/css/style.css`:

```css
/*--------------------------------------------------------------
# Content-pass additions (footer, hero sub, captions)
--------------------------------------------------------------*/
#header .hero-sub {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 10px;
}
```

Also change `#header h2` colour rule to keep it green (remove reliance on the inline `#fff` that was removed): the existing rule at style.css:80–84 already sets `color: #12d640`, which now applies — no edit needed there.

- [ ] **Step 4: Verify**

Run: `grep -c "Typed\|typed.min.js\|class=\"typing\"" index.html` → expected `0`
Run: `grep -c "assets/js/main.js" index.html` → expected `1`
Run: `grep -c "hero-sub" index.html assets/css/style.css` → expected `2` (1 HTML + 1 CSS)

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/style.css
git commit -m "feat: static positioning headline, retire typed rotator

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3: Dead-code cleanup (comment blocks + dead AOS attributes)

**Files:**
- Modify: `index.html` (whole file)

**Interfaces:**
- Produces: `index.html` with zero `data-aos` attributes and no large commented-out content blocks (license comment retained).

- [ ] **Step 1: Remove all dead `data-aos` attributes**

Four distinct values exist. Run each as an exact-string edit with replace-all:

1. ` data-aos="fade-right"` → `` (1 occurrence, line 108)
2. ` data-aos="fade-left"` → `` (1 occurrence, line 111)
3. ` data-aos="fade-up"` → `` (all remaining occurrences, ~11)
4. ` data-aos="lefade-up"` → `` (invalid value, 2 occurrences, lines 544, 565)
   (also drop the accompanying ` data-aos-delay="100"` wherever present — replace ` data-aos-delay="100"` with `` replace-all)

- [ ] **Step 2: Remove the large commented-out blocks**

Delete these exact blocks (keep the BootstrapMade license comment):

1. Commented favicon/Flaticon lines in head (lines 12, 14) — if not already removed in Task 1.
2. Commented `Home` nav item (line 74): `<!-- <li><a href="#header"> <span>Home</span></a></li> -->`
3. Commented `Education` nav item (line 76).
4. Commented `GardaMatika` nav item (line 79).
5. The commented `social-links` div (lines 94–98).
6. The three commented bio drafts (lines 112–129).
7. The commented `Interests` tiles — `Machine Learning`, `Computer Vision`, `Natural Language Processing`, `Algorithms`, `Image Processing` (lines 185–214).
8. The entire commented `Education` section (lines 223–248).
9. Commented `<center><h4>…</h4></center>` titles inside portfolio cards (10 one-liners: Stock Price Predictor, Network Monitoring Systems, Property Info Scraper, Data Enrichment Pipeline, C2MS, Web Scraper, Scoring Model App, Data distribution Unit, Data Link, GardaMatika).
10. Commented inline SVG controller icon (line 367 `<!-- <i class="bi bi-controller"></i> -->`).
11. Commented numpy logo img (line 552), tensorflow (555), pytorch (558), opencv (559), meteor (562), travis-ci (577).
12. Commented `<!-- <br> -->` (line 581).

- [ ] **Step 3: Verify**

Run: `grep -c "data-aos" index.html` → expected `0`
Run: `grep -c "Education" index.html` → expected `0`
Run: `grep -c "half-decade of remote work" index.html` → expected `0`
Run: `grep -c "Stock Price Predictor</h4></center>" index.html` → expected `0`
Run: `grep -c "Template Name: Personal" index.html` → expected `1` (license comment retained)
Run: `grep -c "Flaticon" index.html` → expected `1` (icon attribution retained)

Note: do **not** assert a total comment count — the file legitimately keeps ~27 section-marker/head comments (measured baseline: 64 openers now; markers like `<!-- ======= Header ======= -->` are template conventions and stay). The six greps above are the actual gate.

Run: HTML balance check:

```bash
python3 -c "
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack=[]
    def handle_starttag(self, t, a):
        if t not in ('meta','link','img','br','input','hr'): self.stack.append(t)
    def handle_endtag(self, t):
        if self.stack and self.stack[-1]==t: self.stack.pop()
        elif t in self.stack: print('MISMATCH at', t, self.getpos())
p=P(); p.feed(open('index.html').read()); print('unclosed:', p.stack)
"
```

Expected: `unclosed: []` and no MISMATCH lines.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "chore: remove dead AOS attrs and commented-out content blocks

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4: Trim experience bullets

**Files:**
- Modify: `index.html` (Experience section, ADAPTA and S2T entries)

**Interfaces:**
- Produces: ≤4 bullets per role; all bullets derived from existing bullet text (no new claims).

- [ ] **Step 1: Replace the ADAPTA.EARTH bullet list (12 → 4)**

Replace the existing `<ul>` (lines ~266–279) with:

```html
              <ul style="text-align:left;color:#fff;font-size: medium;">
                <li>Lead end-to-end system development across AI, Data, and Software engineering domains</li>
                <li>Architect scalable cloud infrastructure (Docker/Kubernetes, multi-cloud) and complete software systems from frontend to backend</li>
                <li>Lead technical decisions on architecture, stack selection, and scalability, while mentoring Frontend and Backend Engineers</li>
                <li>Implement DevOps practices (CI/CD, automated testing, infrastructure as code) and security protocols across the entire stack</li>
              </ul>
```

- [ ] **Step 2: Replace the S2T bullet list (10 → 4)**

Replace the existing `<ul>` (lines ~286–297) with:

```html
              <ul style="text-align:left;color:#fff;font-size: medium;">
                <li>Design and build high-performance, secure, scalable data engineering systems across the data lifecycle, including batch and streaming pipelines</li>
                <li>Develop APIs for high-throughput data processing and web crawlers for data acquisition</li>
                <li>Debug and improve ETL pipeline architecture; transform raw data into usable records for end users and stakeholders</li>
                <li>Ensure data security, accuracy, and accessibility across in-house and third-party data sources</li>
              </ul>
```

- [ ] **Step 3: Fix the lowercase month**

Replace `june 2018 - March 2019` with `June 2018 - March 2019`.

- [ ] **Step 4: Verify**

Run: `grep -c "<li>" index.html` → count reduced vs baseline; specifically `grep -A14 "ADAPTA" index.html | grep -c "<li>"` shows 4.
Run: `grep -c "june 2018" index.html` → expected `0`

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "content: trim experience bullet walls to 4 outcome-first bullets

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 5: Visible project titles + one-liners + id fix + game labels

**Files:**
- Modify: `index.html` (Projects section lines ~347–510)
- Modify: `assets/css/style.css` (append caption rule)

**Interfaces:**
- Consumes: Task 3 removed the commented titles.
- Produces: every portfolio card shows an always-visible title + one-line description; exactly one `id="portfolio-flters"`; game links have text labels.

- [ ] **Step 1: Fix the duplicate id and label the game links**

Remove `id="portfolio-flters"` from the second `<ul>` (line ~364) so only the filter bar keeps it, and add visible text to the game links:

```html
      <ul class="portfolio-quicklinks">
        <li>
          <a href="color-game/color.html" target="_blank" title="color-guess-game">
            <svg ...existing svg...></svg> Color Game
          </a>
        </li>
        <li>
          <a href="spaceshooter/index.html" target="_blank" title="space-shooter-game">
            <svg ...existing svg...></svg> Space Shooter
          </a>
        </li>
      </ul>
```

(SVGs unchanged; only add the text label after each.)

- [ ] **Step 2: Add title + one-liner under each card**

After each `.portfolio-wrap` closing `</div>` (inside its `.portfolio-item`), add a caption block. The exact content per card (titles and one-liners taken from the project pages — no new claims):

1. Stock Price Predictor — `FastAPI & Jinja stock price predictor demonstrating ML model serving`
2. Network Monitoring Systems — `Nationwide broadcast station monitoring with real-time web dashboard`
3. Property Info Scraper — `Python + Playwright scraper for login-protected property data`
4. Data Enrichment Pipeline — `Python pipeline enriching raw data from scraping, APIs, and files`
5. Command and Control Management Systems — `Indonesian Navy Fleet Management System — 3-year integration project`
6. Web Scraper — `Company profile scrapers across 10 countries' government sources`
7. Scoring Model App — `API serving ML models with prediction-result caching`
8. Data Distribution Unit — `Low-power embedded console for analog, serial, and Ethernet data`
9. Data Link — `HF radio data link migrated from x86 to ARM embedded Linux`
10. GardaMatika (existing card) — **move** its existing `<h4>GardaMatika</h4><p>AI-Powered Mathematics Learning Platform…</p>` OUT of the hover overlay into the caption block (do not duplicate — the overlay keeps only the two links):

```html
          <div class="portfolio-caption">
            <h4>GardaMatika</h4>
            <p>AI-Powered Mathematics Learning Platform for Indonesian students</p>
          </div>
```

Pattern per card:

```html
          <div class="portfolio-caption">
            <h4>Stock Price Predictor</h4>
            <p>FastAPI &amp; Jinja stock price predictor demonstrating ML model serving</p>
          </div>
```

- [ ] **Step 3: Caption CSS (append to style.css)**

```css
.portfolio-caption h4 {
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  margin: 12px 0 4px;
}
.portfolio-caption p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
}

/* Re-create the pill presentation the game links previously inherited
   from the duplicate #portfolio-flters id (style.css:740-768). */
.portfolio .portfolio-quicklinks {
  padding: 2px 15px;
  margin: 0 auto 15px auto;
  list-style: none;
  text-align: center;
}
.portfolio .portfolio-quicklinks li {
  cursor: pointer;
  display: inline-block;
  padding: 8px 16px 10px 16px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 3px 10px 3px;
  border-radius: 4px;
}
.portfolio .portfolio-quicklinks li a {
  color: #12d640;
}
```

The hover overlay rules at style.css:793–888 remain untouched, so the details link still appears on hover.

- [ ] **Step 4: Verify**

Run: `grep -c 'id="portfolio-flters"' index.html` → expected `1`
Run: `grep -c "portfolio-caption" index.html` → expected `10`
Run: `grep -c "Color Game\|Space Shooter" index.html` → expected `2`
Run: `grep -c "portfolio-wrap:hover .portfolio-info" assets/css/style.css` → expected `1`

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/style.css
git commit -m "feat: always-visible project titles and one-liners, label game links, fix duplicate id

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 6: Footer + contact CTA, resume copy, drop phone

**Files:**
- Modify: `index.html` (Links section ~599–612; About section ~140; end of body ~612)
- Modify: `assets/css/style.css` (append footer styles)

**Interfaces:**
- Produces: `<footer id="footer">` after the Links section; no phone number; fixed resume copy.

- [ ] **Step 1: Remove the phone number**

Delete the col-lg-6 block containing `Phone: +62 812-9921-4097` (lines ~137–142), leaving the Email entry (adjust the remaining column to `col-lg-6` inside the existing row).

- [ ] **Step 2: Fix resume copy**

Replace `The link contains downloadable resume` with `Download my resume (PDF, Google Drive)`.

- [ ] **Step 3: Add footer before the vendor scripts**

Insert immediately before `<!-- Vendor JS Files -->`:

```html
  <!-- ======= Footer ======= -->
  <footer id="footer">
    <div class="container">
      <div class="footer-cta">
        <h2>Let's work together</h2>
        <a class="footer-email" href="mailto:sumbono102@gmail.com">sumbono102@gmail.com</a>
      </div>
      <div class="footer-links">
        <a href="https://www.linkedin.com/in/sumbono/" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://github.com/sumbono" target="_blank" rel="noopener">GitHub</a>
        <a href="https://drive.google.com/file/d/1uGvztHBjUy6axIR5Qx6qpvmQA2SEftWF/view?usp=sharing" target="_blank" rel="noopener">Resume</a>
      </div>
      <div class="footer-copy">© 2026 Sumbono. Built and maintained by me.</div>
    </div>
  </footer>
  <!-- End Footer -->
```

- [ ] **Step 4: Footer CSS (append to style.css)**

```css
#footer {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding: 60px 0 40px;
  background: #010e1b;
}
#footer .footer-cta h2 {
  font-size: 32px;
  color: #fff;
  margin-bottom: 12px;
}
#footer .footer-email {
  font-size: 20px;
  color: #12d640;
}
#footer .footer-links {
  margin-top: 28px;
  display: flex;
  gap: 24px;
}
#footer .footer-links a {
  color: #fff;
  font-size: 16px;
}
#footer .footer-links a:hover {
  color: #12d640;
}
#footer .footer-copy {
  margin-top: 32px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}
```

- [ ] **Step 5: Verify**

Run: `grep -c "812-9921-4097" index.html` → expected `0`
Run: `grep -c 'id="footer"' index.html` → expected `1`
Run: `grep -c "The link contains downloadable resume" index.html` → expected `0`
Run: HTML balance check (same command as Task 3 Step 3) → `unclosed: []`

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/style.css
git commit -m "feat: footer with contact CTA, drop phone number, fix resume copy

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 7: Inline-style consolidation + alt text

**Files:**
- Modify: `index.html` (Experience, Skills, Interests inline styles; img alts)
- Modify: `assets/css/style.css` (append utility rules)

**Interfaces:**
- Produces: repeated inline styles replaced by CSS rules; profile + logo alts fixed.

- [ ] **Step 1: Add utility rules (append to style.css)**

```css
/* .services .icon-box is text-align:center (style.css:657) and
   .services .icon-box p is font-size:14px (style.css:706) — these rules
   restore what the removed inline styles were compensating for. */
.section-body h4,
.section-body h5,
.section-body p,
.section-body ul {
  text-align: left;
}
.section-body p,
.section-body li,
.section-body ul {
  color: #fff;
}
.section-body p,
.section-body li {
  font-size: medium;
}
.section-body h4 a {
  color: #12d640;
}
.skills-card {
  background: #fff;
  text-align: left;
}
.skills-card h4 {
  color: #09203a;
}
.interest-icon-amber { color: #ffbb2c; }
.interest-icon-green { color: #28a745; }
.interest-icon-red { color: #f1081f; }
```

- [ ] **Step 2: Apply classes in index.html**

1. Experience: the `icon-box` wrappers for each role get `class="section-body"` additions where `style="text-align:left;color:#fff..."` appears; delete those inline `style` attributes from the h4/h5/p/ul inside them (the h4/h5 already have `style="text-align:left;"` — remove those too).
2. Skills: the three `icon-box` divs with `style="background:#fff"` → add `skills-card` class, remove the inline style; their `<h4 style="text-align:left;color:#09203a">` → plain `<h4>`; the `<p style="text-align:left;">` → plain `<p>`.
3. Interests: four icons with `style="color:#ffbb2c|#28a745|#f1081f"` → add classes `interest-icon-amber` (×2), `interest-icon-green`, `interest-icon-red`; remove inline styles.
4. Experience company links: remove `style="color:#12d640"` from the five `<h4><a>` company links (covered by `.section-body h4 a` rule above).
5. Links section: remove `style="color:#fff;"` from `<p class="description">` (redundant — body colour is already `#fff`).
6. About: `<h2 style="color:#fff">` is already replaced (Task 2). The `<p>` bio and `strong` list stay as-is (template defaults are fine there once Phone row is gone).

- [ ] **Step 3: Fix alt text**

1. Profile: `<img src="assets/img/profile.jpeg" ... alt="" ...>` → `alt="Portrait of Sumbono"`.
2. Logos: replace-all `alt="vectorlogo.zone"` → `alt=""` (decorative — grouped under labelled headings); replace-all `alt="upload.wikimedia.org"` → `alt=""`; `alt="fastapi.logo"` → `alt="FastAPI"`; `alt="pandas.pydata.org"` → `alt="pandas"`; `alt="playwright.dev"` → `alt="Playwright"`; `alt="celery"` stays; `alt="upload.wikimedia"` → `alt=""`.

- [ ] **Step 4: Verify**

Run: `grep -c 'style="text-align:left' index.html` → expected `0`
Run: `grep -c 'style="color:#12d640"' index.html` → expected `0`
Run: `grep -c 'alt="vectorlogo.zone"' index.html` → expected `0`
Run: `grep -c "interest-icon-" index.html` → expected `4`
Run: HTML balance check → `unclosed: []`

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/style.css
git commit -m "refactor: move repeated inline styles to CSS, fix image alt text

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 8: Final verification + report

**Files:**
- Modify: none (verification only); optional: `/home/bono/portfolio/audit-report.md` addendum is NOT part of this repo.

**Interfaces:**
- Consumes: Tasks 1–7.
- Produces: passing verification, one summary commit if fixes needed.

- [ ] **Step 1: Full sweep**

Run each and expect the listed result:

```bash
grep -c "UA-169007209-3\|Typed\|data-aos\|descriptison\|812-9921" index.html   # 0
grep -c 'id="portfolio-flters"' index.html                                     # 1
grep -c "portfolio-caption" index.html                                         # 10
grep -c 'id="footer"' index.html                                               # 1
grep -c 'style="' index.html                                                   # 1 (only GTM noscript iframe; every other inline style removed)
grep -c "Template Name: Personal" index.html                                   # 1 (license retained)
python3 -c "from html.parser import HTMLParser; ..."                           # unclosed: []
git status --short                                                             # clean after commit
```

The `style="..."` count of 1 is the global inline-style gate: after Task 7 the only remaining inline style in the file must be Google Tag Manager's required `<iframe style="display:none;visibility:hidden">`.

- [ ] **Step 2: Serve smoke test**

```bash
python3 -m http.server 8901 >/dev/null 2>&1 & SERVER_PID=$!; sleep 1; curl -s http://localhost:8901/index.html | grep -c "Sumbono — Senior Fullstack Engineer"; kill $SERVER_PID   # 1
```

- [ ] **Step 3: Fix anything that failed, re-run, commit if changed**

```bash
git add -A
git commit -m "fix: verification sweep fixes

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

- [ ] **Step 4: Report**

Summarize changed files, verification output, and branch name for the user; offer push + draft PR.
