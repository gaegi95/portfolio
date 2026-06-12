document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Interactive Flowchart Node Switcher ---
    const nodes = document.querySelectorAll(".flow-node");
    const panels = document.querySelectorAll(".panel-card");

    nodes.forEach(node => {
        node.addEventListener("click", () => {
            // Remove active class from all nodes
            nodes.forEach(n => n.classList.remove("active"));
            
            // Add active class to clicked node
            node.classList.add("active");

            // Get target node ID
            const targetNode = node.getAttribute("data-node");
            
            // Switch panels with a smooth transition
            panels.forEach(panel => {
                panel.classList.remove("active");
                if (panel.id === `panel-${targetNode}`) {
                    panel.classList.add("active");
                }
            });

            // If on mobile view, scroll info panel into view smoothly
            if (window.innerWidth <= 992) {
                const infoPanel = document.querySelector(".flowchart-info-panel");
                if (infoPanel) {
                    infoPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            }

            // Print cute console log for developer-first inspect experience!
            console.log(`%c[LOTTERY ARCHITECTURE] %cSwitched to Node: ${targetNode.toUpperCase()}`, "color: #05ffc5; font-weight: bold;", "color: #f5f7fa;");
        });
    });

    // --- 2. Technical Section Entrance Animations ---
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

    // --- 3. Initial Vibe Console Greeting ---
    console.log(
        "%c🎰 Welcome to the Google Apps Script Lottery Pipeline Spec! 🎰\n%cServer & DB Hosting Cost: $0.00 | Real-time database sync: OK",
        "font-size: 14px; color: #00f2fe; font-weight: bold;",
        "font-size: 11px; color: #8fa0dd;"
    );
});
