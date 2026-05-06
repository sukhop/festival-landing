document.addEventListener('DOMContentLoaded', () => {
    // ─── Elements ───────────────────────────────────────────────────────────
    const header         = document.querySelector('header');
    const desktopLinks   = document.querySelector('.desktop-menu-inline');
    const menuToggle     = document.querySelector('.menu-toggle');
    const hamburger      = document.querySelector('.hamburger');
    const mobilePanel    = document.querySelector('.mobile-menu-panel');
    const mobileClose    = document.querySelector('.mobile-menu-close');

    const SCROLL_THRESHOLD = 60;
    const DESKTOP_BP       = 992;

    // ─── Helpers ────────────────────────────────────────────────────────────
    const isDesktop = () => window.innerWidth >= DESKTOP_BP;

    // ─── Desktop: scroll state ───────────────────────────────────────────────
    let ticking = false;

    const applyScrollState = () => {
        if (!header) return;
        const scrolled = window.scrollY > SCROLL_THRESHOLD;
        header.classList.toggle('scrolled', scrolled);

        // When un-scrolling back to top, close menu-open too
        if (!scrolled) {
            header.classList.remove('menu-open');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        }
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { applyScrollState(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });

    applyScrollState(); // run once on load

    // ─── Desktop: Menu toggle (scrolled → open/close inline links) ───────────
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!header.classList.contains('scrolled')) return;

            const opening = !header.classList.contains('menu-open');
            header.classList.toggle('menu-open', opening);
            menuToggle.setAttribute('aria-expanded', String(opening));
        });
    }

    // Close desktop menu when clicking outside header
    document.addEventListener('click', (e) => {
        if (header && !header.contains(e.target)) {
            header.classList.remove('menu-open');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // ─── Mobile: hamburger open ──────────────────────────────────────────────
    if (hamburger && mobilePanel) {
        hamburger.addEventListener('click', () => {
            const opening = !mobilePanel.classList.contains('active');
            mobilePanel.classList.toggle('active', opening);
            hamburger.setAttribute('aria-expanded', String(opening));
            document.body.style.overflow = opening ? 'hidden' : '';
        });
    }

    // Mobile: close button
    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobile);
    }

    function closeMobile() {
        if (mobilePanel) mobilePanel.classList.remove('active');
        if (hamburger)   hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Close mobile when clicking outside panel
    document.addEventListener('click', (e) => {
        if (
            mobilePanel &&
            mobilePanel.classList.contains('active') &&
            !mobilePanel.contains(e.target) &&
            hamburger && !hamburger.contains(e.target)
        ) {
            closeMobile();
        }
    });

    // On resize: clean up states
    window.addEventListener('resize', () => {
        if (isDesktop()) {
            closeMobile();
        } else {
            header.classList.remove('menu-open');
        }
    });

    // ─── Close mobile menu on nav link click ────────────────────────────────
    if (mobilePanel) {
        mobilePanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobile);
        });
    }


    // ════════════════════════════════════════════════════════════════════════
    // FILTER LOGIC
    // ════════════════════════════════════════════════════════════════════════
    const filterBtns    = document.querySelectorAll('.filter-btn');
    const filterContent = document.querySelector('.filter-content');
    const filterLine    = document.querySelector('.filter-line');
    const filterWrap    = document.querySelector('.filter-wrap');

    const updateLinePosition = (btn) => {
        if (filterLine && filterWrap) {
            const btnRect  = btn.getBoundingClientRect();
            const wrapRect = filterWrap.getBoundingClientRect();
            const center   = btnRect.left - wrapRect.left + btnRect.width / 2;
            filterLine.style.left = `${center}px`;
        }
    };

    const closeAllDropdowns = () => {
        if (filterContent) filterContent.classList.add('d-none');
        if (filterLine)    filterLine.classList.add('d-none');
        document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.add('d-none'));
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.getAttribute('data-filter');

            if (btn.classList.contains('filled')) {
                btn.classList.remove('filled');
                closeAllDropdowns();
                return;
            }

            filterBtns.forEach(b => b.classList.remove('filled'));
            closeAllDropdowns();

            const activeDropdown = document.getElementById(`dropdown-${filterType}`);
            if (activeDropdown) {
                btn.classList.add('filled');
                if (filterContent) filterContent.classList.remove('d-none');
                activeDropdown.classList.remove('d-none');
                if (filterLine) filterLine.classList.remove('d-none');
                requestAnimationFrame(() => updateLinePosition(btn));
            }
        });
    });

    document.querySelectorAll('.option-item').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            option.classList.toggle('selected');

            const parentDropdown = option.closest('.filter-options');
            if (!parentDropdown) return;

            const targetFilter = parentDropdown.getAttribute('data-target');
            const targetBtn    = document.querySelector(`[data-filter="${targetFilter}"]`);
            if (!targetBtn) return;

            const valSpan  = targetBtn.parentElement.querySelector('.selected-value');
            const selected = [...parentDropdown.querySelectorAll('.option-item.selected')]
                .map(el => el.textContent.trim());

            if (valSpan) valSpan.textContent = selected.length ? selected.join(', ') : '';
            targetBtn.classList.toggle('active', selected.length > 0);
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-wrap')) {
            filterBtns.forEach(b => b.classList.remove('filled'));
            closeAllDropdowns();
        }
    });


    // ════════════════════════════════════════════════════════════════════════
    // ACCORDION LOGIC
    // ════════════════════════════════════════════════════════════════════════
    document.querySelectorAll('.event-list .list-wrap').forEach(item => {
        item.addEventListener('click', () => {
            const body   = item.nextElementSibling;
            if (!body || !body.classList.contains('event-accordion-body')) return;
            const isOpen = !body.classList.contains('d-none');

            document.querySelectorAll('.event-accordion-body').forEach(b => b.classList.add('d-none'));
            document.querySelectorAll('.list-wrap').forEach(l => l.classList.remove('active'));

            if (!isOpen) {
                body.classList.remove('d-none');
                item.classList.add('active');
            }
        });
    });


    // ════════════════════════════════════════════════════════════════════════
    // TABS LOGIC
    // ════════════════════════════════════════════════════════════════════════
    const tabBtns     = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('text-lilac', 'active');
                b.style.color = '#504B4B';
            });
            tabContents.forEach(c => c.classList.add('d-none'));

            btn.classList.add('text-lilac', 'active');
            btn.style.color = '';

            const target = document.getElementById(`tab-${btn.getAttribute('data-tab')}`);
            if (target) target.classList.remove('d-none');
        });
    });
});


