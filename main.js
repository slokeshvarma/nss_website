function navStickyFunctionDesktop() {
    const collgeLabelHeight = document.getElementById("collegeLabel").clientHeight;
    const nav = document.getElementsByTagName("nav")[0];
    const navLogo = document.getElementsByClassName("navLogo")[0];
    const pageScrollValue = window.scrollY || document.documentElement.scrollTop;
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const navLinkPadding = parseFloat(style.getPropertyValue('--navLinkPadding'));
    const primaryColor = style.getPropertyValue('--primaryColor');
    const navLinks = document.getElementsByClassName("navLink");

    if (pageScrollValue >= collgeLabelHeight) {
        navLogo.style.display = `flex`;
        nav.style.position = "fixed";
        nav.style.top = 0;
        nav.style.backgroundColor = "white";
        nav.style.paddingTop = `1rem`;
        nav.style.paddingBottom = `1rem`;
        Array.from(navLinks).forEach(navLink => {
            navLink.style.color = primaryColor;
            navLink.style.padding = `${0.085*navLinkPadding}px ${0.25*navLinkPadding}px`;
        });
    } else {
        const scrollRatio = pageScrollValue/collgeLabelHeight;
        navLogo.style.display = `none`;
        nav.style.position = "relative";
        nav.style.top = collgeLabelHeight;
        const paddingTopBottom = 0.5 + 0.5*scrollRatio;
        nav.style.paddingTop = `${paddingTopBottom}rem`;
        nav.style.paddingBottom = `${paddingTopBottom}rem`;
        Array.from(navLinks).forEach(navLink => {
            navLink.style.padding = `${0.15*navLinkPadding}px ${0.5*navLinkPadding}px`;
        });
        if (scrollRatio >= 0.75) {
            navLogo.style.display = `flex`;
            navLogo.style.transform = `scale(${scrollRatio})`;
        }
    }
};


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
    console.log(pageScrollValue);

    const nav = document.getElementsByTagName("nav")[0];
    const navLogo = document.getElementsByClassName("navLogo")[0];
    const navImage = document.getElementsByClassName("navImage")[0];
    const navTitle = document.getElementsByClassName("navTitle")[0];
    const navLinksdiv = document.getElementsByClassName("navLinks")[0];
    const navHamburgerLines = document.getElementsByClassName("navHamburgerLine");
    const landingSection = document.getElementsByClassName("landingSection")[0];

    Array.from(navHamburgerLines).forEach(hamburgerLine => {
        hamburgerLine.classList.toggle("sticked");
    })
    nav.classList.toggle("sticked");
    navLogo.classList.toggle("sticked");
    navImage.classList.toggle("sticked");
    navTitle.classList.toggle("sticked");
    navLinksdiv.classList.toggle("sticked");
    landingSection.classList.toggle("sticked");
}

function toggleTheme() {
  document.documentElement.classList.toggle('lightMode');
  document.documentElement.classList.toggle('darkMode');
}

function nameIT() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    console.log("Mobile scroll:", scrollY);
}

window.addEventListener('scroll', nameIT, { passive: true });
window.addEventListener('touchmove', () => console.log("Touch scroll!")); // Mobile bonus
