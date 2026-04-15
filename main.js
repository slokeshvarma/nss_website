/* functions */
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
}

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
}

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
}

function renderHomeEvents(data) {
    if (true) {
        // console.log(data);
    }
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
                eventPosterLink: row.eventPosterLink
            })
        }
    });
    renderHomeGallery(homeGalleryData, currentImageNumber);
    renderHomeEvents(homeEventsData);
});


/* execution of functions */
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

/* homeGallery function integration */
var currentImageNumber = 1;
let mouseIsOverDiv = false;
let homeGalleryInteraction = false;

const landingSection = document.getElementsByClassName("landingSection")[0];
const aboutUs = document.getElementsByClassName("aboutUs")[0];
const homeGalleryPrevButton = document.getElementById("homeGalleryPrev").children[0];
const homeGalleryNextButton = document.getElementById("homeGalleryNext").children[0];
const homeGalleryImages = document.getElementsByClassName("homeGalleryImages")[0];

homeGalleryPrevButton.addEventListener('click', () => {
    homeImageGallery(currentImageNumber - 1, 'prev');
    homeGalleryInteraction = true;
});
homeGalleryNextButton.addEventListener('click', () => {
    homeImageGallery(currentImageNumber + 1, 'next');
    homeGalleryInteraction = true;
});

homeGalleryImages.addEventListener("mouseover", () => {
    mouseIsOverDiv = true;
})
homeGalleryImages.addEventListener("mouseover", () => {
    mouseIsOverDiv = true;
})
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
