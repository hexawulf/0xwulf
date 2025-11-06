import { projects } from './src/data/projects.js';

document.addEventListener('DOMContentLoaded', function() {
    // Typewriter effect
    const typewriterElement = document.querySelector('#hero .typewriter-text');
    if (typewriterElement) {
        const text1 = typewriterElement.getAttribute('data-text1');
        const text2 = typewriterElement.getAttribute('data-text2');
        const texts = [text1, text2];
        let textIndex = 0;
        let charIndex = 0;
        let currentText = '';
        let isDeleting = false;
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const delayBetweenTexts = 2000;

        function type() {
            const fullText = texts[textIndex];
            if (isDeleting) {
                currentText = fullText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = fullText.substring(0, charIndex + 1);
                charIndex++;
            }

            typewriterElement.innerHTML = currentText + '<span class="cursor"></span>';

            let typeOrDeleteSpeed = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && charIndex === fullText.length) {
                isDeleting = true;
                typeOrDeleteSpeed = delayBetweenTexts;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeOrDeleteSpeed = typeSpeed;
            }

            setTimeout(type, typeOrDeleteSpeed);
        }

        if (texts.every(t => t)) {
            setTimeout(type, typeSpeed);
        } else {
            console.error("Typewriter text data attributes are missing or empty.");
        }
    }

    // Particle animation
    initParticles();

    // Hamburger menu
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (navMenu.classList.contains("active")) {
                    hamburger.classList.remove("active");
                    navMenu.classList.remove("active");
                }
            });
        });
    }

    // Project rendering
    renderProjects();
});

function initParticles() {
    const heroCanvas = document.querySelector('#hero .particles-canvas, .hero .particles-canvas');
    if (heroCanvas) {
        setupParticleAnimation(heroCanvas, { density: 0.6 });
    }

    const contactCanvas = document.querySelector('#contact .particles-canvas');
    if (contactCanvas) {
        setupParticleAnimation(contactCanvas, { density: 0.45 });
    }
}

function setupParticleAnimation(canvas, options) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const ctx = canvas.getContext('2d');
    let particlesArray;
    const parent = canvas.parentElement;

    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000 * options.density;
        numberOfParticles = Math.min(numberOfParticles, 100);
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * .4) - .2;
            let directionY = (Math.random() * .4) - .2;
            let color = 'rgba(0, 255, 170, 0.5)';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                    let lineColor = `rgba(0, 255, 170, ${opacityValue * 0.3})`;
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', function() {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        init();
    });

    init();
    animate();
}

function renderProjects() {
    const featuredProjectContainer = document.getElementById('featured-project-container');
    const projectsGrid = document.getElementById('projects-grid');

    const featuredProject = projects.find(p => p.featured);
    const otherProjects = projects.filter(p => !p.featured);

    function createTechPills(techStack) {
        return techStack.map(tech => `<span class="pill">${tech}</span>`).join('');
    }

    if (featuredProject && featuredProjectContainer) {
        featuredProjectContainer.innerHTML = `
            <article class="featured-panel">
                <div class="featured-content">
                    <div class="featured-title-glow"></div>
                    <h3>${featuredProject.icon} ${featuredProject.title}</h3>
                    <p class="featured-description">${featuredProject.description}</p>
                    <div class="project-pills">${createTechPills(featuredProject.techStack)}</div>
                    <div class="project-links">
                        <a href="${featuredProject.codeLink}" target="_blank" rel="noopener noreferrer" class="btn">View Code</a>
                        <a href="${featuredProject.liveLink}" target="_blank" rel="noopener noreferrer" class="btn">Visit Website</a>
                    </div>
                </div>
            </article>
        `;
    }

    if (projectsGrid) {
        projectsGrid.innerHTML = otherProjects.map(project => `
            <article class="card">
                <div class="card-content">
                    <h4>${project.icon} ${project.title}</h4>
                    <p>${project.description}</p>
                    <div class="project-pills">${createTechPills(project.techStack)}</div>
                     <div class="project-links">
                        <a href="${project.codeLink}" target="_blank" rel="noopener noreferrer" class="btn">View Code</a>
                        <a href="${project.liveLink}" target="_blank" rel="noopener noreferrer" class="btn">Visit Website</a>
                    </div>
                </div>
            </article>
        `).join('');
    }
}
