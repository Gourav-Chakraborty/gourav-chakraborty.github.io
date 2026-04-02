document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================
       1. Theme Toggle Logic (Dark/Light Mode)
       ========================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved theme preference in localStorage, or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply initial theme
    applyTheme(currentTheme);

    // Event listener for the toggle button
    themeToggleBtn.addEventListener('click', () => {
        // Simple rotation animation for the icon
        themeIcon.style.transform = 'rotate(180deg)';
        setTimeout(() => { themeIcon.style.transform = 'rotate(0deg)'; }, 300);

        // Toggle theme string
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply and Save
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });

    /**
     * Applies the selected theme to the DOM and updates the icon
     * @param {string} theme - 'dark' or 'light'
     */
    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun'; // Show sun to toggle light mode
        } else {
            themeIcon.className = 'fas fa-moon'; // Show moon to toggle dark mode
        }
    }


    /* ==========================================================
       2. Scroll Reveal Animations (Intersection Observer)
       ========================================================== */
    const sections = document.querySelectorAll('.section-hidden');

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            // Add visible class to trigger CSS transition
            entry.target.classList.add('section-visible');
            
            // Unobserve to run the animation only once per load
            observer.unobserve(entry.target);
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null, // viewport
        threshold: 0.15, // Trigger when 15% of section is visible
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    /* ==========================================================
       3. Smooth Scrolling for Navigation Links
       ========================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed navbar height
                const headerOffset = 70; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    /* ==========================================================
       4. Gallery Lightbox Logic
       ========================================================== */
    const lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) {
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        const closeLightbox = lightbox.querySelector('.close');

        // Add click event to all photo stacks
        document.querySelectorAll('.photo-stack').forEach(stack => {
            stack.addEventListener('click', () => {
                // Clear previous content
                lightboxContent.innerHTML = '';
                
                // Get all images within this stack
                const images = stack.querySelectorAll('img');
                if(images.length === 0) return;

                images.forEach(img => {
                    const item = document.createElement('div');
                    item.className = 'lightbox-item';
                    
                    const clonedImg = document.createElement('img');
                    clonedImg.src = img.src;
                    clonedImg.alt = img.alt;
                    
                    const desc = document.createElement('p');
                    // Use alt text as description
                    desc.innerHTML = img.alt || 'Gallery Image';
                    
                    item.appendChild(clonedImg);
                    item.appendChild(desc);
                    lightboxContent.appendChild(item);
                });
                
                // Show lightbox
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // prevent background scroll
            });
        });

        closeLightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // restore scroll
        });

        // Close on outside click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ==========================================================
       5. Scrollspy for Navigation Links
       ========================================================== */
    const navLinks = document.querySelectorAll('.nav-link');
    const spySections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        spySections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // Account for fixed header

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Special cases
        if (current === 'covers') {
            current = 'research';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
