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

/* link to the images in header */
let DOMContentLoaded = false;
const GVPLogo = document.getElementById("collegeLabelGVPLogo");
const NSSLogo = document.getElementById("collegeLabelNSSLogo");

GVPLogo.addEventListener("click", () => openLink("https://www.gvpce.ac.in/"));
NSSLogo.addEventListener("click", () => openLink("https://nss.gov.in/"));

window.addEventListener('scroll', navSticky, { passive: true });
window.addEventListener('touchmove', navSticky);
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
var isElementInView;

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
});
homeGalleryImages.addEventListener("touchend", () => {
    mouseIsOverDiv = false;
});
setInterval(() => {
    const pageScrollValue = window.scrollY || document.documentElement.scrollTop;
    const homeGalleryImagesOffsetTop = nav.offsetHeight + landingSection.offsetHeight + aboutUs.offsetHeight;
    isElementInView = isElementInViewport(homeGalleryImages);
    if (!mouseIsOverDiv && !isElementInView && (pageScrollValue/homeGalleryImagesOffsetTop) > 0.8) {
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
document.getElementById("footerYear").textContent = new Date().getFullYear();