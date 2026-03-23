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
}

function navSticky() {
    const pageScrollValue = window.scrollY || document.documentElement.scrollTop;
    const collgeLabelHeight = document.getElementsByClassName("collegeLabel")[0].clientHeight;
    const nav = document.getElementsByTagName("nav")[0];
    const navLogo = document.getElementsByClassName("navLogo")[0];
    const navImage = document.getElementsByClassName("navImage")[0];
    const navTitle = document.getElementsByClassName("navTitle")[0];
    const navLinksdiv = document.getElementsByClassName("navLinks")[0];
    const navLinks = document.getElementsByClassName("navLink");
    const navHamburgerLines = document.getElementsByClassName("navHamburgerLine");
    const landingSection = document.getElementsByClassName("landingSection")[0];
    
    const root = document.documentElement;
    root.style.setProperty("--navHeight", nav.offsetHeight + "px");

    let pageScrolledPassed = false;
    if (pageScrollValue/collgeLabelHeight >= 1) {
        pageScrolledPassed = true;
    }

    Array.from(navLinks).forEach(navLink => {
        navLink.classList.toggle("clicked", pageScrolledPassed);
    })
    Array.from(navHamburgerLines).forEach(hamburgerLine => {
        hamburgerLine.classList.toggle("sticked", pageScrolledPassed);
    })
    nav.classList.toggle("sticked", pageScrolledPassed);
    navLogo.classList.toggle("sticked", pageScrolledPassed);
    navImage.classList.toggle("sticked", pageScrolledPassed);
    navTitle.classList.toggle("sticked", pageScrolledPassed);
    navLinksdiv.classList.toggle("sticked", pageScrolledPassed);
    landingSection.classList.toggle("sticked", pageScrolledPassed);
}

function toggleTheme() {
  document.documentElement.classList.toggle('lightMode');
  document.documentElement.classList.toggle('darkMode');
}

window.addEventListener('scroll', navSticky, { passive: true });
window.addEventListener('touchmove', navSticky);

function openLink(link) {
  window.open(link, "_blank");
}
const hamburgerMenu = document.getElementById("navHamburgerClickable");
const GVPLogo = document.getElementById("collegeLabelGVPLogo");
const NSSLogo = document.getElementById("collegeLabelNSSLogo");

hamburgerMenu.addEventListener("click", navMobileMenu);
GVPLogo.addEventListener("click", () => openLink("https://www.gvpce.ac.in/"));
NSSLogo.addEventListener("click", () => openLink("https://nss.gov.in/"));