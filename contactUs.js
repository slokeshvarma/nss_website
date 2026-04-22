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
    const root = document.documentElement;
    if (root.classList.contains("darkMode")) {
        root.classList.replace("darkMode", "lightMode");
        localStorage.setItem("theme", "lightMode");
    } else {
        root.classList.replace("lightMode", "darkMode");
        localStorage.setItem("theme", "darkMode");
    }
};

function themeChanger() {
    const root = document.documentElement;
    currentTime = new Date();
    currentTimeInMinutes = (60*currentTime.getHours()) + currentTime.getMinutes();
    if (currentTimeInMinutes > 60*6 && currentTimeInMinutes < 60*18) {
        if (root.classList.contains("darkMode")) {
            root.classList.remove('darkMode');
        }
        root.classList.add('lightMode');
    } else {
        if (root.classList.contains("lightMode")) {
            root.classList.remove('lightMode');
        }
        root.classList.add('darkMode');
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
    let numberOfEventCards;
    let screenWidth = window.innerWidth;
    if (screenWidth < 768) {
        numberOfEventCards = 1;
    } else if (screenWidth < 1024) {
        numberOfEventCards = 2;
    } else {
        numberOfEventCards = 3;
    }
    return numberOfEventCards;
};

function renderHomeEvents(currentCard, data) {
    const homeEventsDiv = document.getElementById("homeEvents");
    while (homeEventsDiv.lastElementChild) {
        homeEventsDiv.removeChild(homeEventsDiv.lastElementChild);
    };

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
    
    
    const homeEvents = document.createElement("div");
    homeEvents.className = "homeEventCards";

    const homeEventsPrev = document.createElement("button");
    homeEventsPrev.id = "homeEventsPrev";
    homeEventsPrev.className = "start";
    const homeEventsPrevIcon = document.createElement("i");
    homeEventsPrevIcon.className = "fa-solid fa-angles-left";
    homeEventsPrevIcon.addEventListener("click", () => {
        homeEventCardSwipe(false, numberOfEventCards);
        const homeEventsDiv = document.getElementById("homeEventCards")[0];
        while (homeEventsDiv.lastElementChild) {
            homeEventsDiv.removeChild(homeEventsDiv.lastElementChild);
        };

        let count = 1;
        homeEventsData.forEach(row => {
            renderHomeEventsCards(currentCard, row, count, homeEvents);
        count++;
        });
    });
    homeEventsPrev.appendChild(homeEventsPrevIcon);
    homeEventsDiv.appendChild(homeEventsPrev);
    
    let count = 1;
    data.forEach(row => {
        renderHomeEventsCards(currentCard, row, count, homeEvents);
        count++;
    })
    homeEventsDiv.appendChild(homeEvents);

    const homeEventsNext = document.createElement("button");
    homeEventsNext.id = "homeEventsNext";
    homeEventsNext.className = "start";
    const homeEventsNextIcon = document.createElement("i");
    homeEventsNextIcon.className = "fa-solid fa-angles-right";
    homeEventsNextIcon.addEventListener("click", () => {
        homeEventCardSwipe(true, numberOfEventCards);
        setTimeout(()=> {  
            let count = 1;
            homeEventsData.forEach(row => {
                renderHomeEventsCards(currentCard, row, count, homeEvents);
            count++;
            });
        }, 200);
    });
    homeEventsNext.appendChild(homeEventsNextIcon);
    homeEventsDiv.appendChild(homeEventsNext);

    let marginTop = homeEvents.children[0].children[1].clientHeight;
    Array.from(homeEvents.children).forEach(homeEvent => {
        homeEvent.children[1].style.marginTop = ""; 
        homeEvent.children[1].style.marginTop = `-${marginTop}px`;
    });
    homeEventsPrev.style.paddingBottom = `${0.5 * marginTop}px`;
    homeEventsNext.style.paddingBottom = `${0.5 * marginTop}px`;
};

function renderHomeEventsCards(currentCard, dictObj, count, parentDiv) {
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

    homeEventDiv.style.display = "none";
    console.log("inside Loop");
    console.log("count:", count);
    console.log("currentCard:", currentCard);
    console.log("Condition", count >= currentCard && count < currentCard + numberOfEventCards);
    if (count >= currentCard && count < currentCard + numberOfEventCards) {
        homeEventDiv.style.display = "flex";
    };

};
function renderHomeEventss(currentCard, data) {
    const homeEventsDiv = document.getElementById("homeEvents");
    while (homeEventsDiv.lastElementChild) {
        homeEventsDiv.removeChild(homeEventsDiv.lastElementChild);
    };

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
    
    
    const homeEvents = document.createElement("div");
    homeEvents.className = "homeEventCards";

    const homeEventsPrev = document.createElement("button");
    homeEventsPrev.id = "homeEventsPrev";
    homeEventsPrev.className = "start";
    const homeEventsPrevIcon = document.createElement("i");
    homeEventsPrevIcon.className = "fa-solid fa-angles-left";
    homeEventsPrevIcon.addEventListener("click", () => {
        homeEventCardSwipes(false, numberOfEventCards);
        const homeEventsDiv = document.getElementById("homeEventCards")[0];
        while (homeEventsDiv.lastElementChild) {
            homeEventsDiv.removeChild(homeEventsDiv.lastElementChild);
        };

        let count = 1;
        homeEventsData.forEach(row => {
            renderHomeEventsCardss(currentCard, row, count, homeEvents);
        count++;
        });
    });
    homeEventsPrev.appendChild(homeEventsPrevIcon);
    homeEventsDiv.appendChild(homeEventsPrev);
    
    let count = 1;
    data.forEach(row => {
        renderHomeEventsCards(currentCard, row, count, homeEvents);
        count++;
    })
    homeEventsDiv.appendChild(homeEvents);

    const homeEventsNext = document.createElement("button");
    homeEventsNext.id = "homeEventsNext";
    homeEventsNext.className = "start";
    const homeEventsNextIcon = document.createElement("i");
    homeEventsNextIcon.className = "fa-solid fa-angles-right";
    homeEventsNextIcon.addEventListener("click", () => {
        homeEventCardSwipse(true, numberOfEventCards);
        setTimeout(()=> {  
            let count = 1;
            homeEventsData.forEach(row => {
                renderHomeEventsCardss(currentCard, row, count, homeEvents);
            count++;
            });
        }, 200);
    });
    homeEventsNext.appendChild(homeEventsNextIcon);
    homeEventsDiv.appendChild(homeEventsNext);

    let marginTop = homeEvents.children[0].children[1].clientHeight;
    Array.from(homeEvents.children).forEach(homeEvent => {
        homeEvent.children[1].style.marginTop = ""; 
        homeEvent.children[1].style.marginTop = `-${marginTop}px`;
    });
    homeEventsPrev.style.paddingBottom = `${0.5 * marginTop}px`;
    homeEventsNext.style.paddingBottom = `${0.5 * marginTop}px`;
};

function renderHomeEventsCardss(currentCard, dictObj, count, parentDiv) {
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

    homeEventDiv.style.display = "none";
    console.log("inside Loop");
    console.log("count:", count);
    console.log("currentCard:", currentCard);
    console.log("Condition", count >= currentCard && count < currentCard + numberOfEventCards);
    if (count >= currentCard && count < currentCard + numberOfEventCards) {
        homeEventDiv.style.display = "flex";
    };

};

function homeEventCardSwipe(moveRight, numberOfEventCards) {    
    const homeEventCardsLength = document.getElementsByClassName("homeEventCards")[0].children.length;
    console.log("Event Cards Count", homeEventCardsLength);
    const homeEventsPrev = document.getElementById("homeEventsPrev");
    const homeEventsNext = document.getElementById("homeEventsNext");
    if (moveRight) {
        currentEventCard += 1;
    } else {
        currentEventCard -= 1;
    }
    console.log("currentEventCard", currentEventCard);

    if (currentEventCard === 1) {
        homeEventsPrev.className = "start";
        homeEventsNext.className = "start";
    } else if (currentEventCard > 1 && currentEventCard < homeEventCardsLength + 1 - numberOfEventCards) {
        console.log(currentEventCard);
        homeEventsPrev.className = "middle";
        homeEventsNext.className = "middle";
    } else {
        homeEventsPrev.className = "end";
        homeEventsNext.className = "end";
    }
    console.log("Condition", currentEventCard < homeEventCardsLength + 1 - numberOfEventCards);
}

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
    });
});

/* execution of functions */
themeChanger();
setInterval(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.classList.add(savedTheme);
    } else {
        themeChanger();
    }
}, 30*1000);
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

/* homeEvents function Integration */
let numberOfEventCards = homeEventsMetaInfo();
var currentEventCard = 1;
window.addEventListener("resize", () => {
    numberOfEventCards = homeEventsMetaInfo();
});

window.addEventListener("orientationchange", () => {
    setTimeout(() => {
        numberOfEventCards = homeEventsMetaInfo();
        renderHomeGallery(homeGalleryData, currentImageNumber);
        renderHomeEvents(currentCard, homeEventsData);
    }, 20);
});

        const FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'; // Replace with your form's action URL
        
        document.getElementById('customForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('entry.123456789', document.getElementById('name').value);   // Replace with actual entry IDs
            formData.append('entry.987654321', document.getElementById('email').value);
            formData.append('entry.456789123', document.getElementById('message').value);
            
            try {
                const response = await fetch(FORM_URL, {
                    method: 'POST',
                    mode: 'no-cors',  // Required for cross-origin
                    body: formData
                });
                alert('Submitted successfully!');
                document.getElementById('customForm').reset();
            } catch (error) {
                alert('Submission failed. Check console.');
                console.error(error);
            }
        });