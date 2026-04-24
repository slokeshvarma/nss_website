/* csv data loading*/
let homeGalleryData = [];
let homeEventsData = [];
let homeEventsImageLinks = [];

let initialHomeGalleryRender = true;
let renderTime;

loadCSV("dataTables/homePageData.csv").then(data => {    
    data.forEach(row => {
        if (row.section === "homeGallery") {
            homeGalleryData.push({
                mobileImageLink: row.eventMobileImageLink,
                nonMobileImageLink: row.eventNonMobileImageLink,
            })
        } else if (row.section === "homeEvents") {
            homeEventsData.push({
                eventName: row.eventName,
                eventDate: row.eventDate,
                eventUnit: row.eventUnit,
                eventDescription: row.eventDescription,
                eventPosterLink: row.eventPosterLink,
                eventDetailsLink: row.eventDetailsLink
            })
            homeEventsImageLinks.push(row.eventPosterLink);
        }
    });
    renderHomeGallery(homeGalleryData, currentImageNumber);
    preloadImages(homeEventsImageLinks).then(() => {
        renderHomeEvents(currentEventCard, homeEventsData);
        adjustDisplayAndPlacement(currentEventCard, numberOfEventCards);
    });
});

/* landing section integration */
let landingSectionImageLink = "images/homePage/landingSectionImage.jpg";
const imageTag = document.createElement("img");
imageTag.src = `${landingSectionImageLink}`;
imageTag.alt = "Image"
document.getElementById("landingSectionImage").appendChild(imageTag);

/* homeGallery function integration */
var currentImageNumber = 1;
let mouseIsOverDiv = false;
let homeGalleryInteraction = false;

const landingSection = document.getElementsByClassName("landingSection")[0];
const aboutUs = document.getElementsByClassName("aboutUs")[0];
const homeGalleryPrevButton = document.getElementById("homeGalleryPrev");
const homeGalleryNextButton = document.getElementById("homeGalleryNext");
const homeGalleryImages = document.getElementsByClassName("homeGalleryImages")[0];

homeGalleryPrevButton.children[0].addEventListener('click', () => {
    homeImageGallery(currentImageNumber - 1, 'prev');
    homeGalleryInteraction = true;
});
homeGalleryNextButton.children[0].addEventListener('click', () => {
    homeImageGallery(currentImageNumber + 1, 'next');
    homeGalleryInteraction = true;
});

[homeGalleryPrevButton, homeGalleryNextButton].forEach(button => {
    button.addEventListener("mouseover", () => {
    mouseIsOverDiv = true;
    });
    button.addEventListener("mouseout", () => {
    mouseIsOverDiv = false;
    });
});
homeGalleryImages.addEventListener("touchstart", () => {
    mouseIsOverDiv = false;
})
homeGalleryImages.addEventListener("touchend", () => {
    mouseIsOverDiv = false;
})
setInterval(() => {
    const pageScrollValue = window.scrollY || document.documentElement.scrollTop;
    const homeGalleryImagesOffsetTop = nav.offsetHeight + landingSection.offsetHeight + aboutUs.offsetHeight;
    if (!mouseIsOverDiv && (pageScrollValue/homeGalleryImagesOffsetTop) > 0.8) {
        homeImageGallery(currentImageNumber + 1, 'next');
    }}, 4 * 1000);

/* homeEvents function Integration */
var currentEventCard = 1;
var numberOfEventCards = homeEventsMetaInfo();
let mouseOverSection = null;

window.addEventListener("resize", ()=> {
    numberOfEventCards = homeEventsMetaInfo();
    renderHomeEvents(currentEventCard, homeEventsData);
    adjustDisplayAndPlacement(currentEventCard, numberOfEventCards);
});

document.getElementsByClassName("homeGalleryImages")[0].addEventListener("mouseenter", () => {
    mouseOverSection = "gallery";
});
document.getElementsByClassName("homeGalleryImages")[0].addEventListener("mouseleave", () => {
    mouseOverSection = null;
});
document.getElementById("homeEvents").addEventListener("mouseenter", () => {
    mouseOverSection = "events";
});
document.getElementById("homeEvents").addEventListener("mouseleave", () => {
    mouseOverSection = null;
});
// Arrow keys
window.addEventListener("keydown", (e) => {
    const homeEvents = document.getElementById("homeEvents");
    if (!homeEvents) return;

    // Only fire when the events section is roughly in the viewport
    const rect = homeEvents.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === "ArrowRight") {
        e.preventDefault();
        homeEventCardSwipe(true, numberOfEventCards);
    } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        homeEventCardSwipe(false, numberOfEventCards);
    }
});

// Horizontal scroll (mouse wheel + trackpad)
let scrollDebounceTimer = null;
let scrollAccumulator = 0;
const SCROLL_THRESHOLD = 50; // px accumulated before a swipe fires

document.addEventListener("wheel", (e) => {
    const homeEvents = document.getElementById("homeEvents");
    if (!homeEvents) return;

    // Only activate when pointer is over the events section
    if (!homeEvents.contains(e.target)) return;

    // Prefer horizontal delta; fall back to vertical (for mice without horizontal scroll)
    const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

    e.preventDefault(); // stop the page from scrolling while swiping cards

    scrollAccumulator += delta;

    // Debounce: wait for scroll to pause before resetting accumulator
    clearTimeout(scrollDebounceTimer);
    scrollDebounceTimer = setTimeout(() => {
        scrollAccumulator = 0;
    }, 150);

    if (Math.abs(scrollAccumulator) >= SCROLL_THRESHOLD) {
        const moveRight = scrollAccumulator > 0;
        scrollAccumulator = 0; // reset after firing
        homeEventCardSwipe(moveRight, numberOfEventCards);
    }
}, { passive: false });

// Touch swipe (mobile horizontal drag)
let touchStartX = null;
const SWIPE_THRESHOLD = 40; // px of horizontal drag to count as a swipe

document.addEventListener("touchstart", (e) => {
    const homeEvents = document.getElementById("homeEvents");
    if (homeEvents && homeEvents.contains(e.target)) {
        touchStartX = e.touches[0].clientX;
    }
}, { passive: true });

document.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const homeEvents = document.getElementById("homeEvents");
    if (!homeEvents || !homeEvents.contains(e.target)) {
        touchStartX = null;
        return;
    }

    const deltaX = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
        homeEventCardSwipe(deltaX > 0, numberOfEventCards); // positive = swiped left = go right
    }
    touchStartX = null;
}, { passive: true });
document.getElementById("footerYear").textContent = new Date().getFullYear();