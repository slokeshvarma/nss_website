function navMobileMenu() {
    const navLinks = document.getElementsByClassName("navLinks")[0];
    const navHamburgerLines = document.getElementsByClassName("navHamburgerLine");
    Array.from(navHamburgerLines).forEach(hamburgerLine => {
        hamburgerLine.classList.toggle("clicked");
    }) 
    navLinks.classList.toggle("clicked");
}

function navSticky() {
    const pageScrollValue = window.scrollY || document.documentElement.scrollTop;
    const collgeLabelHeight = document.getElementsByClassName("collegeLabel")[0].clientHeight;
    let pageScrolledPassed = false;
    if (pageScrollValue/collgeLabelHeight >= 1) {
        pageScrolledPassed = true;
    }
    const nav = document.getElementsByTagName("nav")[0];
    const navLogo = document.getElementsByClassName("navLogo")[0];
    const navImage = document.getElementsByClassName("navImage")[0];
    const navTitle = document.getElementsByClassName("navTitle")[0];
    const navLinksdiv = document.getElementsByClassName("navLinks")[0];
    const navHamburgerLines = document.getElementsByClassName("navHamburgerLine");
    const landingSection = document.getElementsByClassName("landingSection")[0];

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
