// ── Hamburger menu ────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navbar     = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navbar.classList.toggle('open');
    document.body.style.overflow = navbar.classList.contains('open') ? 'hidden' : '';
});

// Close nav when a link is clicked
navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navbar.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// Close nav on scroll
window.addEventListener('scroll', () => {
    if (navbar.classList.contains('open')) {
        hamburger.classList.remove('open');
        navbar.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// ── Sticky header style ───────────────────────────────────────────────
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Scroll reveal ─────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger siblings inside same parent
                const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${idx * 80}ms`;
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Active nav link on scroll ─────────────────────────────────────────
const sections  = document.querySelectorAll('section[id], footer[id]');
const navLinks  = document.querySelectorAll('.navbar a');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.style.color = 'var(--gold)';
                    }
                });
            }
        });
    },
    { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// ── Add to cart toast ─────────────────────────────────────────────────
document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const card  = this.closest('.menu-card');
        const name  = card.querySelector('h3').textContent;
        const price = card.querySelector('.price').textContent;
        showToast(`${name} added — ${price}`);
    });
});

function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-check"></i> ${message}`;

    Object.assign(toast.style, {
        position:    'fixed',
        bottom:      '2rem',
        right:       '2rem',
        background:  'var(--gold)',
        color:       '#0e0c0a',
        padding:     '0.9rem 1.6rem',
        borderRadius:'2px',
        fontSize:    '0.88rem',
        fontWeight:  '500',
        fontFamily:  'var(--font-sans)',
        display:     'flex',
        alignItems:  'center',
        gap:         '0.6rem',
        zIndex:      '9998',
        boxShadow:   '0 12px 40px rgba(0,0,0,0.4)',
        transform:   'translateY(20px)',
        opacity:     '0',
        transition:  'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s',
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity   = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity   = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ── Contact / Reservation JS ──────────────────────────────────────────

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
});

// Guest counter
let guests = 2;
const guestCountEl = document.getElementById('guestCount');
document.getElementById('guestPlus').addEventListener('click', () => {
    if (guests < 20) { guests++; guestCountEl.textContent = guests; }
});
document.getElementById('guestMinus').addEventListener('click', () => {
    if (guests > 1) { guests--; guestCountEl.textContent = guests; }
});

// Reservation submit
document.getElementById('reserveSubmit').addEventListener('click', () => {
    const name = document.getElementById('res-name').value.trim();
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const phone = document.getElementById('res-phone').value.trim();

    if (!name || !date || !time || !phone) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }

    const d = new Date(date);
    const formatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const t = time.replace(/^(\d{2}):(\d{2})$/, (_, h, m) => {
        const hr = parseInt(h);
        return `${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
    });
    showToast(`🎉 Reserved for ${name} — ${formatted} at ${t}, ${guests} guest${guests > 1 ? 's' : ''}`, 'success', 5000);

    // Clear
    document.getElementById('res-name').value = '';
    document.getElementById('res-date').value = '';
    document.getElementById('res-time').value = '';
    document.getElementById('res-phone').value = '';
    document.getElementById('res-note').value = '';
    guests = 2;
    guestCountEl.textContent = guests;
});

// Message submit
document.getElementById('messageSubmit').addEventListener('click', () => {
    const name = document.getElementById('msg-name').value.trim();
    const email = document.getElementById('msg-email').value.trim();
    const body = document.getElementById('msg-body').value.trim();

    if (!name || !email || !body) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }

    showToast(`Message sent! We'll get back to you soon, ${name}.`, 'success', 4000);
    document.getElementById('msg-name').value = '';
    document.getElementById('msg-email').value = '';
    document.getElementById('msg-subject').value = '';
    document.getElementById('msg-body').value = '';
});

// Upgrade showToast to support types
const _originalShowToast = showToast;
window.showToast = function(message, type = 'success', duration = 3000) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    const bg = type === 'error' ? '#c94a4a' : 'var(--gold)';
    const icon = type === 'error' ? 'fa-xmark' : 'fa-check';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;

    Object.assign(toast.style, {
        position:    'fixed',
        bottom:      '2rem',
        right:       '2rem',
        background:  bg,
        color:       type === 'error' ? '#fff' : '#0e0c0a',
        padding:     '0.9rem 1.6rem',
        borderRadius:'2px',
        fontSize:    '0.88rem',
        fontWeight:  '500',
        fontFamily:  'var(--font-sans)',
        display:     'flex',
        alignItems:  'center',
        gap:         '0.6rem',
        zIndex:      '9998',
        maxWidth:    '380px',
        boxShadow:   '0 12px 40px rgba(0,0,0,0.4)',
        transform:   'translateY(20px)',
        opacity:     '0',
        transition:  'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; });
    setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, duration);
};