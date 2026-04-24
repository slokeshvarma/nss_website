/* functions */
function academicYearCalculator() {
    // As Date.getMonth() returns index from 0-11 respectively for Jan-Dec. So, index is directly used for logic comparisions
    
    let academicYear;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    if (currentMonth > 2) {
        academicYear = `${currentYear}-` + `${currentYear + 1}`.slice(2, 4);
    } else {
        academicYear = `${currentYear - 1}-` + `${currentYear}`.slice(2, 4);
    }
    return academicYear
};

function toggleTheme() {
    const root = document.documentElement;
    if (root.classList.contains("darkMode")) {
        root.classList.replace("darkMode", "lightMode");
        localStorage.setItem("theme", "lightMode");
    } else {
        root.classList.replace("lightMode", "darkMode");
        localStorage.setItem("theme", "darkMode");
    }
};

function resetTheme() {
    localStorage.removeItem("theme");
    initTheme();
};

function themeChanger() {
    const root = document.documentElement;
    const currentTime = new Date();
    const currentTimeInMinutes = (60 * currentTime.getHours()) + currentTime.getMinutes();
    if (currentTimeInMinutes > 360 && currentTimeInMinutes < 1080) {
        root.classList.remove('darkMode');
        root.classList.add('lightMode');
    } else {
        root.classList.remove('lightMode');
        root.classList.add('darkMode');
    }
};

function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.classList.add(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("darkMode");
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        document.documentElement.classList.add("lightMode");
    } else {
        themeChanger();
    }
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
    const collegeLabelHeight = document.getElementsByClassName("collegeLabel")[0].clientHeight;
    const root = document.documentElement;
    const pageScrolledTill = pageScrollValue/collegeLabelHeight;
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
    const homeGalleryImagesNonMobile = document.getElementById("homeGalleryImagesNonMobile");
    const homeGalleryImagesMobile = document.getElementById("homeGalleryImagesMobile");
        
    if (window.getComputedStyle(homeGalleryImagesNonMobile).display === "none") {
        imageDiv = homeGalleryImagesMobile;
    } else if (window.getComputedStyle(homeGalleryImagesMobile).display === "none") {
        imageDiv = homeGalleryImagesNonMobile;
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
                const imageTag = document.createElement("img");
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
                    const imageTag = document.createElement("img");
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

    if (imageDivClassName === "homeGalleryImagesNonMobile") {
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

function homeEventsMetaInfo() {
    let numberOfCards;
    let screenWidth = window.innerWidth;
    if (screenWidth < 768) {
        numberOfCards = 1;
    } else if (screenWidth < 1024) {
        numberOfCards = 2;
    } else {
        numberOfCards = 3;
    }
    return numberOfCards;
};

function renderHomeEvents(currentCard, data) {
    const homeEventsDiv = document.getElementById("homeEvents");
    while (homeEventsDiv.lastElementChild) {
        homeEventsDiv.removeChild(homeEventsDiv.lastElementChild);
    };
    const homeEventsDescription = document.createElement("div");
    homeEventsDescription.className = "homeEventsDescription";
    homeEventsDescription.innerHTML = `
        <h1>Events</h1>
        <hr class="eventsHr">
        <p>The recent ${data.length} events conducted in the acedamic year ${academicYear}.</p>
    `;
    homeEventsDiv.appendChild(homeEventsDescription);

    const homeEventsPrev = document.createElement("button");
    homeEventsPrev.id = "homeEventsPrev";
    homeEventsPrev.className = "start";
    homeEventsPrev.innerHTML += `<i class="fa-solid fa-angles-left"></i>`;
    homeEventsDiv.appendChild(homeEventsPrev);

    const homeEventsPrevIcon = document.getElementById("homeEventsPrev").children[0];
    homeEventsPrevIcon.addEventListener("click", ()=> {
        homeEventCardSwipe(false, numberOfEventCards);
    });

    const homeEventCards = document.createElement("div");
    homeEventCards.className = "homeEventCards";
    let count = 1;
    data.forEach(row => {
        renderHomeEventCards(currentCard, row, count, homeEventCards);
        count++;
    });

    homeEventsDiv.appendChild(homeEventCards);    
    const homeEventsNext = document.createElement("button");
    homeEventsNext.id = "homeEventsNext";
    homeEventsNext.className = "start";
    homeEventsNext.innerHTML += `<i class="fa-solid fa-angles-right"></i>`;
    homeEventsDiv.appendChild(homeEventsNext);

    const homeEventsNextIcon = document.getElementById("homeEventsNext").children[0];
    homeEventsNextIcon.addEventListener("click", () => {
        homeEventCardSwipe(true, numberOfEventCards);
    });
};

function adjustDisplayAndPlacement(currentCard, numberOfCards) {
    const homeEvents = document.getElementById("homeEvents");
    const prevButton = homeEvents.children[1];
    const eventCards = homeEvents.children[2];
    const nextButton = homeEvents.children[3];

    let eventDescriptionHeight;
    let count = 1;
    Array.from(eventCards.children).forEach(eventCard => {
        eventCard.style.display = "none";
            eventCard.classList.remove('visible');
        if (count >= currentCard && count < currentCard + numberOfCards) {
            eventCard.style.display = "flex";
            eventCard.classList.add('visible');
        }
        const eventDetails = eventCard.children[1];
        if (window.getComputedStyle(eventCard).display === "flex") {
            eventDescriptionHeight = eventDetails.clientHeight;
        };
        eventDetails.style.marginTop = `-${eventDescriptionHeight}px`;

        count++;
    });
    if (numberOfCards === 1) {
        prevButton.style.paddingBottom = `${0.65 * eventDescriptionHeight}px`;
        nextButton.style.paddingBottom = `${0.65 * eventDescriptionHeight}px`;
    } else {
        prevButton.style.paddingBottom = `${0.55 * eventDescriptionHeight}px`;
        nextButton.style.paddingBottom = `${0.55 * eventDescriptionHeight}px`;
    }
};

function renderHomeEventCards(currentCard, dictObj, count, parentDiv) {
    const homeEventCard = document.createElement("div");
    homeEventCard.id = dictObj.eventName;
    homeEventCard.className = `homeEventCard number-${count}`;

    const cardImageDiv = document.createElement("div");
    cardImageDiv.className = "homeEventCardImage";
    const cardImg = document.createElement("img");
    cardImg.src = dictObj.eventPosterLink;
    cardImg.alt = dictObj.eventName;
    cardImageDiv.appendChild(cardImg);

    const homeEventCardDetails = document.createElement("div");
    homeEventCardDetails.className = "homeEventCardDetails";
    homeEventCardDetails.innerHTML = `
            <div class="homeEventCardMetaData">
                <p>Name: ${dictObj.eventName}</p>
                <p>Dt: ${dictObj.eventDate}</p>
                <p>Organised by ${dictObj.eventUnit}</p>
            </div>
            <div class="homeEventCardData">
                <p style="white-space: pre-wrap; ">${dictObj.eventDescription}</p>
                <a class="eventDetailsLink" href="${dictObj.eventDetailsLink}">Know More</a>
            </div>
    `;
    homeEventCard.appendChild(cardImageDiv);
    homeEventCard.appendChild(homeEventCardDetails);
    parentDiv.appendChild(homeEventCard);
};

function homeEventCardSwipe(moveRight, numberOfCards) {    
    const eventCardsLength = document.getElementsByClassName("homeEventCards")[0].children.length;
    const homeEventsPrev = document.getElementById("homeEventsPrev");
    const homeEventsNext = document.getElementById("homeEventsNext");
    if (!moveRight && currentEventCard === 1) return;
    if (moveRight && currentEventCard >= eventCardsLength + 1 - numberOfCards) return;

    if (moveRight) {
        currentEventCard += 1;
    } else {
        currentEventCard -= 1;
    }

    if (currentEventCard === 1) {
        homeEventsPrev.className = "start";
        homeEventsNext.className = "start";
    } else if (currentEventCard > 1 && currentEventCard < eventCardsLength + 1 - numberOfEventCards) {
        homeEventsPrev.className = "middle";
        homeEventsNext.className = "middle";
    } else {
        homeEventsPrev.className = "end";
        homeEventsNext.className = "end";
    }
    adjustDisplayAndPlacement(currentEventCard, numberOfEventCards);

}
/* execution of functions */
initTheme();
setInterval(() => {
    const savedTheme = localStorage.getItem("theme");
    const hasSystemPref = window.matchMedia("(prefers-color-scheme: dark)").matches ||
                          window.matchMedia("(prefers-color-scheme: light)").matches;
    if (!savedTheme && !hasSystemPref) {
        themeChanger();
    }
}, 30 * 1000);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    if (!localStorage.getItem("theme")) {
        if (e.matches) {
            document.documentElement.classList.replace("lightMode", "darkMode");
        } else {
            document.documentElement.classList.replace("darkMode", "lightMode");
        }
    }
});

let academicYear = academicYearCalculator();

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