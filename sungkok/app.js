document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Warning Markers Scroll-Sync ---
    const markers = document.querySelectorAll(".warning-marker");
    const cards = document.querySelectorAll(".analysis-card");

    markers.forEach(marker => {
        marker.addEventListener("click", () => {
            const markerId = marker.textContent.trim(); // "1" or "2"
            let targetCardIndex = parseInt(markerId) - 1; // 0 or 1
            
            if (cards[targetCardIndex]) {
                // Smooth scroll to target card
                cards[targetCardIndex].scrollIntoView({ behavior: "smooth", block: "center" });
                
                // Highlight target card
                cards[targetCardIndex].style.borderColor = "#ef4444";
                cards[targetCardIndex].style.boxShadow = "0 10px 25px rgba(239, 68, 68, 0.08)";
                cards[targetCardIndex].style.transform = "translateX(10px) scale(1.02)";
                
                // Reset after 2 seconds
                setTimeout(() => {
                    cards[targetCardIndex].style.borderColor = "";
                    cards[targetCardIndex].style.boxShadow = "";
                    cards[targetCardIndex].style.transform = "";
                }, 2000);
            }
        });
    });

    // --- 2. Solution Hotspots Click Interactions ---
    const hotspots = document.querySelectorAll(".solution-hotspot");
    hotspots.forEach(hotspot => {
        hotspot.addEventListener("click", () => {
            const text = hotspot.textContent.trim();
            
            // Create a elegant floating toast notification
            const toast = document.createElement("div");
            toast.style.position = "fixed";
            toast.style.bottom = "30px";
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%) translateY(20px)";
            toast.style.background = "#1e3f20";
            toast.style.color = "#f5f4f0";
            toast.style.border = "1.5px solid #d4af37";
            toast.style.padding = "14px 28px";
            toast.style.borderRadius = "30px";
            toast.style.fontSize = "0.85rem";
            toast.style.fontWeight = "800";
            toast.style.boxShadow = "0 10px 30px rgba(30, 63, 32, 0.25)";
            toast.style.zIndex = "1000";
            toast.style.opacity = "0";
            toast.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
            toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#d4af37; margin-right:8px;"></i> 디자인 키워드: <strong>${text}</strong>`;
            
            document.body.appendChild(toast);
            
            // Trigger animation
            setTimeout(() => {
                toast.style.opacity = "1";
                toast.style.transform = "translateX(-50%) translateY(0)";
            }, 50);
            
            // Fade out and remove
            setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.transform = "translateX(-50%) translateY(-20px)";
                setTimeout(() => {
                    toast.remove();
                }, 400);
            }, 2500);
        });
    });

    // --- 3. Scroll Reveal Transition ---
    const sections = document.querySelectorAll("section");
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < triggerBottom) {
                section.style.opacity = "1";
                section.style.transform = "translateY(0)";
            }
        });
    };

    // Prepare sections for entrance animations
    sections.forEach((section, index) => {
        // Skip hero since it has a direct CSS keyframe animation
        if (index === 0) return;
        
        section.style.opacity = "0";
        section.style.transform = "translateY(40px)";
        section.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    });

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger once on load
});
