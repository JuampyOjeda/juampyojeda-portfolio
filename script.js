/* UPDATE YEAR FOOTER */
document.querySelector(".footer small").innerHTML =
`© ${new Date().getFullYear()} JP. Todos los derechos reservados.`;


/*=========
    NAV
=========*/
const header = document.querySelector(".header");
let lastScrollY = window.scrollY;
let mouseInTopZone = false;
let autoHideTimer = null;
const SCROLL_THRESHOLD = 8;
const AUTO_HIDE_DELAY = 1500; // 1.5s

if(header){
    window.addEventListener("load", () => {
        setTimeout(() => {
            header.classList.add("nav-intro-ready");
        }, 100);
    });
    function showNav(){
        header.classList.remove("nav-hidden");
        scheduleAutoHide();
    }
    function hideNav(){
        header.classList.add("nav-hidden");
        clearTimeout(autoHideTimer);
    }
    function scheduleAutoHide(){
        clearTimeout(autoHideTimer);
        autoHideTimer = setTimeout(() => {
            // no esconder si el mouse sigue arriba de todo o estás en el tope de la página
            if(!mouseInTopZone && window.scrollY > 20){
                hideNav();
            }
        }, AUTO_HIDE_DELAY);
    }
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        if(currentScrollY <= 20){
            header.classList.remove("nav-hidden");
            clearTimeout(autoHideTimer);
            lastScrollY = currentScrollY;
            return;
        }
        const delta = currentScrollY - lastScrollY;
        if(Math.abs(delta) < SCROLL_THRESHOLD){
            return;
        }
        if(delta > 0 && !mouseInTopZone){
            hideNav();
        } else if(delta < 0){
            showNav();
        }
        lastScrollY = currentScrollY;
    }, { passive: true });
    document.addEventListener("mousemove", (e) => {
        mouseInTopZone = e.clientY <= 100;
        if(mouseInTopZone){
            showNav();
        }
    });
}


/*==================
    SCROLL REVEAL
==================*/
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
},{
    threshold: 0.15
});
reveals.forEach(section => observer.observe(section));


/*==================
    STAGGER CARDS
==================*/
const cards = document.querySelectorAll(".reveal-card");
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const siblings = [...entry.target.parentElement.children];
            const index = siblings.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add("active");
            }, index * 120);
        }
    });
},{
    threshold:0.2
});

cards.forEach(card => cardObserver.observe(card));
const spotlightCards = document.querySelectorAll(
    ".project-card, .skill-category, .stat-card"
);

spotlightCards.forEach(card => {
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    });
});


/*==================
    BUTTON GO TOP
==================*/
const goTopBtn = document.getElementById("goTopBtn");

window.addEventListener("scroll", () => {
    if(window.scrollY > 500){
        goTopBtn.classList.add("show");
    }else{
        goTopBtn.classList.remove("show");
    }
});

goTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
});


/*==================
    WHATSAPP INTRO FIX
==================*/
const whatsappBtn = document.querySelector(".whatsapp-btn");

whatsappBtn?.addEventListener("animationend", () => {
    whatsappBtn.style.animation = "none";
}, { once: true });


/*==================
    AVATAR TAP (MOBILE)
==================*/
const aboutImage = document.querySelector(".about-image");
let avatarTimer = null;

aboutImage?.addEventListener("click", () => {
    aboutImage.classList.add("show-hover");
    clearTimeout(avatarTimer);
    avatarTimer = setTimeout(() => {
        aboutImage.classList.remove("show-hover");
    }, 1500);
});


/*==================
    MOBILE MENU
==================*/
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const menuOverlay = document.querySelector(".menu-overlay");
const closeMenuBtn = document.querySelector(".close-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");

function openMobileMenu() {
    hamburger.classList.add("active");
    mobileMenu.classList.add("active");
    menuOverlay.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // evita scroll de fondo
}

function closeMobileMenu() {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
}

if (hamburger) {
    hamburger.addEventListener("click", () => {
        mobileMenu.classList.contains("active")
            ? closeMobileMenu()
            : openMobileMenu();
    });
}

closeMenuBtn?.addEventListener("click", closeMobileMenu);
menuOverlay?.addEventListener("click", closeMobileMenu);
mobileLinks.forEach(link => link.addEventListener("click", closeMobileMenu));

// Cerrar con Escape (accesibilidad)
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        closeMobileMenu();
    }
});


/*==================
    CONTACT FORM
==================*/
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Enviando...";
        submitBtn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: { "Accept": "application/json" }
            });

            if (response.ok) {
                submitBtn.textContent = "¡Mensaje enviado! ✓";
                contactForm.reset();
            } else {
                throw new Error("Error en el envío");
            }
        } catch (err) {
            submitBtn.textContent = "Error, intentá de nuevo";
        } finally {
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}
