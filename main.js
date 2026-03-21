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
