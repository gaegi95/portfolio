document.addEventListener('DOMContentLoaded', () => {
    // ==================== TACTICAL CLOCK ====================
    const clockDisplay = document.getElementById('system-clock');
    
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        if (clockDisplay) {
            clockDisplay.textContent = `${hrs}:${mins}:${secs}`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ==================== INTERACTIVE SENSORY RADAR SIMULATOR ====================
    const btnNoise = document.getElementById('radar-btn-noise');
    const btnWeapon = document.getElementById('radar-btn-weapon');
    const btnReset = document.getElementById('radar-btn-reset');
    const radarRing = document.getElementById('radar-ring');
    const radarLog = document.getElementById('radar-log');
    
    // Zombie DOM targets
    const zb1 = document.getElementById('zb-1');
    const zb2 = document.getElementById('zb-2');
    const zb3 = document.getElementById('zb-3');

    // Original positions for reset
    const originalPositions = {
        zb1: { top: '22%', left: '32%' },
        zb2: { top: '68%', left: '74%' },
        zb3: { top: '38%', left: '82%' }
    };

    let timeouts = [];

    // Log printer
    function printLog(message, isAlert = false) {
        if (!radarLog) return;
        radarLog.textContent = message;
        if (isAlert) {
            radarLog.className = 'console-sub-log log-alert';
        } else {
            radarLog.className = 'console-sub-log';
        }
    }

    // 1. MAKE NOISE (소음 유발)
    if (btnNoise) {
        btnNoise.addEventListener('click', () => {
            // Stop any ongoing animations or timeouts
            clearAllTimeouts();
            
            // Re-trigger soundwave circle expansion
            radarRing.classList.remove('expanding');
            void radarRing.offsetWidth; // Force reflow to restart animation
            radarRing.classList.add('expanding');

            printLog("[SOUND] Acoustic wave propagated (Intensity: 85dB, Radius: 12.0m).");

            // Zombie 1: Close range. Alerts after 400ms.
            const t1 = setTimeout(() => {
                zb1.classList.add('hostile-aggro');
                // Move towards player (50%, 50%) smoothly
                zb1.style.transition = 'all 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                zb1.style.top = '50%';
                zb1.style.left = '50%';
                printLog("[AI] Zombie [zb_01] Alerted! Sound threshold (2.5dB) exceeded. Recalculating A* pathfinding...", true);
            }, 400);

            // Zombie 3: Medium range. Alerts after 850ms.
            const t2 = setTimeout(() => {
                zb3.classList.add('hostile-aggro');
                zb3.style.transition = 'all 4.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                zb3.style.top = '50%';
                zb3.style.left = '50%';
                printLog("[AI] Zombie [zb_03] Alerted! Sound vector traced. Entering hostiles pursuit mode.", true);
            }, 850);

            // Zombie 2: Long range. Alerts after 1300ms.
            const t3 = setTimeout(() => {
                zb2.classList.add('hostile-aggro');
                zb2.style.transition = 'all 5.0s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                zb2.style.top = '50%';
                zb2.style.left = '50%';
                printLog("[AI] Zombie [zb_02] Alerted! Acoustic sensory node warning. Tactical search engaged.", true);
            }, 1300);

            // Final chase state warning
            const t4 = setTimeout(() => {
                printLog("!!! WARNING: MULTIPLE SENSORY THREATS ARE INBOUND TO YOUR LOCATION !!!", true);
            }, 2500);

            timeouts.push(t1, t2, t3, t4);
        });
    }

    // 2. DRAW WEAPON (홀스터 무기 발도)
    if (btnWeapon) {
        btnWeapon.addEventListener('click', () => {
            clearAllTimeouts();
            printLog("[VR_INPUT] Right controller hand entered Holster Volume [Waist_Right].");

            const t1 = setTimeout(() => {
                printLog("[VR_INPUT] Haptic trigger feedback sent (100ms pulse, 90Hz intensity). Grip established.");
            }, 400);

            const t2 = setTimeout(() => {
                printLog("[WEAPON] Success! Drawn Machete from Holster. Collision Jolt body assigned (Mass: 1.8kg).");
            }, 900);

            timeouts.push(t1, t2);
        });
    }

    // 3. RESET RADAR (레이더 초기화)
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            clearAllTimeouts();
            
            // Remove soundwave ring animation
            radarRing.classList.remove('expanding');

            // Reset Zombie classes & original coordinates smoothly
            [zb1, zb2, zb3].forEach(zb => {
                zb.classList.remove('hostile-aggro');
                zb.style.transition = 'all 1.0s ease-out';
            });

            zb1.style.top = originalPositions.zb1.top;
            zb1.style.left = originalPositions.zb1.left;
            
            zb2.style.top = originalPositions.zb2.top;
            zb2.style.left = originalPositions.zb2.left;

            zb3.style.top = originalPositions.zb3.top;
            zb3.style.left = originalPositions.zb3.left;

            printLog("SYSTEM: Radar sweep calibration successful. Sensory vectors reset.");
        });
    }

    // Helper: Clear active timeouts
    function clearAllTimeouts() {
        timeouts.forEach(t => clearTimeout(t));
        timeouts = [];
    }
});
