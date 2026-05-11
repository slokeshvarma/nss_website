let heartBeatInterval;

function startHeartbeat() {
    sendHeartbeat();
    heartBeatInterval = setInterval(sendHeartbeat, 5 * 60 * 1000);
}

function sendHeartbeat() {
    if (!sessionID || !userID) return;
    navigator.sendBeacon(logInOut_Proxy_URL, JSON.stringify({
        googleAppScriptLink: logInAppScriptLink,
        action: "heartBeat",
        sessionID: sessionID,
        userID: userID
    }));
}

function stopHeartbeat() {
    clearInterval(heartBeatInterval);
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && userLoggedIn) sendHeartbeat();
});

let idleTimerDisplay;
let autoLogoutTimer = null;
const timeOutMinutes = 15;
const warningMinutes = 3;

function resetInactivityTimer() {
    if (!userLoggedIn) return;
    clearInterval(idleTimerDisplay);
    $("logOutTimer").innerHTML = `15:00`;

    var currentMinute = 14;
    var currentSecond = 59;

    idleTimerDisplay = setInterval(()=> {
        if (currentSecond < 0) {
            return ;
            if (currentMinute <= 0) {
            }
            else {
                currentMinute--;
                currentSecond = 59;
            }
        } else if (currentMinute === warningMinutes) {
            // logOutAlert("autologOut");
        }
        $("logOutTimer").innerHTML = `${currentMinute.toString().padStart(2,"0")}:${currentSecond.toString().padStart(2,"0")}`;
        currentSecond--;
    }, 1000);
};

["mousemove", "keypress", "touchmove", "keyup", "touchend", "click", "scroll"].forEach(event => {
    document.addEventListener(event, () => {
        if (userLoggedIn) resetInactivityTimer();
        }, { passive: true });
});


let userLoggedIn = false;
const $ = id => document.getElementById(id);
const users = {
    chairman:          "Dr. A. B. Koteshwara Rao Sir",
    po_unit_1:         "Dr. Sateesh Virothu Sir",
    po_unit_2:         "Dr. T. S. Vamsi Krishna Sir",
    president_unit_1:  "Unit-1 Student President",
    president_unit_2:  "Unit-2 Student President",
    nsswebhandler:     "Webhandler",
    webhandler_unit_1: "Unit-1 Web Handler",
    webhandler_unit_2: "Unit-2 Web Handler",
    org_author:        "Lokesh Anand Varma"
};
const inputEventDetails = { 0: ["eventDate", "Event Date", "dd/mm/yyyy"],
                            1: ["eventName", "Event Name", "event name"],
                            2: ["eventUnit", "Event Unit", ""],
                            3: ["eventCoOrganizer", "Event Co-Organizer", "event co-organizer"],
                            4: ["eventDescription_oneLine", "Event Description (One Line)", "a one line description"],
                            5: ["eventDescription_multipleLine", "Event Description (Multiple Line)", "multiple line description"],
                            6: ["eventPosterGoogleID", "Event Poster ID", "poster google drive ID"],
                            7: ["eventGroupPhotos", "Event Group Photos Count", "group photos count"],
                            8: ["eventPhotos", "Event Photos Count", "photos count"]
                            
};
let userID, user, sessionID;
const logInOut_Proxy_URL = "https://gappscript-proxy.nss-gvpce-a.workers.dev/";
let startTime;
window.addEventListener("DOMContentLoaded", () => {
    startTime = new Date();
    const footerHeight = document.querySelector("footer").clientHeight;
    document.documentElement.style.setProperty("--footerHeight", `${footerHeight}px`);

    const savedSession = sessionStorage.getItem("userLoggedIn");
    if (savedSession === "true") {
        sessionID    = sessionStorage.getItem("sessionID");
        userID       = sessionStorage.getItem("userID");
        user         = users[userID];
        userLoggedIn = true;
        sendHeartbeat();
        setTimeout(resetInactivityTimer, 500);
    }
    pageRender();
});

window.addEventListener("resize", () => updateEyeLocation());