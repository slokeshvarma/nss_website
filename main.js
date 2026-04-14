/* functions */
function toggleTheme() {
    document.documentElement.classList.toggle('lightMode');
    document.documentElement.classList.toggle('darkMode');
};

function openLink(link) {
  window.open(link, "_blank");
};

function navMobileMenu() {
    const navHeight = document.getElementsByTagName("nav")[0].clientHeight;
    const navLinks = document.getElementsByClassName("navLinks")[0];
    const navHamburgerLines = document.getElementsByClassName("navHamburgerLine");
    Array.from(navHamburgerLines).forEach(hamburgerLine => {
        hamburgerLine.classList.toggle("clicked");
    }) 
    navLinks.classList.toggle("clicked");
    if (navLinks.classList.contains("clicked")) {
        navLinks.style.top = (navHeight - 2) + "px";
    } else {
        navLinks.style.top = "";    
  }
};

function navSticky() {
    const pageScrollValue = window.scrollY || document.documentElement.scrollTop;
    const collgeLabelHeight = document.getElementsByClassName("collegeLabel")[0].clientHeight;
    const root = document.documentElement;
    const pageScrolledTill = pageScrollValue/collgeLabelHeight;
    let pageScrolledPassed = false;
    if (pageScrolledTill >= 1) {
        pageScrolledPassed = true;
        root.style.setProperty("--pageScrolledTill", Math.round(pageScrolledTill * 100)/100);
        if (pageScrolledTill >= 1.5) {
            root.style.setProperty("--pageScrolledTill", 1.5);
        }
    }
    const header = document.getElementsByTagName("header")[0];
    const landingSection = document.getElementsByClassName("landingSection")[0];
    const aboutUs = document.getElementById("aboutUs");
    header.classList.toggle("sticked", pageScrolledPassed);
    landingSection.classList.toggle("sticked", pageScrolledPassed);
    aboutUs.classList.toggle("sticked", pageScrolledPassed);
};

function loadCSV(path) {
    return new Promise((resolve, reject) => {
        Papa.parse(path, {download: true, header: true, complete: results => resolve(results.data), error: err => reject(err) });
    });
};

function renderHomeGallery(data) {
    if (initialHomeGalleryRender) {
        let count = 1;
        const homeGalleryImages16_9 = document.getElementById("homeGalleryImages16-9");
        const homeGalleryImages4_3 = document.getElementById("homeGalleryImages4-3");

        data.forEach(row => {
            image_16_9 = document.createElement("img");
            image_16_9.className = `${count} homeGalleryImage16-9`;
            image_16_9.src = `${row.nonMobileImageLink}`;
            homeGalleryImages16_9.appendChild(image_16_9);

            image_4_3 = document.createElement("img");
            image_4_3.className = `${count} homeGalleryImage4_3`;
            image_4_3.src = `${row.mobileImageLink}`;
            homeGalleryImages4_3.appendChild(image_4_3);

            count++;
        })
        initialHomeGalleryRender = false;
    }
};

function currentImageWraper(div, currentImage) {
    const totalImagesCount = div.children.length;
    if (currentImage < 1){
        currentImageNumber = totalImagesCount;
    } else if (currentImage > totalImagesCount){
        currentImageNumber = 1;
    } else {
        currentImageNumber = currentImage;
    }
};

function currentImageDiv() {
    let imageDiv;
    const homeGalleryImages16_9 = document.getElementById("homeGalleryImages16-9");
    const homeGalleryImages4_3 = document.getElementById("homeGalleryImages4-3");
    if (homeGalleryImages16_9.style.display === "none") {
        imageDiv = homeGalleryImages4_3;
    } else if (homeGalleryImages4_3.style.display === "none") {
        imageDiv = homeGalleryImages16_9;
    }
    return imageDiv;
};

function homeImageGallery(currentImage) {
    currentImageWraper(currentImageDiv(), currentImage);
};

function renderHomeEvents(data) {
    if (true) {
        console.log(data);

    }
};

/* execution of functions */
/* link to the images in header */
const GVPLogo = document.getElementById("collegeLabelGVPLogo");
const NSSLogo = document.getElementById("collegeLabelNSSLogo");

GVPLogo.addEventListener("click", () => openLink("https://www.gvpce.ac.in/"));
NSSLogo.addEventListener("click", () => openLink("https://nss.gov.in/"));

/* nav bar's total function integration */
const nav = document.getElementsByTagName("nav")[0];
const hamburgerMenu = document.getElementById("navHamburgerClickable");

window.addEventListener('scroll', navSticky, { passive: true });
window.addEventListener('touchmove', navSticky);
hamburgerMenu.addEventListener('click', navMobileMenu);

document.documentElement.style.setProperty("--navHeight", nav.offsetHeight + "px");

/* csv data loading */
let homeGalleryData = [];
let homeEventsData = [];
let initialHomeGalleryRender = true;
var currentImageNumber = 1;

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
                eventPosterLink: row.eventPosterLink
            })
        }
    });
    renderHomeGallery(homeGalleryData);
    renderHomeEvents(homeEventsData);
});