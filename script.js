
// WiFiRx - Website Functionality

const startButton = document.getElementById("startBtn");
const diagnoseButton = document.getElementById("diagnoseBtn");
const wifiProblem = document.getElementById("wifiProblem");
const problemLocation = document.getElementById("problemLocation");
const results = document.getElementById("results");
const compareButton = document.getElementById("compareBtn");
const comparisonResults = document.getElementById("comparisonResults");
const speedChart = document.getElementById("speedChart");

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

// Start Troubleshooting
startButton.addEventListener("click", function() {
    document.getElementById("diagnosis").scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start"
    });
    wifiProblem.focus({ preventScroll: true });
});

// Safe result rendering
function showResult(element, heading, message, error = false) {
    element.replaceChildren();

    const title = document.createElement("strong");
    title.textContent = heading;

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    element.append(title, paragraph);
    element.classList.toggle("error", error);
}

// Personalized Diagnosis
diagnoseButton.addEventListener("click", function() {
    const problem = wifiProblem.value;
    const location = problemLocation.value;

    if (!problem || !location) {
        showResult(
            results,
            "A Little More Information",
            "Please select a Wi-Fi problem and its location.",
            true
        );
        return;
    }

    let recommendation = "";

    if (location === "oneDevice") {
        recommendation =
            "Since only one device is affected, check its Wi-Fi " +
            "settings, restart it, and test another device on " +
            "the same network. If other devices work, focus " +
            "on the affected device.";

    } else if (problem === "slow" && location === "oneRoom") {
        recommendation =
            "Slow speeds in one room may result from distance, " +
            "walls, or interference. Compare speeds near your " +
            "router and in the affected room. Consider moving " +
            "the router or improving coverage.";

    } else if (problem === "slow" && location === "wholeHouse") {
        recommendation =
            "Slow speeds throughout the house may indicate " +
            "network congestion or an internet service issue. " +
            "Restart the router, pause large downloads, and " +
            "test your connection near the router.";

    } else if (problem === "weak" && location === "oneRoom") {
        recommendation =
            "Weak signal in one room may be caused by distance " +
            "or obstacles. Try repositioning the router, " +
            "moving closer, or considering a mesh system " +
            "if coverage remains poor.";

    } else if (problem === "weak" && location === "wholeHouse") {
        recommendation =
            "Weak Wi-Fi throughout the house may indicate " +
            "poor router placement. Position the router " +
            "centrally, elevated, and away from large metal " +
            "objects and interfering electronics.";

    } else if (problem === "disconnect") {
        recommendation =
            "Frequent disconnections may involve interference, " +
            "router instability, or outdated firmware. Restart " +
            "your router, check for firmware updates, and see " +
            "whether several devices disconnect together.";

    } else if (problem === "noConnection") {
        recommendation =
            "Check that Wi-Fi is enabled, airplane mode is off, " +
            "and the correct network and password are selected. " +
            "Restart the device and router. If every device " +
            "fails, check your internet service status.";
    }

    showResult(results, "Your WiFiRx Recommendation", recommendation);
});

// Room Comparison
compareButton.addEventListener("click", function() {
    const room1 = document.getElementById("room1").value.trim();
    const room2 = document.getElementById("room2").value.trim();
    const speed1Text = document.getElementById("speed1").value;
    const speed2Text = document.getElementById("speed2").value;

    speedChart.hidden = true;

    if (!room1 || !room2 ||
        speed1Text === "" || speed2Text === "") {
        showResult(
            comparisonResults,
            "Missing Information",
            "Please enter both room names and speeds.",
            true
        );
        return;
    }

    const speed1 = Number(speed1Text);
    const speed2 = Number(speed2Text);

    if (!Number.isFinite(speed1) ||
        !Number.isFinite(speed2) ||
        speed1 < 0 || speed2 < 0) {
        showResult(
            comparisonResults,
            "Invalid Speed",
            "Please enter valid download speeds of 0 Mbps or higher.",
            true
        );
        return;
    }

    if (room1.toLowerCase() === room2.toLowerCase()) {
        showResult(
            comparisonResults,
            "Check Room Names",
            "Please enter two different room names.",
            true
        );
        return;
    }

    let message;

    if (speed1 === speed2) {
        message =
            "Both rooms measured " + speed1 +
            " Mbps. No speed difference was detected.";
    } else {
        const fasterRoom = speed1 > speed2 ? room1 : room2;
        const slowerRoom = speed1 < speed2 ? room1 : room2;
        const fasterSpeed = Math.max(speed1, speed2);
        const slowerSpeed = Math.min(speed1, speed2);

        const difference =
            ((fasterSpeed - slowerSpeed) / fasterSpeed) * 100;

        let advice;

        if (difference >= 50) {
            advice =
                "This is a large difference. Check router placement, " +
                "walls, obstacles, and coverage in " + slowerRoom + ".";
        } else if (difference >= 20) {
            advice =
                "This is a noticeable difference. Try testing " +
                "closer to the router and checking interference.";
        } else {
            advice =
                "The speeds are relatively close. Small differences " +
                "can occur because of network activity.";
        }

        message =
            fasterRoom + " measured " + fasterSpeed +
            " Mbps and " + slowerRoom + " measured " +
            slowerSpeed + " Mbps. " + slowerRoom +
            " was " + difference.toFixed(1) +
            "% slower than " + fasterRoom + ". " + advice;
    }

    showResult(comparisonResults, "Your Speed Comparison", message);

    // Visual bar chart
    const maximum = Math.max(speed1, speed2);

    document.getElementById("chartRoom1").textContent = room1;
    document.getElementById("chartRoom2").textContent = room2;
    document.getElementById("chartSpeed1").textContent =
        speed1 + " Mbps";
    document.getElementById("chartSpeed2").textContent =
        speed2 + " Mbps";

    document.getElementById("bar1").style.width =
        (maximum === 0 ? 0 : speed1 / maximum * 100) + "%";
    document.getElementById("bar2").style.width =
        (maximum === 0 ? 0 : speed2 / maximum * 100) + "%";

    speedChart.hidden = false;
});

// Scroll animation
const storySection = document.querySelector(".scroll-story");
const storyPanels = document.querySelectorAll(".story-panel");
const progressDots = document.querySelectorAll(
    ".story-progress span"
);

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function updateStory() {
    if (reducedMotion.matches) return;

    const rect = storySection.getBoundingClientRect();
    const distance = storySection.offsetHeight - window.innerHeight;

    if (distance <= 0) return;

    const progress = clamp(-rect.top / distance, 0, 1);
    const stage = progress * storyPanels.length;

    const activeIndex = Math.min(
        storyPanels.length - 1,
        Math.floor(stage)
    );

    storyPanels.forEach(function(panel, index) {
        const local = stage - index;
        let opacity = 0;
        let scale = .75;

        if (local >= 0 && local < .18) {
            const amount = local / .18;
            opacity = amount;
            scale = .75 + amount * .25;
        } else if (local >= .18 && local <= .82) {
            opacity = 1;
            scale = 1;
        } else if (local > .82 && local < 1) {
            const amount = (local - .82) / .18;
            opacity = 1 - amount;
            scale = 1 + amount * .12;
        }

        if (index === 0 && progress === 0) {
            opacity = 1;
            scale = 1;
        }

        if (index === storyPanels.length - 1 &&
            progress >= .94) {
            opacity = 1;
            scale = 1;
        }

        panel.style.opacity = opacity;
        panel.style.transform = "scale(" + scale + ")";
        panel.style.zIndex =
            index === activeIndex ? "2" : "1";
    });

    progressDots.forEach(function(dot, index) {
        dot.classList.toggle("active", index === activeIndex);
    });
}

let scheduled = false;

function requestStoryUpdate() {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(function() {
        updateStory();
        scheduled = false;
    });
}

window.addEventListener("scroll", requestStoryUpdate, {
    passive: true
});
window.addEventListener("resize", requestStoryUpdate);

reducedMotion.addEventListener("change", function() {
    if (reducedMotion.matches) {
        storyPanels.forEach(function(panel) {
            panel.style.opacity = "";
            panel.style.transform = "";
            panel.style.zIndex = "";
        });
    } else {
        requestStoryUpdate();
    }
});

requestStoryUpdate();

// Highlight the navigation tab for the current section.
const navLinks = document.querySelectorAll(".nav-links a");

function updateActiveNav() {
    const position = window.scrollY + 180;
    const diagnosis = document.getElementById("diagnosis");
    const roomComparison = document.getElementById("roomComparison");

    let activeSection = "#home";

    if (diagnosis && position >= diagnosis.offsetTop) {
        activeSection = "#diagnosis";
    }

    // The tools are side by side on desktop, so select
    // the tab explicitly when its navigation link is clicked.
    navLinks.forEach(function(link) {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === activeSection
        );
    });
}

navLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        navLinks.forEach(function(item) {
            item.classList.remove("active");
        });
        link.classList.add("active");
    });
});

window.addEventListener("scroll", updateActiveNav, {
    passive: true
});

updateActiveNav();
