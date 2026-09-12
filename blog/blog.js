/* Victorious Visuals blog article recommendations */
(function () {
  "use strict";

  const list = document.querySelector("[data-random-articles]");
  const current = document.body.dataset.currentPost;

  if (!list || !current) return;

  const articles = [{"slug":"5-branding-mistakes-small-businesses-make","title":"5 Branding Mistakes Small Businesses Make (and How to Avoid Them)","category":"Digital Marketing","date":"Sep 3, 2026","read":"6 min read","image":"../Blog-images/thumbnails/branding-mistakes.webp","alt":"5 Branding Mistakes Small Businesses Make (and How to Avoid Them)","description":"Five common branding mistakes that can make a small business look inconsistent, unclear or too similar to its competitors—and what to do instead."},{"slug":"ai-assisted-design-is-becoming-standard","title":"AI-Assisted Design Is Becoming Standard. What Still Makes a Designer Valuable?","category":"Graphic Design","date":"Sep 11, 2026","read":"7 min read","image":"../Blog-images/thumbnails/ai-vs-human-design.webp","alt":"AI-Assisted Design Is Becoming Standard. What Still Makes a Designer Valuable?","description":"AI is changing how designs are created. The more interesting question is what becomes more valuable when production gets faster."},{"slug":"brand-identity-colour-typography-system","title":"A Practical Brand Identity System: Colour, Typography and Consistency","category":"Branding","date":"Sep 7, 2026","read":"8 min read","image":"../Blog-images/thumbnails/coffee_scene.webp","alt":"A Practical Brand Identity System: Colour, Typography and Consistency","description":"Turn visual choices into a usable system rather than a collection of attractive pieces."},{"slug":"design-fundamentals-that-make-layouts-work","title":"Design Fundamentals That Make Layouts Work","category":"Design Fundamentals","date":"Sep 10, 2026","read":"8 min read","image":"../Blog-images/thumbnails/layouts_1.webp","alt":"Design Fundamentals That Make Layouts Work","description":"A practical guide to hierarchy, alignment, spacing, contrast and visual structure."},{"slug":"designer-to-creative-strategist","title":"The Designer’s Career Is Changing: From Execution to Creative Strategy","category":"Creative Careers","date":"Aug 28, 2026","read":"7 min read","image":"../Blog-images/thumbnails/creative_strategy-1.webp","alt":"The Designer’s Career Is Changing: From Execution to Creative Strategy","description":"As production becomes faster, designers can create more value by understanding the problem behind the brief and the outcome behind the design."},{"slug":"from-attention-to-retention-digital-growth","title":"From Attention to Retention: How Digital Business Growth Actually Works","category":"Digital Business","date":"Sep 1, 2026","read":"7 min read","image":"../Blog-images/thumbnails/digital-marketing.webp","alt":"From Attention to Retention: How Digital Business Growth Actually Works","description":"Digital growth is not one metric. It is a chain from attention and interest to leads, conversion, retention and referral."},{"slug":"from-reel-to-purchase-social-commerce","title":"From Reel to Purchase: How Social Content Becomes Part of the Buying Journey","category":"Social Commerce","date":"Sep 5, 2026","read":"6 min read","image":"../Blog-images/thumbnails/buying-journey.webp","alt":"From Reel to Purchase: How Social Content Becomes Part of the Buying Journey","description":"A social post can be more than an impression. It can become the first step in a customer’s path toward trust, questions and purchase."},{"slug":"how-to-build-a-design-portfolio-that-proves-your-thinking","title":"How to Build a Brand Portfolio That Proves Your Thinking","category":"Design Careers","date":"Aug 30, 2026","read":"8 min read","image":"../Blog-images/thumbnails/band-by-vv.webp","alt":"How to Build a Brand Portfolio That Proves Your Thinking","description":"A portfolio should show not only what you made, but how you approached the problem and why the result works."},{"slug":"logo-design-from-strategy-to-final-files","title":"Logo Design from Strategy to Final Files","category":"Logo Design","date":"Sep 6, 2026","read":"8 min read","image":"../Blog-images/thumbnails/logo-designing.webp","alt":"Logo Design from Strategy to Final Files","description":"How a logo moves from business context and concepts to testing and usable final files."},{"slug":"personal-branding-as-business-asset","title":"Why Personal Branding Is Becoming a Business Asset","category":"Personal Branding","date":"Aug 25, 2026","read":"6 min read","image":"../Blog-images/thumbnails/Personal_Branding.webp","alt":"Why Personal Branding Is Becoming a Business Asset","description":"A personal brand becomes useful when it makes expertise easier to recognize, trust and remember."},{"slug":"print-ready-design-from-layout-to-press","title":"Print-Ready Design: From Layout to Press","category":"Print Design","date":"Sep 4, 2026","read":"9 min read","image":"../Blog-images/thumbnails/digital-priniting.webp","alt":"Print-Ready Design: From Layout to Press","description":"A practical reference for dimensions, bleed, colour, resolution and printer handoff."},{"slug":"social-media-graphics-designed-for-attention-and-action","title":"Social Media Graphics: Designing for Attention and Action","category":"Social Media Design","date":"Sep 2, 2026","read":"8 min read","image":"../Blog-images/Social Media Graphics-1.webp","alt":"Social Media Graphics: Designing for Attention and Action","description":"Design social graphics that remain readable on phones and lead the viewer toward one clear action."},{"slug":"social-media-is-becoming-a-search-engine","title":"People Are Searching on Social Media. What Does That Change for Businesses?","category":"Social Media & Discovery","date":"Sep 8, 2026","read":"6 min read","image":"../Blog-images/Social Media Graphics-2.webp","alt":"People Are Searching on Social Media. What Does That Change for Businesses?","description":"People increasingly use social platforms to discover answers, places, products and services. That changes what useful content needs to look like."},{"slug":"why-perfect-ai-design-look-is-less-interesting","title":"Why the “Perfect AI Design” Look Is Becoming Less Interesting","category":"Graphic Design","date":"Sep 10, 2026","read":"6 min read","image":"../Blog-images/thumbnails/perfect-ai-look-designs.webp","alt":"Why the “Perfect AI Design” Look Is Becoming Less Interesting","description":"When polished visual output becomes easy to generate, taste, originality and context become harder to ignore."},{"slug":"why-ranking-number-one-is-wrong-first-question","title":"Why “How Do I Rank #1 on Google?” Is the Wrong First Question","category":"Digital Marketing","date":"Sep 3, 2026","read":"6 min read","image":"../Blog-images/thumbnails/Rank-one-0n-google.webp","alt":"Why “How Do I Rank #1 on Google?” Is the Wrong First Question","description":"Search visibility matters, but a ranking is only useful when it helps the right people find the right answer and take the next useful step."}];
  const pool = articles.filter(article => article.slug !== current);
  const count = Math.min(4, pool.length);

  // Fisher-Yates shuffle. A fresh shuffle is performed on every page load.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const selected = pool.slice(0, count);

  list.replaceChildren(...selected.map(article => {
    const card = document.createElement("article");
    card.className = "vv-side-card";
    card.innerHTML = `
      <a href="${article.slug}.html" class="vv-side-main">
        <img src="${article.image}" alt="${escapeHtml(article.alt)}" loading="lazy" decoding="async">
        <div class="vv-side-copy">
          <span class="vv-pill">${escapeHtml(article.category)}</span>
          <div class="vv-meta"><span>${escapeHtml(article.date)}</span><i></i><span>${escapeHtml(article.read)}</span></div>
          <h3>${escapeHtml(article.title)}</h3>
        </div>
        <span class="vv-side-arrow" aria-hidden="true">→</span>
      </a>`;
    return card;
  }));

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value || "";
    return div.innerHTML;
  }
})();
