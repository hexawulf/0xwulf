document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.querySelector('#hero .typewriter-text');
    if (typewriterElement) {
        const text1 = typewriterElement.getAttribute('data-text1');
        const text2 = typewriterElement.getAttribute('data-text2');
        const texts = [text1, text2];
        let textIndex = 0;
        let charIndex = 0;
        let currentText = '';
        let isDeleting = false;
        const typeSpeed = 100; // Speed of typing
        const deleteSpeed = 50; // Speed of deleting
        const delayBetweenTexts = 2000; // Delay before starting to type next text

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
                // Finished typing current text
                isDeleting = true;
                typeOrDeleteSpeed = delayBetweenTexts; // Wait before deleting
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting current text
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length; // Move to next text
                typeOrDeleteSpeed = typeSpeed; // Start typing next text immediately or with a small delay
            }

            setTimeout(type, typeOrDeleteSpeed);
        }

        if (texts.every(t => t)) { // Ensure texts are not null or empty
            setTimeout(type, typeSpeed); // Initial call to start typing
        } else {
            console.error("Typewriter text data attributes are missing or empty.");
        }
    }
});

// Add this at the end of script.js, after the typewriter code.
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.getElementById('hero');
    const particlesContainer = heroSection ? heroSection.querySelector('.particles') : null;

    if (particlesContainer) {
        const canvas = document.createElement('canvas');
        particlesContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let particlesArray;

        // Set canvas dimensions
        canvas.width = particlesContainer.offsetWidth;
        canvas.height = particlesContainer.offsetHeight;

        // Particle object
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            // Method to draw individual particle
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            // Check particle position, check mouse position, move the particle, draw the particle
            update() {
                // Check if particle is still within canvas
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Move particle
                this.x += this.directionX;
                this.y += this.directionY;

                // Draw particle
                this.draw();
            }
        }

        // Create particle array
        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000; // Adjust density
            numberOfParticles = Math.min(numberOfParticles, 100); // Max 100 particles
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1; // Size between 1 and 3
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .4) - .2; // Movement speed and direction
                let directionY = (Math.random() * .4) - .2;
                let color = 'rgba(0, 255, 170, 0.5)'; // Neon cyan with transparency

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect(); // Connect particles with lines
        }

        // Function to connect particles with lines
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                                 + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    if (distance < (canvas.width/7) * (canvas.height/7)) { // Adjust connection distance
                        opacityValue = 1 - (distance/20000); // Adjust opacity based on distance
                        let lineColor = `rgba(0, 255, 170, ${opacityValue * 0.3})`; // Fainter lines
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }

            // Resize event
            window.addEventListener('resize', function() {
                canvas.width = particlesContainer.offsetWidth;
                canvas.height = particlesContainer.offsetHeight;
                // Reinitialize particles on resize, or just adjust positions.
                // For simplicity, we can re-init, but for performance, adjusting might be better.
                init();
            });

            // Initial setup
            init();
            animate();

        } else {
            // console.error("Particle container not found in #hero section.");
            // It's possible this script runs before the DOM is fully ready for this specific element,
            // or the element genuinely isn't there. The DOMContentLoaded wrapper should help.
        }
    });

// Add this at the end of script.js
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link"); // To close menu on link click

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close menu when a link is clicked (useful for single-page apps)
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (navMenu.classList.contains("active")) {
                    hamburger.classList.remove("active");
                    navMenu.classList.remove("active");
                }
            });
        });
    }
});
