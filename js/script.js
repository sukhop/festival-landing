document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
    const menuToggle = document.querySelector('.menu-toggle');
    const desktopMenuPanel = document.querySelector('.desktop-menu-panel');

    if (hamburger && mobileMenuPanel) {
        hamburger.addEventListener('click', () => {
            mobileMenuPanel.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', mobileMenuPanel.classList.contains('active'));
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenuPanel.contains(e.target) && !hamburger.contains(e.target) && mobileMenuPanel.classList.contains('active')) {
                mobileMenuPanel.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (menuToggle && desktopMenuPanel) {
        menuToggle.addEventListener('click', () => {
            const isActive = desktopMenuPanel.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });

        document.addEventListener('click', (e) => {
            if (!desktopMenuPanel.contains(e.target) && !menuToggle.contains(e.target) && desktopMenuPanel.classList.contains('active')) {
                desktopMenuPanel.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Header scroll background ---
    const header = document.querySelector('header');
    const SCROLL_THRESHOLD = 80;

    const handleScroll = () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run on load in case page is already scrolled


    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterContent = document.querySelector('.filter-content');
    const filterLine = document.querySelector('.filter-line');
    const filterWrap = document.querySelector('.filter-wrap');

    const updateLinePosition = (btn) => {
        if (filterLine && filterWrap) {
            const btnRect = btn.getBoundingClientRect();
            const wrapRect = filterWrap.getBoundingClientRect();
            const centerLeft = btnRect.left - wrapRect.left + (btnRect.width / 2);
            filterLine.style.left = `${centerLeft}px`;
        }
    };

    const closeAllDropdowns = () => {
        if (filterContent) filterContent.classList.add('d-none');
        document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.add('d-none'));
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.getAttribute('data-filter');

            // If already open → close
            if (btn.classList.contains('filled')) {
                btn.classList.remove('filled');
                closeAllDropdowns();
                return;
            }

            // Close all others, open this one
            filterBtns.forEach(b => b.classList.remove('filled'));
            closeAllDropdowns();

            const activeDropdown = document.getElementById(`dropdown-${filterType}`);
            if (activeDropdown) {
                btn.classList.add('filled');
                if (filterContent) {
                    filterContent.classList.remove('d-none');
                    updateLinePosition(btn);
                }
                activeDropdown.classList.remove('d-none');
            }
        });
    });

    // Multi-select option items — keep dropdown open, toggle selection
    document.querySelectorAll('.option-item').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation(); // keep dropdown open

            option.classList.toggle('selected');

            const parentDropdown = option.closest('.filter-options');
            if (!parentDropdown) return;

            const targetFilter = parentDropdown.getAttribute('data-target');
            const targetBtn = document.querySelector(`[data-filter="${targetFilter}"]`);
            if (!targetBtn) return;

            const valSpan = targetBtn.parentElement.querySelector('.selected-value');
            const selected = [...parentDropdown.querySelectorAll('.option-item.selected')]
                .map(el => el.textContent.trim());

            if (selected.length > 0) {
                if (valSpan) valSpan.textContent = selected.join(', ');
                targetBtn.classList.add('active');
            } else {
                if (valSpan) valSpan.textContent = '';
                targetBtn.classList.remove('active');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-wrap')) {
            filterBtns.forEach(b => b.classList.remove('filled'));
            closeAllDropdowns();
        }
    });

    // --- Modal Logic ---
    const eventItems = document.querySelectorAll('.event-list .list-wrap');
    const eventModal = document.getElementById('eventModal');
    const closeBtnDesktop = document.getElementById('closeModalDesktop');
    const closeBtnMobile = document.getElementById('closeModalMobile');

    eventItems.forEach(item => {
        item.addEventListener('click', () => {
            if (eventModal) {
                eventModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeModal = () => {
        if (eventModal) {
            eventModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (closeBtnDesktop) closeBtnDesktop.addEventListener('click', closeModal);
    if (closeBtnMobile) closeBtnMobile.addEventListener('click', closeModal);

    if (eventModal) {
        eventModal.addEventListener('click', (e) => {
            if (e.target === eventModal || e.target.classList.contains('modal-bg') || e.target === eventModal.querySelector('.container')) {
                closeModal();
            }
        });
    }

    // --- Tabs Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
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

            const targetId = `tab-${btn.getAttribute('data-tab')}`;
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove('d-none');
            }
        });
    });
});
