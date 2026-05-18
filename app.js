document.addEventListener('DOMContentLoaded', () => {
    // ==================== HTML5 CANVAS JETS & CONTRAILS ====================
    const canvas = document.getElementById('intro-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let planes = [];
        let isLooping = false;

        // Resize Canvas dynamically
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Floating Background Plane Class
        class FloatingPlane {
            constructor() {
                // Random side to enter from: 0=Left, 1=Right, 2=Bottom
                const entrySide = Math.floor(Math.random() * 3);
                
                if (entrySide === 0) { // Enter from Left
                    this.x = -50;
                    this.y = Math.random() * (canvas.height * 0.6) + canvas.height * 0.1;
                    this.vx = Math.random() * 1.5 + 0.8;
                    this.vy = (Math.random() - 0.5) * 0.6;
                } else if (entrySide === 1) { // Enter from Right
                    this.x = canvas.width + 50;
                    this.y = Math.random() * (canvas.height * 0.6) + canvas.height * 0.1;
                    this.vx = -(Math.random() * 1.5 + 0.8);
                    this.vy = (Math.random() - 0.5) * 0.6;
                } else { // Enter from Bottom
                    this.x = Math.random() * canvas.width;
                    this.y = canvas.height + 50;
                    this.vx = (Math.random() - 0.5) * 1.2;
                    this.vy = -(Math.random() * 1.2 + 0.8);
                }

                this.size = Math.random() * 8 + 12; // Small high-altitude jets (12px to 20px)
                this.speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                this.angle = Math.atan2(this.vy, this.vx);
                
                this.trail = []; // Historical points {x, y, opacity, size} representing contrail
                this.spawnTimer = 0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Spawn contrail node every 3 frames
                this.spawnTimer++;
                if (this.spawnTimer % 3 === 0) {
                    this.trail.push({
                        x: this.x - Math.cos(this.angle) * (this.size * 0.4),
                        y: this.y - Math.sin(this.angle) * (this.size * 0.4),
                        opacity: 0.75,
                        size: 2
                    });
                }

                // Update contrail nodes (slowly fade out and expand to disperse)
                for (let i = this.trail.length - 1; i >= 0; i--) {
                    const node = this.trail[i];
                    node.opacity -= 0.0035; // Slow dispersion fade
                    node.size += 0.12;      // Trail expands as it dissipates
                    if (node.opacity <= 0) {
                        this.trail.splice(i, 1);
                    }
                }
            }

            draw() {
                // 1. Draw glowing, dissipating contrail nodes
                ctx.save();
                for (let i = 0; i < this.trail.length; i++) {
                    const node = this.trail[i];
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity})`;
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
                    ctx.shadowBlur = 4;
                    ctx.fill();
                }
                ctx.restore();

                // 2. Draw sleek white airliner silhouette
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle + Math.PI / 2); // Align heading (vector points up)
                
                ctx.beginPath();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                ctx.shadowColor = 'rgba(15, 23, 42, 0.1)';
                ctx.shadowBlur = 6;
                ctx.shadowOffsetY = 3;

                const s = this.size;
                ctx.moveTo(0, -s * 0.5); // Nose
                ctx.lineTo(s * 0.1, -s * 0.2);
                ctx.lineTo(s * 0.5, s * 0.1); // Right wing tip
                ctx.lineTo(s * 0.1, s * 0.05);
                ctx.lineTo(0.08 * s, s * 0.35); // Right tail stabilizer
                ctx.lineTo(s * 0.2, s * 0.45);
                ctx.lineTo(0, s * 0.4); // Tail end
                ctx.lineTo(-s * 0.2, s * 0.45);
                ctx.lineTo(-0.08 * s, s * 0.35);
                ctx.lineTo(-s * 0.1, s * 0.05);
                ctx.lineTo(-s * 0.5, s * 0.1); // Left wing tip
                ctx.lineTo(-s * 0.1, -s * 0.2);
                ctx.closePath();
                ctx.fill();
                
                ctx.restore();
            }

            isOffscreen() {
                const pad = 120;
                return (this.x < -pad || this.x > canvas.width + pad ||
                        this.y < -pad || this.y > canvas.height + pad);
            }
        }

        // Spawning & Animation Loop
        function loop() {
            if (!isLooping) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Maintain background traffic (max 3 planes at a time)
            if (planes.length < 3 && Math.random() < 0.006) {
                planes.push(new FloatingPlane());
            }

            // Update & render planes
            for (let i = planes.length - 1; i >= 0; i--) {
                const p = planes[i];
                p.update();
                p.draw();
                
                // Cleanup offscreen planes after trail fully dissipates
                if (p.isOffscreen() && p.trail.length === 0) {
                    planes.splice(i, 1);
                }
            }

            animationFrameId = requestAnimationFrame(loop);
        }
        
        // Expose global methods to start/stop canvas dynamically
        window.startIntroAnimation = function() {
            if (isLooping) return;
            isLooping = true;
            planes = []; // reset planes
            loop();
        };

        window.stopIntroAnimation = function() {
            isLooping = false;
            cancelAnimationFrame(animationFrameId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        // Auto start loop on initial mount
        window.startIntroAnimation();
    }

    // ==================== GO AROUND TAKEOFF TRANSITION ====================
    const btnGoAround = document.getElementById('btn-go-around');
    const pageIntro = document.getElementById('page-intro');
    const pageMain = document.getElementById('page-main');
    const takeoffTransition = document.getElementById('takeoff-transition');

    if (btnGoAround && pageIntro && pageMain && takeoffTransition) {
        btnGoAround.addEventListener('click', () => {
            // 1. Play Takeoff flying-up wipe
            takeoffTransition.classList.add('active');

            // 2. Midpoint (0.8s) when cloud cover fully conceals the screen, switch views
            setTimeout(() => {
                pageIntro.classList.remove('active');
                pageMain.classList.add('active');
                
                // Safely kill background canvas thread to optimize performance
                if (typeof window.stopIntroAnimation === 'function') {
                    window.stopIntroAnimation();
                }
            }, 800);

            // 3. Takeoff complete (1.6s), hide transition overlay completely
            setTimeout(() => {
                takeoffTransition.classList.remove('active');
                pageIntro.style.display = 'none'; // Unmount standby screen
            }, 1600);
        });
    }

    // ==================== RETURN TO STANDBY LANDING TRANSITION ====================
    const btnReturnStandby = document.getElementById('btn-return-standby');
    const landingTransition = document.getElementById('landing-transition');

    if (btnReturnStandby && pageIntro && pageMain && landingTransition) {
        btnReturnStandby.addEventListener('click', () => {
            // Re-mount standby screen block in HTML DOM hierarchy before wipe
            pageIntro.style.display = 'flex';
            
            // 1. Play Landing flying-down sweep wipe
            landingTransition.classList.add('active');

            // 2. Midpoint (0.8s) when cloud cover fully conceals the screen, swap views
            setTimeout(() => {
                pageMain.classList.remove('active');
                pageIntro.classList.add('active');
                
                // Re-start HTML5 canvas flying jet simulations
                if (typeof window.startIntroAnimation === 'function') {
                    window.startIntroAnimation();
                }
            }, 800);

            // 3. Landing complete (1.6s), hide landing transition overlay
            setTimeout(() => {
                landingTransition.classList.remove('active');
            }, 1600);
        });
    }

    // ==================== LOCAL VIEW ROUTING (PROFILE) ====================
    const transitionOverlay = document.getElementById('transition-overlay');
    let isTransitioning = false;

    function navigateTo(targetPageId) {
        if (isTransitioning) return;
        isTransitioning = true;

        const currentPage = document.querySelector('.page-view.active');
        const targetPage = document.getElementById(targetPageId);

        if (!currentPage || !targetPage) {
            isTransitioning = false;
            return;
        }

        // Determine flight direction: L->R when heading to profile, R->L when returning to main dashboard
        const directionClass = (targetPageId === 'page-profile') ? 'direction-right' : 'direction-left';
        transitionOverlay.classList.add(directionClass, 'active');

        // 2. Midpoint swap (0.8s)
        setTimeout(() => {
            currentPage.classList.remove('active');
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'instant' });

            if (targetPageId === 'page-profile') {
                animateProfileSkills();
            }
        }, 800);

        // 3. Clear overlay and reset direction states (1.6s)
        setTimeout(() => {
            transitionOverlay.classList.remove('active', 'direction-right', 'direction-left');
            isTransitioning = false;
        }, 1600);
    }

    // Connect VIP Profile Boarding Pass
    const btnProfile = document.getElementById('btn-profile');
    if (btnProfile) {
        btnProfile.addEventListener('click', () => navigateTo('page-profile'));
        btnProfile.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                navigateTo('page-profile');
            }
        });
    }

    // Connect Profile Back Button
    const backButtons = document.querySelectorAll('.btn-back');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => navigateTo('page-main'));
    });

    // Profile Skill Progress Bar Fill
    function animateProfileSkills() {
        const skillProgresses = document.querySelectorAll('.skill-progress');
        skillProgresses.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                bar.style.width = targetWidth;
            }, 100);
        });
    }
});
