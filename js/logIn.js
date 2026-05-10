function setURL(pageTitle, pushingURL) {
    const currentURL = window.location.href.split("/");
    const lastTag = currentURL[currentURL.length - 1];

    const newURL = lastTag
        ? window.location.href.replace(lastTag, pushingURL)
        : window.location.href + pushingURL;

    window.history.pushState({ page: 1 }, pageTitle, newURL);
}

function pageRender() {
    const logInMain = document.getElementById("logIn");
    const eventMain = document.getElementById("eventMain");
    while (logInMain.lastElementChild) {
            logInMain.removeChild(logInMain.lastElementChild);
    }
    while (eventMain.lastElementChild) {
            eventMain.removeChild(eventMain.lastElementChild);
    }
    if (!userLoggedIn) {
        logInMain.style.display = "flex";
        eventMain.style.display = "none";
        logInPageRender(logInMain);
    } else {
        logInMain.style.display = "none";
        eventMain.style.display = "flex";
        cmsEventPageRender(eventMain);
    }
    mainFinder();
}

function logInPageRender(logInMain) {
    const logInForm = document.createElement("div");
    logInForm.id = "logInForm";
    logInForm.className = "logInForm";
    logInForm.innerHTML = `
    <div>
        <h2 class="formTitle">CMS of Events</h2>
        <p>Log In to update events</p>
    </div>`;

    const userIDField = document.createElement("div");
    userIDField.className = "formField";
    const userIDLabel = document.createElement("label");
    userIDLabel.innerHTML = "User ID";
    const userIDInput = document.createElement("input");
    userIDInput.type = "text";
    userIDInput.id = "userID";
    userIDInput.className = "logInFormInput";
    userIDInput.placeholder = "Enter your user ID";
    userIDInput.autocomplete = "off";
    userIDInput.tabIndex = "1";
    userIDField.appendChild(userIDLabel);
    userIDField.appendChild(userIDInput);

    const passwordField = document.createElement("div");
    passwordField.className = "formField";
    const passwordLabel = document.createElement("label");
    passwordLabel.id = "passwordLabel";
    passwordLabel.innerHTML = "Password";
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.className = "logInFormInput";
    passwordInput.placeholder = "Enter your Password";
    passwordInput.autocomplete = "off";
    passwordInput.tabIndex = "1";

    userIDInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") passwordInput.focus();
    });

    const passwordEye = document.createElement("i");
    passwordEye.id = "passwordEye";
    passwordEye.className = "fa-solid fa-eye";
    passwordEye.tabIndex = "2";
    passwordEye.addEventListener("click", () => {
        const el  = document.getElementById("password");
        const eye = document.getElementById("passwordEye");
        if (el.type === "password") {
            eye.classList.replace("fa-eye", "fa-eye-slash");
            el.type = "text";
        } else {
            eye.classList.replace("fa-eye-slash", "fa-eye");
             el.type = "password";
        }
    });
    passwordEye.addEventListener("keydown", (e) => {
        if (e.key = "Enter") {
            const el  = document.getElementById("password");
            const eye = document.getElementById("passwordEye");
            if (el.type === "password") {
                eye.classList.replace("fa-eye", "fa-eye-slash");
                el.type = "text";
            } else {
                eye.classList.replace("fa-eye-slash", "fa-eye");
                el.type = "password";
            }
        }
    });

    passwordField.appendChild(passwordEye);
    passwordField.appendChild(passwordLabel);
    passwordField.appendChild(passwordInput);

    passwordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { 
            if (e.shiftKey) {
                userIDInput.focus();
                return;
            } else {
                passwordInput.blur(); 
                logIn(); 
            }       
        }
    });

    const message_button_container = document.createElement("div");
    message_button_container.className = "logInMessage_Button";

    const messageText = document.createElement("p");
    messageText.id = "logInMessageText";
    messageText.innerHTML = "";

    const submit = document.createElement("button");
    submit.id = "logInSubmit";
    submit.className = "logInSubmit";
    submit.innerHTML = "Submit";
    submit.addEventListener("click", () => logIn());

    message_button_container.appendChild(messageText);
    message_button_container.appendChild(submit);

    logInForm.appendChild(userIDField);
    logInForm.appendChild(passwordField);
    logInForm.appendChild(message_button_container);
    logInMain.appendChild(logInForm);
    updateEyeLocation();
}

function cmsEventPageRender(eventMain) {
    cmsUpdatingRender(eventMain);
    cmsUpdatingFormRender(eventMain);
    $("logOut").addEventListener("click", () => logOutAlert("logOut?"));
}

function cmsUpdatingRender(eventMain) {
    const logDetails = document.createElement("div");
    logDetails.className = "logDetails";

    const loggedInP = document.createElement("p");
    loggedInP.className = "loggedInP";
    loggedInP.innerHTML = `Welcome, ${users[userID]}<br>userId: ${userID} &nbsp;|&nbsp; session: ${sessionID}`;
    
    const logOutDiv = document.createElement("div");
    logOutDiv.className = "logOutDiv";
    logOutDiv.innerHTML = `
                <p id="logOutTimer">15:00</p>
                <button id="logOut" class="logOutButton">Log Out</button>
    `;

    logDetails.appendChild(loggedInP);
    eventMain.appendChild(logDetails);    
    eventMain.appendChild(logOutDiv);
}

function cmsUpdatingFormRender(eventMain) {
    const eventDataForm = document.createElement("div");
    eventDataForm.id = "eventDataForm";
    eventDataForm.className = "eventDataForm";
    eventDataForm.innerHTML = `
    <div class="eventDataFormTitle">
        <h2 class="formTitle">CMS of Events</h2>
        <p>Fill form to add events</p>
    </div>`;

    for (let index = 0; index < Object.keys(inputEventDetails).length; index++) {
        const formField = inputEventDetails[index][0];
        const formFieldTitle = inputEventDetails[index][1];
        const formFieldPlaceholder = inputEventDetails[index][2];

        const formFieldDiv = document.createElement("div");
        formFieldDiv.className = "eventFormField";
        formFieldDiv.id = `eventFormField-${formField}`;
        const formFieldLabel = document.createElement("label");
        formFieldLabel.className = "eventFormLabel";
        formFieldLabel.innerHTML = `${formFieldTitle}`;
        formFieldDiv.appendChild(formFieldLabel);
        
        eventFormFieldInputRender(formField, formFieldTitle, formFieldPlaceholder, formFieldDiv);
        
        eventDataForm.appendChild(formFieldDiv);
    }
    const submitDiv =  document.createElement("div");
    submitDiv.className = "addEventSubmitDiv";
    const submit = document.createElement("button");
    submit.id = "addEventSubmit";
    submit.className = "addEventSubmit";
    submit.innerHTML = "Submit";
    submit.addEventListener("click", () => addEventToSheet());
    eventMain.appendChild(eventDataForm);
    submitDiv.appendChild(submit);
    eventMain.appendChild(submitDiv);
}
let groupPhotosCount, photosCount;

function eventFormFieldInputRender(formField, formFieldTitle, formFieldPlaceholder, formFieldDiv, value = false) {
    let formFieldInput;
    if (formField === "eventDate") {
        formFieldInput = document.createElement("input");
        formFieldInput.className = "eventFormInput";
        formFieldInput.type = "text";
        formFieldInput.id = `${formField}`;
        formFieldInput.placeholder = `${formFieldPlaceholder}`;
        formFieldInput.autocomplete = "off";
        formFieldInput.maxLength = 10;
        
        formFieldInput.addEventListener("keydown", function (e) {
            if (e.key === "Backspace") {
                let value = e.target.value;
                if (value.endsWith("/")) {
                    e.preventDefault();
                    e.target.value = value.slice(0, -1);
                }
            }
        });

        formFieldInput.addEventListener("input", function (e) {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length >= 2) {
                value = value.slice(0, 2) + "/" + value.slice(2);
            }
            if (value.length >= 4) {
                value = value.slice(0, 5) + "/" + value.slice(5, 9);
            }
            e.target.value = value;
        });

    } else if (formField === "eventUnit") {
        formFieldInput = document.createElement("div");
        formFieldInput.className = "eventFormInput";
        formFieldInput.id = `${formField}`;
            
        ["1", "2", "Both"].forEach(unit => {
            const formFieldOption = document.createElement("div");
            formFieldOption.className = "subFormFieldOption";

            const subFormFieldInput = document.createElement("input");
            subFormFieldInput.type = "radio";
            subFormFieldInput.name = "eventUnit";
            subFormFieldInput.id = `unit_${unit}`;
            subFormFieldInput.className = "subFormFieldInputRadio";
            subFormFieldInput.value = unit === "Both" ? "B" : unit;

            const subFormFieldLabel = document.createElement("label");
            subFormFieldLabel.className = "subFormLabel";
            subFormFieldLabel.innerHTML =  unit;
            subFormFieldLabel.htmlFor = `unit_${unit}`;
            formFieldOption.appendChild(subFormFieldInput);
            formFieldOption.appendChild(subFormFieldLabel);
            formFieldInput.appendChild(formFieldOption);
        })
    } else if (formField === "eventDescription_oneLine" || formField === "eventDescription_multipleLine") {
        formFieldInput = document.createElement("textarea");
        formFieldInput.className = "eventFormInput";
        formFieldInput.id = `${formField}`;
        formFieldInput.placeholder = `Enter ${formFieldPlaceholder}`;
        formFieldInput.autocomplete = "off";
        formFieldInput.rows = 1;
        formFieldInput.addEventListener("input", function() {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
            this.style.overflowY = this.scrollHeight > 180 ? "auto" : "hidden";
        });
        setTimeout(() => {
            document.querySelectorAll("textarea.eventFormInput").forEach(el => {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
            });
        }, 100);
    } else if (formField === "eventGroupPhotos" || formField === "eventPhotos") {
        formFieldInput = document.createElement("input");
        formFieldInput.className = "eventFormInput";
        formFieldInput.type = "number";
        formFieldInput.id = `${formField}`;
        formFieldInput.placeholder = `Enter ${formFieldPlaceholder}`;
        formFieldInput.autocomplete = "off";

        let inputInterval;
        formFieldInput.addEventListener("input", function() {
            let value = formFieldInput.value.replace(/\D/g, "");
            imageCount = Number(value);
            const formFieldInputID = this.id
            if (imageCount < 1) this.value = 1;
            if (formFieldInputID === "eventGroupPhotos" && imageCount > 4) imageCount = 4;    
            if (formFieldInputID === "eventPhotos" && imageCount > 8) imageCount = 8;
            formFieldInput.value = imageCount;

            clearInterval(inputInterval);
            inputInterval = setTimeout(()=> {
                const formField = this.id.replace("s", "");
                const eventDataForm = $("eventDataForm");
                const eventFormFields = Array.from(eventDataForm.children);
                eventFormFields.forEach(formFieldDiv => {
                    if (formFieldDiv.classList.contains("addedThroughInput") && formFieldDiv.id.includes(formField)) {
                        eventDataForm.removeChild(formFieldDiv);
                    }
                })
                let formFieldTitle, formFieldPlaceholder;  
                for (let index = 1; index < imageCount + 1; index++) {
                    if (formField.includes("Group")) {
                        formFieldTitle = `Event Group Photo-${index}`;
                        formFieldPlaceholder = `group photo-${index} gdrive ID`;
                    } else {
                        formFieldTitle = `Event Photo-${index}`;
                        formFieldPlaceholder = `photo-${index} gdrive ID`;
                    }

                    const formFieldDiv = document.createElement("div");
                    formFieldDiv.className = "eventFormField";
                    formFieldDiv.classList.add("addedThroughInput");
                    formFieldDiv.id = `eventFormField-${formField}`;
                    const formFieldLabel = document.createElement("label");
                    formFieldLabel.className = "eventFormLabel";
                    formFieldLabel.innerHTML = `${formFieldTitle}`;
                    formFieldDiv.appendChild(formFieldLabel);
            
                    eventFormFieldInputRender(formField, formFieldTitle, formFieldPlaceholder, formFieldDiv, index);
            
                    const formFieldMSG = document.createElement("p");
                    formFieldMSG.innerHTML = "";
                    formFieldMSG.id = `${formField}MSG`;
                    formFieldMSG.className = `formFieldMessage`;
                    formFieldDiv.appendChild(formFieldMSG);
                    eventDataForm.appendChild(formFieldDiv);
                }
                if (formFieldInputID === "eventGroupPhotos") groupPhotosCount = imageCount;    
                if (formFieldInputID === "eventPhotos") photosCount = imageCount;
            }, 500);
        })
    } else {
        if (value) {
            formFieldInput = document.createElement("input");
            formFieldInput.className = "eventFormInput";
            formFieldInput.type = "text";
            formFieldInput.id = `${formField}-${value}`;
            formFieldInput.placeholder = `Enter ${formFieldPlaceholder}`;
            formFieldInput.autocomplete = "off";
        } else {
            formFieldInput = document.createElement("input");
            formFieldInput.className = "eventFormInput";
            formFieldInput.type = "text";
            formFieldInput.id = `${formField}`;
            formFieldInput.placeholder = `Enter ${formFieldPlaceholder}`;
            formFieldInput.autocomplete = "off";
        }
    }
    formFieldDiv.appendChild(formFieldInput);
    if (value) {
        const formFieldMSG = document.createElement("p");
        formFieldMSG.innerHTML = "";
        formFieldMSG.id = `${formField}-${value}MSG`;
        formFieldMSG.className = `formFieldMessage`;
        formFieldDiv.appendChild(formFieldMSG);
    } else {
        const formFieldMSG = document.createElement("p");
        formFieldMSG.innerHTML = "";
        formFieldMSG.id = `${formField}MSG`;
        formFieldMSG.className = `formFieldMessage`;
        formFieldDiv.appendChild(formFieldMSG);
    }
}

const logInAppScriptLink = "https://script.google.com/macros/s/AKfycbxLtDMInrMaQl2K5llhsqD0Ll--Y4J1QBeC-s8prCsrpNf6ykZiEBJjja_dzdPCQ8WV/exec";
const eventDataUpdateAppScriptLink = "https://script.google.com/macros/s/AKfycbzil5IzzZI4rQiI4ht0ibRhJ_7XXvhQ7VgqZXHFIS4a3Z5sKJ4jedplhA2vYYuYX_bAIw/exec";

async function logIn() {
    const inputUserID   = $("userID").value.toLowerCase().trim();
    const inputPassword = $("password").value;

    $("logInMessageText").innerHTML = "";

    if (!inputUserID || !inputPassword) {
        setMsg("logInMessageText", "Please enter both fields !!", "accent1");
        return;
    }
    if (!Object.keys(users).includes(inputUserID)) {
        setMsg("logInMessageText",
            inputUserID.length < 8
                ? `"${inputUserID}" is not a Valid User ID !!`
                : `"${inputUserID}"<br>is not a User ID !!`,
            "accent1"
        );
        $("userID").value = "";
        $("password").value = "";
        return;
    }

    let count = 0;
    const verifyingInterval = setInterval(() => {
        const dots = ["Verifying.", "Verifying..", "Verifying..."];
        setMsg("logInMessageText", dots[count % 3], "accent2");
        count++;
    }, 400);

    const generatedSessionID = Math.random().toString(36).substring(2, 7).toUpperCase();
    const logInData = {
        googleAppScriptLink: logInAppScriptLink,
        action: "logIn",
        sessionID: generatedSessionID,
        userID: inputUserID,
        password: inputPassword
    };

    try {
        const response = await fetch(logInOut_Proxy_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(logInData)
        });
        const rawText = await response.text();
        console.log("Raw response:", rawText);
        const data = JSON.parse(rawText);
        clearInterval(verifyingInterval);

        if (data.auth) {
            if (!data.activeSession) {
                setMsg("logInMessageText", "Login Successful!", "accent2");

                // FIX: Set session vars immediately so heartbeat and timers work correctly
                userLoggedIn = true;
                sessionID    = generatedSessionID;
                userID       = inputUserID;
                user         = users[inputUserID];

                sessionStorage.setItem("sessionID", generatedSessionID);
                sessionStorage.setItem("userID", inputUserID);
                sessionStorage.setItem("userLoggedIn", "true");

                setTimeout(() => {
                    pageRender();
                    startHeartbeat();
                    resetInactivityTimer();
                }, 1000);
            } else {
                setMsg("logInMessageText", "An active session exists!<br>Try after 5 min", "accent1");
                $("userID").value = "";
                $("password").value = "";
            }
        } else {
            setMsg("logInMessageText", "Wrong password! Try Again", "accent1");
            $("password").value = "";
        }
    } catch (err) {
        clearInterval(verifyingInterval);
        console.error("Fetch error:", err);
        setMsg("logInMessageText", "Connection error. Try again.", "accent1");
    }
}

async function logOut(inputStatus) {
    stopHeartbeat();
    autoLogoutTimer = null;

    const userData = {
        googleAppScriptLink: logInAppScriptLink,
        action: "logOut",
        sessionID: sessionStorage.getItem("sessionID"),
        userID: sessionStorage.getItem("userID"),
        status: inputStatus
    };

    try {
        const response = await fetch(logInOut_Proxy_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(userData)
        });
        const res = await response.json();
    } catch (err) {
    }

    userLoggedIn = false;
    userID       = undefined;
    user         = undefined;
    sessionID    = undefined;
    clearSession();    
    setTimeout(() => {
        pageRender();
    }, 1500);
}

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


function setMsg(id, html, colorVar) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = html;
    el.style.color = `var(--${colorVar}Color)`;
}

function updateEyeLocation() {
    const passwordInput = document.getElementById("password");
    const passwordEye   = document.getElementById("passwordEye");
    if (!passwordInput || !passwordEye) return;
    const appearanceAdjustment = 2;
    document.documentElement.style.setProperty(
        "--passwordEyeBottom",
        `${passwordInput.clientHeight / 2 - passwordEye.clientHeight / 2 - appearanceAdjustment}px`
    );
}

function clearSession() {
    sessionStorage.removeItem("sessionID");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("userLoggedIn");
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
    return academicYear
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

function enterBloodDonation() {
    eventDataEntry("18-04-2026", "Blood Donation", "1 & 2",
"Rotract", "Like every year, a collabration between nss and rotract lead to a sucessful blood donation", "Like every year, a collabration between nss and rotract lead to a sucessful blood donation \n Like every year, a collabration between nss and rotract lead to a sucessful blood donation \n Like every year, a collabration between nss and rotract lead to a sucessful blood donation")
}

async function addEventToSheet() {
    if (!userLoggedIn) {
        return;
    }
    let inputEventUnit, incompleteInput;
    incompleteInput = false;
    const eventFormDetails = Array.from(document.querySelectorAll(".eventFormInput"));
    eventFormDetails.forEach(inputField => {
        let fieldMessage = ``;
        if (inputField.id === "eventDate") {
            if ($(inputField.id).value === "") fieldMessage = `Enter a event date`;
        } else if (inputField.id === "eventUnit") {
            const selected = document.querySelector('input[name="eventUnit"]:checked');
            if (selected) {
                inputEventUnit = selected.value;
            } else {
                incompleteInput = true;
                fieldMessage = "Select a Unit!";
            }
        }  else {
            if ($(inputField.id).value === "") {
                fieldMessage = `${inputField.placeholder}`;
                incompleteInput = true;
            }
        }
        $(`${inputField.id}MSG`).innerHTML = fieldMessage;
        $(`${inputField.id}MSG`).style.color = "var(--accent1Color)";
    })

    if (!incompleteInput) {
        const inputEventDate = $("eventDate").value;
        const inputEventName = $("eventName").value;
        const academicYearCalculated = academicYearCalculator(inputEventDate);
        const inputEventID = eventIdGenerator(inputEventDate, inputEventName, inputEventUnit);
        const inputEventCoOrganizer = $("eventCoOrganizer").value;
        const inputEventDescription_oneLine = $("eventDescription_oneLine").value; 
        const inputEventDescription_multipleLine = $("eventDescription_multipleLine").value; 
        
        const eventData = {
            googleAppScriptLink: eventDataUpdateAppScriptLink,
            action: "addEvent",
            sessionID: sessionStorage.getItem("sessionID"),
            userID: sessionStorage.getItem("userID"),
            academicYear: academicYearCalculated,
            eventID: inputEventID,
            eventDate: inputEventDate, 
            eventName: inputEventName,
            eventUnit: inputEventUnit,
            eventCoOrganizer: inputEventCoOrganizer,
            eventDescription_oneLine: inputEventDescription_oneLine,
            eventDescription_multipleLine: inputEventDescription_multipleLine
        };

        try {
            const response = await fetch(logInOut_Proxy_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(eventData)
            });
            const res = await response.text()
            console.log(res.dataAdded)
        } catch (err) {
        console.error("eventDataEntry error:", err);
        }
    }
}

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