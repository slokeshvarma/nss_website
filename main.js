/* functions */
function academicYearCalculator() {
    // As Date.getMonth() returns index from 0-11 respectively for Jan-Dec. So, index is directly used for logic comparisions
    
    let academicYear;
    currentDate = new Date();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    if (currentMonth > 2) {
        academicYear = `${currentYear}-` + `${currentYear + 1}`.slice(2, 4);
    } else {
        academicYear = `${currentYear - 1}-` + `${currentYear}`.slice(2, 4);
    }
    return academicYear
};

function toggleTheme() {
    if (!manualChangeOfTheme) {
        manualChangeOfTheme = true;
    } else {
        manualChangeOfTheme = false;
    }
    document.documentElement.classList.toggle('lightMode');
    document.documentElement.classList.toggle('darkMode');
};

function themeChanger() {
    currentTime = new Date();
    currentTimeInMinutes = (60*currentTime.getHours()) + currentTime.getMinutes();
    if (currentTimeInMinutes > 60*6 && currentTimeInMinutes < 60*18) {
        if (document.documentElement.classList.contains("darkMode")) {
            document.documentElement.classList.remove('darkMode');
        }
        document.documentElement.classList.add('LightMode');
    } else {
        if (document.documentElement.classList.contains("lightMode")) {
            document.documentElement.classList.remove('lightMode');
        }
        document.documentElement.classList.add('darkMode');
    };
};

function openLink(link) {
  window.open(link, "_blank");
};

function navMobileMenu() {
    const navHeight = document.querySelector("nav").clientHeight;
    const navLinks = document.querySelector(".navLinks");
    const navHamburgerLines = document.querySelectorAll(".navHamburgerLine");

    navLinks.classList.toggle("clicked", hamburgerMenuOpened);

    navHamburgerLines.forEach(line => {
        line.classList.toggle("clicked", hamburgerMenuOpened);
    });

    navLinks.style.top = hamburgerMenuOpened ? `${navHeight - 2}px` : "";
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

function preloadImages(imageLinks) {
    const promises = imageLinks.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(src);
            img.src = src;
        });
    });

    return Promise.all(promises);
};

function currentImageDiv() {
    let imageDiv;
    const homeGalleryImages2_1 = document.getElementById("homeGalleryImages2-1");
    const homeGalleryImages4_3 = document.getElementById("homeGalleryImages4-3");
        
    if (window.getComputedStyle(homeGalleryImages2_1).display === "none") {
        imageDiv = homeGalleryImages4_3;
    } else if (window.getComputedStyle(homeGalleryImages4_3).display === "none") {
        imageDiv = homeGalleryImages2_1;
    }
    return imageDiv;
};

function currentImageWraper(totalImagesCount, currentImage) {
    let tempCurrentImageNumber;
    if (currentImage < 1){
        tempCurrentImageNumber = totalImagesCount;
    } else if (currentImage > totalImagesCount){
        tempCurrentImageNumber = 1;
    } else {
        tempCurrentImageNumber = currentImage;
    }
    return tempCurrentImageNumber;
};

function renderImagesinHomeGallery(currentImage, className, imageDiv, imageLinks) {

    while (imageDiv.lastElementChild) {
        imageDiv.removeChild(imageDiv.lastElementChild);
    };
    let count = 1;
    let imageLink_1, imageLink_2, imageLink_lastButOne, imageLink_last;
    let directionClassNameCount = ["left", "center", "right"];
    const totalImagesCount = imageLinks.length;

    imageLinks.forEach(imageLink => {
        let classNameCount = count - currentImage + 1;

        if (currentImage > 1 && currentImage < totalImagesCount) {
            if (count >= currentImage - 1 && count <= currentImage + 1) {
                imageTag = document.createElement("img");
                imageTag.className = `${directionClassNameCount[classNameCount]} ${className}`;
                imageTag.src = `${imageLink}`;
                imageTag.alt = `Home Gallery Image–${classNameCount}`;
                imageDiv.appendChild(imageTag);
            }
        } else {
            if (count === 1) {imageLink_1 = imageLink }
            else if(count === 2) {imageLink_2 = imageLink}
            else if(count === totalImagesCount - 1) {imageLink_lastButOne = imageLink}
            else if(count === totalImagesCount) {imageLink_last = imageLink};

            if(typeof imageLink_1 !== 'undefined' && typeof imageLink_2 !== 'undefined' && typeof imageLink_lastButOne !== 'undefined' && typeof imageLink_last !== 'undefined') {
                let specialImageLinks = [];
                let classNameCount = 0;
                let directionClassNameCount = ["left", "center", "right"];

                if (currentImage === 1) {
                    specialImageLinks.push(imageLink_last, imageLink_1, imageLink_2);
                } else {
                    specialImageLinks.push(imageLink_lastButOne, imageLink_last, imageLink_1);
                }

                specialImageLinks.forEach(specialImageLink => {
                    imageTag = document.createElement("img");
                    imageTag.className = `${directionClassNameCount[classNameCount]} ${className}`;
                    imageTag.src = `${specialImageLink}`;
                    imageDiv.appendChild(imageTag);
                    classNameCount++;
                });
            };
        };
        count++;
    });
};

function renderHomeGallery(data, currentImage) {
    const imageDiv = currentImageDiv();
    const imageDivClassName = imageDiv.className;
    let imageLinks = [];

    if (imageDivClassName === "homeGalleryImages2-1") {
        data.forEach(row => {
            imageLinks.push(row.nonMobileImageLink);
        });
    } else {
        data.forEach(row => {
            imageLinks.push(row.mobileImageLink);
        });
    }

    preloadImages(imageLinks).then(() => {
        renderImagesinHomeGallery(currentImage, imageDivClassName, imageDiv, imageLinks);
    });
};

function homeImageGallery(currentImage, direction) {
    const imageDiv = currentImageDiv();
    const imgs = imageDiv.querySelectorAll('img');

    imgs.forEach(img => img.classList.add(
        direction === 'next' ? 'sliding-left' : 'sliding-right'
    ));

    setTimeout(() => {
        currentImageNumber = currentImageWraper(homeGalleryData.length, currentImage);
        renderHomeGallery(homeGalleryData, currentImageNumber);
    }, 400);
};

function renderHomeEvents(data) {
    const homeEventsDiv = document.getElementById("homeEvents");

    const homeEventsDescription = document.createElement("div");
    homeEventsDescription.className = "homeEventsDescription";
    const homeEventsDescriptionH1 = document.createElement("h1");
    homeEventsDescriptionH1.innerHTML = "Events";
    const eventsHr = document.createElement("hr");
    eventsHr.className = "eventsHr";
    const homeEventsDescriptionP = document.createElement("p");
    homeEventsDescriptionP.innerHTML = `The recent ${data.length} events conducted in the acedamic year ${academicYear}.`;
    homeEventsDescription.appendChild(homeEventsDescriptionH1);
    homeEventsDescription.appendChild(eventsHr);
    homeEventsDescription.appendChild(homeEventsDescriptionP);
    homeEventsDiv.appendChild(homeEventsDescription);
    

    const homeEventsPrev = document.createElement("button");
    homeEventsPrev.id = "homeEventsPrev";
    homeEventsPrev.className = "start";
    const homeEventsPrevIcon = document.createElement("i");
    homeEventsPrevIcon.className = "fa-solid fa-angles-left";
    homeEventsPrev.appendChild(homeEventsPrevIcon);
    homeEventsDiv.appendChild(homeEventsPrev);
    
    const homeEvents = document.createElement("div");
    homeEvents.className = "homeEventCards";
    let count = 1;
    data.forEach(row => {
        renderHomeEventsCards(row, count, homeEvents);
        count++;
    })
    homeEventsDiv.appendChild(homeEvents);

    const homeEventsNext = document.createElement("button");
    homeEventsNext.id = "homeEventsNext";
    homeEventsNext.className = "start";
    const homeEventsNextIcon = document.createElement("i");
    homeEventsNextIcon.className = "fa-solid fa-angles-right";
    homeEventsNext.appendChild(homeEventsNextIcon);
    homeEventsDiv.appendChild(homeEventsNext);

    Array.from(homeEvents.children).forEach(homeEvent => {
        const homeEventCardDetails = homeEvent.children[1];
        const height = homeEventCardDetails.clientHeight;
        homeEventCardDetails.style.marginTop = `-${height}px`;
        if (height != 0) {
            homeEventsPrev.style.paddingBottom = `${height + 7}px`;
            homeEventsNext.style.paddingBottom = `${height + 7}px`;
        }
    });
};

function renderHomeEventsCards(dictObj, count, parentDiv) {
    const homeEventDiv = document.createElement("div");
    homeEventDiv.className = `homeEventCard number-${count}`;
    homeEventDiv.id = `${dictObj.eventName}`;
    const homeEventPoster = document.createElement("img");
    homeEventPoster.className = "homeEventPoster";
    homeEventPoster.src = dictObj.eventPosterLink;
    homeEventPoster.alt = dictObj.eventName;

    const homeEventCardImage = document.createElement("div");
    homeEventCardImage.className = "homeEventCardImage";
    const homeEventCardDetails = document.createElement("div");
    homeEventCardDetails.className = "homeEventCardDetails";
    const homeEventCardMetaData = document.createElement("div");
    homeEventCardMetaData.className = "homeEventCardMetaData";
    const homeEventCardData = document.createElement("div");
    homeEventCardData.className = "homeEventCardData";
    
    const eventNameP = document.createElement("p");
    eventNameP.innerHTML = `Name: ${dictObj.eventName}`;
    const eventDateP = document.createElement("p");
    eventDateP.innerHTML = `Dt: ${dictObj.eventDate}`;
    const eventUnitP = document.createElement("p");
    eventUnitP.innerHTML = `Organized by ${dictObj.eventUnit}`;
    const eventDescriptionP = document.createElement("p");
    eventDescriptionP.innerHTML = `&#9; ${dictObj.eventDescription}`;
    eventDescriptionP.style.whiteSpace = "pre";
    eventDescriptionP.style.textWrap = "wrap";
    const eventDetailsLink = document.createElement("a");
    eventDetailsLink.className = "eventDetailsLink";
    eventDetailsLink.href = dictObj.eventDetailsLink;
    eventDetailsLink.innerHTML = "Know More";


    homeEventCardMetaData.appendChild(eventNameP);
    homeEventCardMetaData.appendChild(eventDateP);
    homeEventCardMetaData.appendChild(eventUnitP);
    homeEventCardData.appendChild(eventDescriptionP);
    homeEventCardData.appendChild(eventDetailsLink);
    homeEventCardImage.appendChild(homeEventPoster);
    homeEventCardDetails.appendChild(homeEventCardMetaData);
    homeEventCardDetails.appendChild(homeEventCardData);
    homeEventDiv.appendChild(homeEventCardImage);
    homeEventDiv.appendChild(homeEventCardDetails);
    parentDiv.appendChild(homeEventDiv);
};

/* csv data loading*/
let homeGalleryData = [];
let homeEventsData = [];
let initialHomeGalleryRender = true;

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
        }
    });
    renderHomeGallery(homeGalleryData, currentImageNumber);
    renderHomeEvents(homeEventsData);
});


/* execution of functions */

let academicYear = academicYearCalculator();
console.log(academicYear);
let manualChangeOfTheme = false;
themeChanger();
setInterval(() => {
    if (!manualChangeOfTheme) {
        themeChanger();
    }
}, 30*1000);

/* link to the images in header */
let DOMContentLoaded = false;
const GVPLogo = document.getElementById("collegeLabelGVPLogo");
const NSSLogo = document.getElementById("collegeLabelNSSLogo");

GVPLogo.addEventListener("click", () => openLink("https://www.gvpce.ac.in/"));
NSSLogo.addEventListener("click", () => openLink("https://nss.gov.in/"));

/* nav bar's total function integration */
let clickedOnMain = false;
let hamburgerMenuOpened = false;
const main = document.getElementsByTagName("main")[0];
const nav = document.getElementsByTagName("nav")[0];
const hamburgerMenu = document.getElementById("navHamburgerClickable");

main.addEventListener("click", () => {
    if (hamburgerMenuOpened) {
        hamburgerMenuOpened = false;
        navMobileMenu();
    }
});
window.addEventListener('scroll', navSticky, { passive: true });
window.addEventListener('touchmove', navSticky);
hamburgerMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburgerMenuOpened = !hamburgerMenuOpened;
    navMobileMenu();
});

document.documentElement.style.setProperty("--navHeight", nav.offsetHeight + "px");

let landingSectionImageLink = "images/homePage/landingSectionImage.jpg";
imageTag = document.createElement("img");
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
