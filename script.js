
// ==========================================
// WiFiRx - Your Prescription for Better Wi-Fi
// ==========================================

// General helpers

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

function showResult(element, heading, message, error = false) {
    element.replaceChildren();

    const title = document.createElement("strong");
    title.textContent = heading;

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    element.append(title, paragraph);
    element.classList.toggle("error", error);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


// ==========================================
// Start Troubleshooting
// ==========================================

const startButton = document.getElementById("startBtn");
const diagnoseButton = document.getElementById("diagnoseBtn");
const wifiProblem = document.getElementById("wifiProblem");
const problemLocation = document.getElementById("problemLocation");
const results = document.getElementById("results");

startButton.addEventListener("click", function() {
    document.getElementById("diagnosis").scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start"
    });
});


// ==========================================
// Personalized Troubleshooting
// ==========================================

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

    showResult(
        results,
        "Your WiFiRx Recommendation",
        recommendation
    );
});


// ==========================================
// Dynamic Room Comparison
// ==========================================

const roomsContainer = document.getElementById("roomsContainer");
const addRoomButton = document.getElementById("addRoomBtn");
const compareButton = document.getElementById("compareBtn");
const comparisonResults = document.getElementById("comparisonResults");
const speedChart = document.getElementById("speedChart");
const chartBars = document.getElementById("chartBars");

let nextRoomId = 1;

// Hide outdated results whenever room data changes
function clearComparison() {
    comparisonResults.replaceChildren();
    comparisonResults.classList.remove("error");
    speedChart.hidden = true;
    chartBars.replaceChildren();
}

// Renumber rooms after adding or removing
function updateRoomNumbers() {
    const entries = roomsContainer.querySelectorAll(".room-entry");

    entries.forEach(function(entry, index) {
        entry.querySelector(".room-entry-title").textContent =
            "Room " + (index + 1);

        const removeButton = entry.querySelector(
            ".remove-room-button"
        );

        removeButton.hidden = entries.length <= 2;
    });
}

// Create a new room entry
function addRoom(name = "", speed = "") {
    const roomId = nextRoomId++;

    const entry = document.createElement("div");
    entry.className = "room-entry";

    // Header
    const header = document.createElement("div");
    header.className = "room-entry-header";

    const title = document.createElement("span");
    title.className = "room-entry-title";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-room-button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", "Remove room");

    removeButton.addEventListener("click", function() {
        if (roomsContainer.children.length <= 2) return;

        entry.remove();
        updateRoomNumbers();
        clearComparison();
    });

    header.append(title, removeButton);

    // Input fields
    const fields = document.createElement("div");
    fields.className = "room-fields";

    const nameGroup = document.createElement("div");
    nameGroup.className = "form-group";

    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Room Name";
    nameLabel.htmlFor = "roomName" + roomId;

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "roomName" + roomId;
    nameInput.className = "room-name";
    nameInput.placeholder = "e.g., Living Room";
    nameInput.maxLength = 50;
    nameInput.value = name;

    nameGroup.append(nameLabel, nameInput);

    const speedGroup = document.createElement("div");
    speedGroup.className = "form-group";

    const speedLabel = document.createElement("label");
    speedLabel.textContent = "Download Speed (Mbps)";
    speedLabel.htmlFor = "roomSpeed" + roomId;

    const speedInput = document.createElement("input");
    speedInput.type = "number";
    speedInput.id = "roomSpeed" + roomId;
    speedInput.className = "room-speed";
    speedInput.placeholder = "e.g., 250";
    speedInput.min = "0";
    speedInput.step = "any";
    speedInput.value = speed;

    speedGroup.append(speedLabel, speedInput);

    fields.append(nameGroup, speedGroup);
    entry.append(header, fields);

    roomsContainer.appendChild(entry);

    nameInput.addEventListener("input", clearComparison);
    speedInput.addEventListener("input", clearComparison);

    updateRoomNumbers();

    return entry;
}

// Start with two rooms
addRoom();
addRoom();

// Add another room
addRoomButton.addEventListener("click", function() {
    const entry = addRoom();
    clearComparison();

    entry.querySelector(".room-name").focus();
});

// Compare all entered rooms
compareButton.addEventListener("click", function() {
    const entries = roomsContainer.querySelectorAll(".room-entry");
    const rooms = [];
    const seenNames = new Set();

    clearComparison();

    for (const entry of entries) {
        const name = entry.querySelector(".room-name").value.trim();
        const speedInput = entry.querySelector(".room-speed");
        const speedText = speedInput.value.trim();
        const speed = Number(speedText);

        if (!name || speedText === "") {
            showResult(
                comparisonResults,
                "Missing Information",
                "Please enter a room name and download speed for every room.",
                true
            );
            return;
        }

        if (!Number.isFinite(speed) || speed < 0 ||
            !speedInput.validity.valid) {
            showResult(
                comparisonResults,
                "Invalid Speed",
                "Please enter a valid download speed of 0 Mbps or higher for every room.",
                true
            );
            return;
        }

        const normalizedName = name.toLowerCase();

        if (seenNames.has(normalizedName)) {
            showResult(
                comparisonResults,
                "Duplicate Room Name",
                "Please use a different name for each room.",
                true
            );
            return;
        }

        seenNames.add(normalizedName);
        rooms.push({ name, speed });
    }

    if (rooms.length < 2) {
        showResult(
            comparisonResults,
            "More Rooms Needed",
            "Please enter at least two rooms.",
            true
        );
        return;
    }

    const sortedRooms = [...rooms].sort(
        (a, b) => b.speed - a.speed
    );

    const fastest = sortedRooms[0];
    const slowest = sortedRooms[sortedRooms.length - 1];
    const maximum = fastest.speed;
    const minimum = slowest.speed;

    // Short, easy-to-read comparison results
    let message = "";

    if (maximum === minimum) {
        message =
            "All rooms have the same measured download speed. " +
            "No difference was detected.";

    } else {
        const difference = maximum === 0
            ? 0
            : ((maximum - minimum) / maximum) * 100;

        const slowestNames = rooms
            .filter(room => room.speed === minimum)
            .map(room => room.name)
            .join(", ");

        if (difference >= 50) {
            message =
                "Large speed difference detected! " +
                slowestNames + " is significantly slower. " +
                "Check router placement, walls, and interference " +
                "near this area. Repeat the test to confirm.";

        } else if (difference >= 20) {
            message =
                "Noticeable speed difference detected. " +
                slowestNames + " has a slower connection. " +
                "Try testing closer to your router and checking " +
                "for obstacles or interference.";

        } else {
            message =
                "Your room speeds are relatively similar. " +
                "Small differences may result from " +
                "normal network activity.";
        }
    }

    showResult(
        comparisonResults,
        "Your Room Speed Comparison",
        message
    );

    // Create chart bars for every room
    sortedRooms.forEach(function(room) {
        const row = document.createElement("div");
        row.className = "speed-row";

        const label = document.createElement("div");
        label.className = "speed-label";

        const roomName = document.createElement("span");
        roomName.textContent = room.name;

        const roomSpeed = document.createElement("strong");
        roomSpeed.textContent = room.speed + " Mbps";

        label.append(roomName, roomSpeed);

        const track = document.createElement("div");
        track.className = "bar-track";

        const bar = document.createElement("div");
        bar.className = "bar";

        // Fastest room is purple, other rooms are teal
        bar.classList.add(
            room.speed === maximum ? "purple-bar" : "teal-bar"
        );

        const percentage = maximum === 0
            ? 0
            : (room.speed / maximum) * 100;

        bar.style.width = percentage + "%";

        track.appendChild(bar);
        row.append(label, track);
        chartBars.appendChild(row);
    });

    speedChart.hidden = false;
});


// ==========================================
// Connection Check
// ==========================================

const connectionButton =
    document.getElementById("checkConnectionBtn");

const connectionResult =
    document.getElementById("connectionResult");

connectionButton.addEventListener("click", async function() {
    connectionButton.disabled = true;

    showResult(
        connectionResult,
        "Checking Your Connection",
        "Please wait while WiFiRx checks connectivity."
    );

    try {
        if (window.location.protocol === "file:") {
            showResult(
                connectionResult,
                "Published Website Required",
                "Open WiFiRx on GitHub Pages to run this check.",
                true
            );
            return;
        }

        if (!navigator.onLine) {
            showResult(
                connectionResult,
                "Browser Reports Offline",
                "Your browser reports that you are offline. " +
                "Check your Wi-Fi or internet connection.",
                true
            );
            return;
        }

        const controller = new AbortController();

        const timeout = setTimeout(
            () => controller.abort(),
            5000
        );

        try {
            const response = await fetch(
                new URL("index.html", document.baseURI),
                {
                    method: "GET",
                    cache: "no-store",
                    signal: controller.signal
                }
            );

            if (!response.ok) {
                throw new Error("Request failed");
            }

            showResult(
                connectionResult,
                "Connection Check Complete",
                "WiFiRx is reachable! Your browser passed " +
                "this basic connectivity check. " +
                "This does not measure Wi-Fi speed."
            );

        } finally {
            clearTimeout(timeout);
        }

    } catch (error) {
        showResult(
            connectionResult,
            "Connection Could Not Be Verified",
            "WiFiRx could not complete the check. " +
            "Your connection may be unavailable, " +
            "or the request may have failed.",
            true
        );

    } finally {
        connectionButton.disabled = false;
    }
});


// ==========================================
// Original WiFiRx Scrolling Animation
// ==========================================

const storySection = document.querySelector(".scroll-story");
const storyPanels = document.querySelectorAll(
    ".scroll-story .story-panel"
);
const progressDots = document.querySelectorAll(
    ".story-progress span"
);

function updateStory() {
    if (!storySection || reducedMotion.matches ||
        storyPanels.length === 0) {
        return;
    }

    const rect = storySection.getBoundingClientRect();
    const distance = storySection.offsetHeight - window.innerHeight;

    if (distance <= 0) return;

    const progress = clamp(-rect.top / distance, 0, 1);
    const stage = progress * (storyPanels.length - 1);
    const activeIndex = Math.round(stage);

    storyPanels.forEach(function(panel, index) {
        const difference = Math.abs(stage - index);
        const visibility = clamp(1 - difference, 0, 1);

        panel.style.opacity = visibility;

        panel.style.transform =
            "translate(-50%, -50%) scale(" +
            (0.85 + visibility * 0.15) + ")";

        panel.style.zIndex =
            index === activeIndex ? "2" : "1";
    });

    progressDots.forEach(function(dot, index) {
        dot.classList.toggle(
            "active",
            index === activeIndex
        );
    });
}

let storyUpdateScheduled = false;

function requestStoryUpdate() {
    if (storyUpdateScheduled) return;

    storyUpdateScheduled = true;

    requestAnimationFrame(function() {
        updateStory();
        storyUpdateScheduled = false;
    });
}

window.addEventListener(
    "scroll",
    requestStoryUpdate,
    { passive: true }
);

window.addEventListener("resize", requestStoryUpdate);
requestStoryUpdate();


// ==========================================
// Highlight Navigation Links
// ==========================================

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        navLinks.forEach(function(item) {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});


// ==========================================
// Full-Screen Homepage and Auto-Hiding Menu
// ==========================================

const wifiNavbar = document.querySelector(".navbar");

function updateNavbarHeight() {
    if (!wifiNavbar) return;

    document.documentElement.style.setProperty(
        "--navbar-height",
        wifiNavbar.offsetHeight + "px"
    );
}

updateNavbarHeight();

window.addEventListener("resize", updateNavbarHeight);

if ("ResizeObserver" in window && wifiNavbar) {
    const navbarResizeObserver = new ResizeObserver(
        updateNavbarHeight
    );

    navbarResizeObserver.observe(wifiNavbar);
}

// Hide navigation when scrolling down;
// show it when scrolling up.

let previousScrollY = Math.max(0, window.scrollY);
let scrollDirectionDistance = 0;

function handleNavbarScroll() {
    if (!wifiNavbar) return;

    const currentScrollY = Math.max(0, window.scrollY);
    const difference = currentScrollY - previousScrollY;

    if (currentScrollY <= 30) {
        wifiNavbar.classList.remove("nav-hidden");
        scrollDirectionDistance = 0;

    } else if (difference > 0) {
        scrollDirectionDistance =
            Math.max(0, scrollDirectionDistance) + difference;

        if (scrollDirectionDistance > 8) {
            wifiNavbar.classList.add("nav-hidden");
        }

    } else if (difference < 0) {
        scrollDirectionDistance =
            Math.min(0, scrollDirectionDistance) + difference;

        if (scrollDirectionDistance < -8) {
            wifiNavbar.classList.remove("nav-hidden");
        }
    }

    previousScrollY = currentScrollY;
}

window.addEventListener(
    "scroll",
    handleNavbarScroll,
    { passive: true }
);

handleNavbarScroll();
