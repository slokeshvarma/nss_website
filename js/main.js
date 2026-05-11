/* functions */
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

let autoSlideInterval = null;

function startAutoSlide() {
    if (autoSlideInterval) return;
    autoSlideInterval = setInterval(() => {
        currentImageNumber = currentImageWraper(homeGalleryData.length, currentImageNumber + 1);
        homeImageGallery(currentImageNumber, 'next');
    }, 3000);
};

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
};

function initGalleryObserver() {
    const gallerySection = document.getElementById("homeGallery");
    if (!gallerySection) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const visibleHeight = entry.intersectionRect.height;
                const viewportHeight = window.innerHeight;
                if (visibleHeight >= viewportHeight * 0.8) {
                    startAutoSlide();
                } else {
                    stopAutoSlide();
                }
            });
        },
        { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    );

    observer.observe(gallerySection);
};

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
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

    let count = 1;
    Array.from(eventCards.children).forEach(eventCard => {
        const visible = count >= currentCard && count < currentCard + numberOfCards;
        eventCard.style.display = visible ? "flex" : "none";
        eventCard.classList.toggle('visible', visible);
        count++;
    });

    let eventDescriptionHeight = 0;
    Array.from(eventCards.children).forEach(eventCard => {
        if (window.getComputedStyle(eventCard).display === "flex") {
            eventDescriptionHeight = eventCard.children[1].clientHeight;
        }
    });

    Array.from(eventCards.children).forEach(eventCard => {
        eventCard.children[1].style.marginTop = `-${eventDescriptionHeight}px`;
    });

    const padding = `${(numberOfCards === 1 ? 0.5 : 0.55) * eventDescriptionHeight}px`;
    prevButton.style.paddingBottom = padding;
    nextButton.style.paddingBottom = padding;
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
                <p style="white-space: pre-wrap; ">&#9; ${dictObj.eventDescription}</p>
                <a class="eventDetailsLink" href="${dictObj.eventDetailsLink}">Know More</a>
            </div>
    `;
    homeEventCard.appendChild(cardImageDiv);
    homeEventCard.appendChild(homeEventCardDetails);
    parentDiv.appendChild(homeEventCard);
};

function homeEventCardSwipe(moveRight, numberOfCards) { 
    console.log("outside Ran");
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

function academicYearCalculator(date) {
    // As Date.getMonth() returns index from 0-11 respectively for Jan-Dec. So, index is directly used for logic comparisions
    let academicYear;
    let currentDate;
    if (!date) {
        currentDate = new Date();
    } else {
        const [day, month, year] = date.split("/");
        currentDate = new Date(`${year}-${month}-${day}`);
    }
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    if (currentMonth > 2) {
        academicYear = `${currentYear}-` + `${currentYear + 1}`.slice(2, 4);
    } else {
        academicYear = `${currentYear - 1}-` + `${currentYear}`.slice(2, 4);
    }
    return String(academicYear);
};

function eventIdGenerator(eventDate, eventName, eventUnit) {
    const dates = {
         1: "A",  2: "B",  3: "C",  4: "4",  5: "D",  6: "E",  7: "F",  8: "G",  9: "H", 10: "1",
        11: "I", 12: "J", 13: "K", 14: "L", 15: "5", 16: "M", 17: "N", 18: "O", 19: "P", 20: "2",
        21: "Q", 22: "R", 23: "S", 24: "T", 25: "U", 26: "V", 27: "W", 28: "X", 29: "Y", 30: "3",
        31: "Z"
    }
    const months = {
        0: "J", 1: "F", 2: "M", 3: "A", 4: "Y", 5: "U", 6: "L", 7: "G", 8: "S", 9: "O", 10: "N", 11: "D"
    }

    const [day, month, year] = eventDate.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const yearSuffix = `${date.getFullYear()}`.slice(-2);

    eventUnit = String(eventUnit);
    if (eventUnit.length > 2) {
        eventUnit = "B";
    }
    const EventIdUniqueChar = Math.random().toString(36).substring(2, 3).toUpperCase();
    const eventID = `${dates[date.getDate()]}${months[date.getMonth()]}${yearSuffix}${eventName.slice(0, 1)}${eventUnit}${EventIdUniqueChar}`;

    return eventID;
}


/* execution of functions */
setInterval(() => {
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

/* nav bar's total function integration */
let clickedOnMain = false;
let hamburgerMenuOpened = false;
let main;
const nav = document.getElementsByTagName("nav")[0];
const hamburgerMenu = document.getElementById("navHamburgerClickable");

function mainFinder() {
    const mains = document.getElementsByTagName("main");
    Array.from(mains).forEach(visibleMain => {
        if (window.getComputedStyle(visibleMain).display === "flex") {
            main = visibleMain;
            main.addEventListener("click", () => {
                if (hamburgerMenuOpened) {
                hamburgerMenuOpened = false;
                navMobileMenu();
                }
            });
        }
    })
}
document.addEventListener("DOMContentLoaded", ()=> {
    mainFinder();
    initGalleryObserver();
})


hamburgerMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburgerMenuOpened = !hamburgerMenuOpened;
    navMobileMenu();
});

document.documentElement.style.setProperty("--navHeight", nav.offsetHeight + "px");