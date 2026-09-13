/* ==========================================================================
   PUNITA COLLECTION (पुनिता कलेक्शन) - JAVASCRIPT ENGINE
   Satara's Landmark Ethnic & Bridal Wear Destination
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initVideoPlayer();
  initGalleryFilter();
  initLightbox();
  initWhatsAppButtons();
  initAppointmentForm();
  initFaqAccordion();
  initBlogModal();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER & SCROLL EFFECTS
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   3. FLAGSHIP VIDEO PLAYER (PUNITA SHOWCASE)
   -------------------------------------------------------------------------- */
function initVideoPlayer() {
  const wrapper = document.querySelector('.video-player-wrapper');
  if (!wrapper) return;

  const video = wrapper.querySelector('video');
  const playBtn = wrapper.querySelector('.video-center-btn');

  if (!video || !playBtn) return;

  function togglePlay() {
    if (video.paused || video.ended) {
      video.play();
      wrapper.classList.add('playing');
      playBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1"/>
          <rect x="14" y="4" width="4" height="16" rx="1"/>
        </svg>
      `;
    } else {
      video.pause();
      wrapper.classList.remove('playing');
      playBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
    }
  }

  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });

  video.addEventListener('click', togglePlay);

  video.addEventListener('ended', () => {
    wrapper.classList.remove('playing');
    playBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    `;
  });
}

/* --------------------------------------------------------------------------
   4. GALLERY CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || (filterValue === 'showroom' && category === 'showroom')) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. LIGHTBOX MODAL WITH ZOOM & WHATSAPP
   -------------------------------------------------------------------------- */
let currentLightboxIndex = 0;
let lightboxItemsList = [];

function initLightbox() {
  const items = document.querySelectorAll('.lightbox-trigger, .gallery-item');
  const modal = document.querySelector('.lightbox-modal');
  if (!modal || !items.length) return;

  const modalImg = modal.querySelector('.lightbox-image-wrap img');
  const modalTitle = modal.querySelector('.lightbox-title');
  const modalEnquire = modal.querySelector('.lightbox-enquire-btn');
  const closeBtn = modal.querySelector('.lightbox-close');
  const prevBtn = modal.querySelector('.lightbox-prev');
  const nextBtn = modal.querySelector('.lightbox-next');

  lightboxItemsList = Array.from(items);

  function openLightbox(index) {
    currentLightboxIndex = index;
    const item = lightboxItemsList[index];
    const imgSrc = item.getAttribute('data-full-img') || item.querySelector('img')?.src;
    const title = item.getAttribute('data-title') || item.querySelector('h4')?.textContent || 'Punita Collection Outfit';

    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title;

    if (modalEnquire) {
      modalEnquire.onclick = () => {
        sendWhatsAppEnquiry(title);
      };
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxItemsList.length;
    openLightbox(currentLightboxIndex);
  }

  function showPrev() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxItemsList.length) % lightboxItemsList.length;
    openLightbox(currentLightboxIndex);
  }

  lightboxItemsList.forEach((item, idx) => {
    item.addEventListener('click', (e) => {
      // Avoid triggering if clicked directly on WhatsApp button
      if (e.target.closest('.btn-whatsapp')) return;
      openLightbox(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* --------------------------------------------------------------------------
   6. WHATSAPP ENQUIRY BUTTONS
   -------------------------------------------------------------------------- */
const PUNITA_PHONE = '919404404408';

function sendWhatsAppEnquiry(productName) {
  const text = `Namaste Punita Collection Satara! I am interested in viewing / trying this design from your website: "${productName}". Please share available sizes and prices.`;
  const url = `https://wa.me/${PUNITA_PHONE}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function initWhatsAppButtons() {
  const buttons = document.querySelectorAll('[data-whatsapp-enquire]');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const product = btn.getAttribute('data-whatsapp-enquire') || 'Punita Collection Design';
      sendWhatsAppEnquiry(product);
    });
  });
}

/* --------------------------------------------------------------------------
   7. APPOINTMENT BOOKING FORM
   -------------------------------------------------------------------------- */
function initAppointmentForm() {
  const form = document.querySelector('#bridalBookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const service = form.querySelector('[name="service"]')?.value;
    const date = form.querySelector('[name="date"]')?.value;
    const notes = form.querySelector('[name="notes"]')?.value.trim() || 'No specific notes';

    if (!name || !phone) {
      showToast('Please fill in your name and phone number.');
      return;
    }

    const message = `Namaste Punita Collection Satara! I would like to book a Showroom Appointment / Bridal Trial.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Category:* ${service}\n*Preferred Date:* ${date}\n*Requirements:* ${notes}`;
    const url = `https://wa.me/${PUNITA_PHONE}?text=${encodeURIComponent(message)}`;

    showToast('Redirecting to WhatsApp with your appointment request...');
    setTimeout(() => {
      window.open(url, '_blank');
      form.reset();
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   8. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. BLOG READING MODAL
   -------------------------------------------------------------------------- */
const blogArticles = {
  bridal2026: {
    title: "Bridal Trends 2026: Jewel Tones and Pastel Lehengas for Satara Brides",
    category: "Bridal Fashion",
    author: "Punita Styling Studio",
    content: `
      <p>Every wedding season brings an evolution in bridal aesthetics. At Punita Collection in Satara, we are witnessing a remarkable resurgence of royal heritage hues harmonized with soft, dreamy pastels.</p>
      <br>
      <h4>1. The Regal Velvet & Zari Revival</h4>
      <p>For night wedding ceremonies and grand receptions, deep jewel tones—such as wine burgundy, emerald green, and royal sapphire—with intricate zardozi, pita work, and antique gold sequins remain unmatched in grandeur.</p>
      <br>
      <h4>2. Morning Mandap Pastels: Rose Quartz & Mint</h4>
      <p>For daytime rituals and summer weddings, Maharashtrian brides are increasingly choosing lightweight organza and raw silk lehengas adorned with tone-on-tone resham embroidery and delicate scalloped borders.</p>
      <br>
      <h4>3. The Double Dupatta Styling</h4>
      <p>One of the top bridal requests at our Bhavani Peth showroom is the dual dupatta drape: a heavy embellished dupatta pleated across the shoulder and a sheer featherlight veil over the bridal bun.</p>
      <br>
      <p><em>Visit our dedicated 2nd-floor bridal lounge at Khan Ali, Rajpath Satara to explore and custom-tailor your dream bridal attire.</em></p>
    `
  },
  sareeCare: {
    title: "The Art of Saree Draping & Preserving Heirloom Silks",
    category: "Silk Care",
    author: "Punita Master Draper",
    content: `
      <p>Pure silk, Paithani, and Banarasi sarees are not just garments; they are heirloom treasures passed down through generations. Preserving their lustrous zari requires mindful care.</p>
      <br>
      <h4>1. Proper Storage in Muslin Cloth</h4>
      <p>Never wrap fine silk sarees in plastic bags, which trap moisture and can cause zari to tarnish. Always fold them inside breathable white pure cotton or muslin fabric.</p>
      <br>
      <h4>2. Airing & Refolding Periodically</h4>
      <p>Every six months, take your silk sarees out of the wardrobe, air them in a shaded room (never under direct harsh sunlight), and refold along different creases to avoid fabric tearing.</p>
      <br>
      <h4>3. Dry Clean Only</h4>
      <p>Always opt for professional dry cleaning for handloom silks, zardozi kurtis, and heavy dupattas to maintain fabric integrity and embroidery sheen.</p>
    `
  },
  indowestern: {
    title: "Indo-Western Silhouettes: Flared Sleeves & Cape Blouses",
    category: "Contemporary Couture",
    author: "Punita Design Studio",
    content: `
      <p>Modern festivities demand ensembles that are as comfortable to dance in as they are breathtaking in photos. Enter the contemporary Indo-Western collection at Punita Collection.</p>
      <br>
      <h4>1. Drama on the Sleeves</h4>
      <p>Exaggerated bell sleeves, slit kimono cuts, and organza cape overlays add instant high-fashion flair to crop cholis paired with voluminous pleated ethnic skirts.</p>
      <br>
      <h4>2. Pre-Stitched Drapes for Sangeet Nights</h4>
      <p>Draped saree gowns and palazzo dhoti sets are top favorites among bridesmaid squads who desire a fusion of ethnic charm and effortless movement.</p>
    `
  }
};

function initBlogModal() {
  const modal = document.querySelector('.blog-modal');
  const triggers = document.querySelectorAll('[data-blog-id]');
  if (!modal || !triggers.length) return;

  const closeBtn = modal.querySelector('.blog-modal-close');
  const titleEl = modal.querySelector('.blog-modal-title');
  const categoryEl = modal.querySelector('.blog-modal-category');
  const bodyEl = modal.querySelector('.blog-modal-body');

  triggers.forEach(trig => {
    trig.addEventListener('click', (e) => {
      e.preventDefault();
      const blogId = trig.getAttribute('data-blog-id');
      const data = blogArticles[blogId];
      if (!data) return;

      if (titleEl) titleEl.textContent = data.title;
      if (categoryEl) categoryEl.textContent = data.category;
      if (bodyEl) bodyEl.innerHTML = data.content;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* --------------------------------------------------------------------------
   10. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast-alert');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-alert';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-light)" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* --------------------------------------------------------------------------
   11. SILKY SCROLL REVEAL (COUTURE EDITORIAL REVEAL)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.section-header, .category-card, .product-card, .showroom-media, .showroom-details, .perk-box, .video-theater-container, .testimonial-card, .heritage-visual, .heritage-content, .insta-item, .cta-banner'
  );

  if (!targets.length) return;

  // Stagger delays within sibling collections
  document.querySelectorAll('.category-grid, .products-grid, .showroom-perks, .testimonials-grid, .insta-grid').forEach(container => {
    Array.from(container.children).forEach((child, idx) => {
      child.classList.add(`reveal-delay-${(idx % 4) + 1}`);
    });
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  targets.forEach(el => {
    el.classList.add('reveal-item');
    observer.observe(el);
  });
}

