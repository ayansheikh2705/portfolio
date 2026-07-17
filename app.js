// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Cursor Glow Effect ---
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        // Move glow centered with the mouse
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });


    // --- 2. Mobile Nav Menu Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileNavToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileNavToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
            
            // Set active class
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });


    // --- 3. Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // --- 4. Portfolio Filter System ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add minor fade effect during filter
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });


    // --- 5. Screenshot Lightbox Gallery ---
    const appScreenshots = {
        upsrlm: [
            'assets/screenshots/upsrlm_ss1.png',
            'assets/screenshots/upsrlm_ss2.png',
            'assets/screenshots/upsrlm_ss3.png'
        ],
        millat: [
            'assets/screenshots/millat_ss1.png',
            'assets/screenshots/millat_ss2.png',
            'assets/screenshots/millat_ss3.png'
        ],
        decyde_shop: [
            'assets/screenshots/decyde_shop_ss1.png',
            'assets/screenshots/decyde_shop_ss2.png',
            'assets/screenshots/decyde_shop_ss3.png'
        ],
        decyde_vendor: [
            'assets/screenshots/decyde_vendor_ss1.png',
            'assets/screenshots/decyde_vendor_ss2.png',
            'assets/screenshots/decyde_vendor_ss3.png'
        ],
        resthouse_allottee: [
            'assets/screenshots/resthouse_allottee_ss1.png',
            'assets/screenshots/resthouse_allottee_ss2.png',
            'assets/screenshots/resthouse_allottee_ss3.png'
        ],
        resthouse_user: [
            'assets/screenshots/resthouse_user_ss1.png',
            'assets/screenshots/resthouse_user_ss2.png',
            'assets/screenshots/resthouse_user_ss3.png'
        ]
    };

    let currentAppKey = '';
    let currentScreenshotIdx = 0;

    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const viewScreenshotButtons = document.querySelectorAll('.btn-view-screenshots');

    // Open Lightbox
    viewScreenshotButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentAppKey = button.getAttribute('data-app');
            currentScreenshotIdx = 0;
            updateLightboxContent();
            lightboxModal.classList.add('active');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Stop main scroll
        });
    });

    // Close Lightbox
    const closeLightboxModal = () => {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightboxModal);
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightboxModal();
        }
    });

    // Navigate Lightbox (Next)
    const nextScreenshot = () => {
        const screenshots = appScreenshots[currentAppKey];
        if (screenshots) {
            currentScreenshotIdx = (currentScreenshotIdx + 1) % screenshots.length;
            updateLightboxContent();
        }
    };

    // Navigate Lightbox (Prev)
    const prevScreenshot = () => {
        const screenshots = appScreenshots[currentAppKey];
        if (screenshots) {
            currentScreenshotIdx = (currentScreenshotIdx - 1 + screenshots.length) % screenshots.length;
            updateLightboxContent();
        }
    };

    lightboxNext.addEventListener('click', nextScreenshot);
    lightboxPrev.addEventListener('click', prevScreenshot);

    // Keyboard support for Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightboxModal.classList.contains('active')) {
            if (e.key === 'Escape') closeLightboxModal();
            if (e.key === 'ArrowRight') nextScreenshot();
            if (e.key === 'ArrowLeft') prevScreenshot();
        }
    });

    const updateLightboxContent = () => {
        const screenshots = appScreenshots[currentAppKey];
        if (screenshots && screenshots.length > 0) {
            lightboxImage.style.opacity = '0';
            
            setTimeout(() => {
                lightboxImage.src = screenshots[currentScreenshotIdx];
                // Formulate a clean caption
                const appName = currentAppKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                lightboxCaption.textContent = `${appName} - Screenshot ${currentScreenshotIdx + 1} of ${screenshots.length}`;
                lightboxImage.style.opacity = '1';
            }, 150);
        }
    };


    // --- 6. Screenshot Card Preview Slider (Auto sliding on card hover) ---
    const projectCardsWithSS = document.querySelectorAll('.project-card');
    
    projectCardsWithSS.forEach(card => {
        const track = card.querySelector('.screenshot-track');
        const viewSSBtn = card.querySelector('.btn-view-screenshots');
        if (!track || !viewSSBtn) return;
        
        const appKey = viewSSBtn.getAttribute('data-app');
        let slideInterval = null;
        let slideIndex = 0;
        
        card.addEventListener('mouseenter', () => {
            // Start auto slider on hover
            slideInterval = setInterval(() => {
                slideIndex = (slideIndex + 1) % 3; // 3 screenshots
                track.style.transform = `translateX(-${slideIndex * 33.333}%)`;
            }, 2500);
        });
        
        card.addEventListener('mouseleave', () => {
            // Stop and reset slider on leave
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
            slideIndex = 0;
            track.style.transform = 'translateX(0%)';
        });
    });


    // --- 7. Tap-to-Copy Email Feature ---
    const btnCopyEmail = document.getElementById('btn-copy-email');
    const devEmailText = document.getElementById('dev-email').innerText;

    btnCopyEmail.addEventListener('click', () => {
        navigator.clipboard.writeText(devEmailText).then(() => {
            const icon = btnCopyEmail.querySelector('i');
            
            // Swap icon to success checkmark
            icon.className = 'fa-solid fa-check';
            icon.style.color = '#10b981'; // Green color accent
            
            // Reset to copy icon after 2 seconds
            setTimeout(() => {
                icon.className = 'fa-regular fa-copy';
                icon.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });


    // --- 8. Dynamic Header Active Class on Scroll ---
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });

    document.querySelectorAll('section[id]').forEach(sec => {
        headerObserver.observe(sec);
    });

    // --- 9. Apple-Inspired Scroll-Driven Interactions ---
    const codeEditorMockup = document.querySelector('.code-editor-mockup');
    const scrollLightUpElements = document.querySelectorAll('.scroll-light-up');
    
    // Add minor initial styling for elements to prevent layout shift
    scrollLightUpElements.forEach(el => el.style.setProperty('--progress', '0'));

    const handleScrollAnimations = () => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // A. 3D Scroll Tilt on Hero Mockup
        if (codeEditorMockup) {
            const startScroll = 0;
            const endScroll = 600;
            const progress = Math.min(1, Math.max(0, (scrollY - startScroll) / (endScroll - startScroll)));
            
            // As you scroll down:
            // - scale down from 1 to 0.82
            // - tilt around X axis (pitch back) from 0 to 18 deg
            // - tilt around Y axis (yaw right) from 0 to -12 deg
            const scale = 1 - (progress * 0.18);
            const rotateX = progress * 18;
            const rotateY = progress * -12;
            
            codeEditorMockup.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        }
        
        // B. Scroll Driven Text Light-Up (Gradient Wipe)
        scrollLightUpElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top;
            
            // We want the text to start lighting up when its top enters the viewport (bottom 85% of screen)
            // and reach 100% lit when its top crosses above the middle of the screen.
            const startReveal = viewportHeight * 0.85;
            const endReveal = viewportHeight * 0.35;
            
            let progress = 0;
            if (elementTop < startReveal) {
                progress = (startReveal - elementTop) / (startReveal - endReveal);
                progress = Math.min(1, Math.max(0, progress));
            }
            
            el.style.setProperty('--progress', progress.toFixed(3));
        });
    };

    // Attach scroll handler with requestAnimationFrame for 60fps performance
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScrollAnimations();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // Run once initially to set initial states
    handleScrollAnimations();

});
