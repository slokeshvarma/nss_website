function pageRender() {
    const signInMain = document.getElementById("signIn");
    if (!userLoggedIn) {
        while (signInMain.lastElementChild) {
            signInMain.removeChild(signInMain.lastElementChild);
        };
        const signInForm = document.createElement("div");
        signInForm.id = "signInForm";
        signInForm.className = "signInForm";
        signInForm.innerHTML = `
        <div>
            <h2 class="formTitle">CMS of Events</h2>
            <p>Sign In to update events</p>
        </div>`;

        const userIDField = document.createElement("div");
        userIDField.className = "formField";
        const userIDLabel = document.createElement("label");
        userIDLabel.innerHTML = "User ID";
        const userIDInput = document.createElement("input");
        userIDInput.type = "text";
        userIDInput.id = "userID";
        userIDInput.placeholder = "Enter your user ID";
        userIDInput.autocomplete = 'off';

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
        passwordInput.placeholder = "Enter your Password";
        passwordInput.autocomplete = 'off';

        userIDInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") passwordInput.focus();
        });

        const passwordEye = document.createElement('i');
        passwordEye.id = "passwordEye";
        passwordEye.className = "fa-solid fa-eye";
        passwordEye.addEventListener("click", () => {
            const passwordInputElement = document.getElementById("password");
            const passwordEyeElement = document.getElementById("passwordEye");
            if (passwordInputElement.type === "password") {
                passwordEyeElement.classList.replace("fa-eye", "fa-eye-slash");
                passwordInputElement.type = "text";
            } else {
                passwordEyeElement.classList.replace("fa-eye-slash", "fa-eye");
                passwordInputElement.type = "password";
            }
        });

        passwordField.appendChild(passwordEye);
        passwordField.appendChild(passwordLabel);
        passwordField.appendChild(passwordInput);

        passwordInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                passwordInput.blur();
                signIn();
            }
        });

        const message_button_container = document.createElement("div");
        message_button_container.className = "signInMessage_Button";

        const messageText = document.createElement("p");
        messageText.id = "signInMessageText";
        messageText.innerHTML = "&nbsp;";

        const submit = document.createElement("button");
        submit.id = "signInSubmit";
        submit.className = "signInSubmit";
        submit.innerHTML = "Submit";
        submit.addEventListener("click", () => {
            signIn();
        });

        message_button_container.appendChild(messageText);
        message_button_container.appendChild(submit);

        signInForm.appendChild(userIDField);
        signInForm.appendChild(passwordField);
        signInForm.appendChild(message_button_container);
        signInMain.appendChild(signInForm);

        updateEyeLocation();

    } else {
        while (signInMain.lastElementChild) {
            signInMain.removeChild(signInMain.lastElementChild);
        };
        const signInP = document.createElement("p");
        signInP.className = "signInP";
        signInP.innerHTML = `Hello, ${users[userID]} <br> user: ${user}, userID: ${userID}, sessionID: ${sessionID}`;
        const logOut = document.createElement("button");
        logOut.id = "signOut";
        logOut.className = "signOutButton";
        logOut.innerHTML = "Sign Out";
        logOut.addEventListener("click", () => {
            signOut("manual");
        });
        signInMain.appendChild(signInP);
        signInMain.appendChild(logOut);
    }
}

async function signIn() {
    const inputUserID = $("userID").value.toLowerCase().trim();
    const inputPassword = $("password").value;

    $("signInMessageText").innerHTML = ``;
    if (!inputUserID || !inputPassword) {
        $("signInMessageText").innerHTML = `Please enter both fields !!`;
        $("signInMessageText").style.color = "var(--accent1Color)";
        return;
    }
    if (!Object.keys(users).includes(inputUserID)) {
        if (inputUserID.length < 8) {
            $("signInMessageText").innerHTML = `"${inputUserID}" is not a Valid User ID !!`;
        } else {
            $("signInMessageText").innerHTML = `"${inputUserID}" <br> is not a User ID !!`;
        }
        $("signInMessageText").style.color = "var(--accent1Color)";
        $("userID").value = "";
        $("password").value = "";
        return;
    } else {
        if ($("password").value === "") {
            $("signInMessageText").innerHTML = `Please enter the Password !!`;
            $("signInMessageText").style.color = "var(--accent1Color)";
            return;
        }
    }

    $("signInMessageText").style.color = "var(--accent2Color)";
    let count = 0;
    const verifyingInterval = setInterval(() => {
        if (count === 0) {
            $("signInMessageText").innerHTML = "Verifying.";
        } else if (count === 1) {
            $("signInMessageText").innerHTML = "Verifying..";
        } else {
            $("signInMessageText").innerHTML = "Verifying...";
            count = -1;
        }
        count++;
    }, 400);

    const generatedSessionID = Math.random().toString(36).substring(2, 7).toUpperCase();
    const logInData = {
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
                $("signInMessageText").innerHTML = "Login Successful!";
                $("signInMessageText").style.color = "var(--accent2Color)";

                sessionStorage.setItem("sessionID", generatedSessionID);
                sessionStorage.setItem("userID", inputUserID);
                sessionStorage.setItem("userLoggedIn", "true");

                setTimeout(() => {
                    userLoggedIn = true;
                    sessionID = generatedSessionID;
                    userID = inputUserID;
                    user = users[inputUserID];
                    pageRender();
                    startHeartbeat();
                }, 1000);
            } else {
                $("signInMessageText").innerHTML = "An Active session exits! <br> Try after 10:00 min";
                $("signInMessageText").style.color = "var(--accent1Color)";
                $("userID").value = "";
                $("password").value = "";
            }
        } else {
            $("signInMessageText").innerHTML = "Wrong password! Try Again";
            $("signInMessageText").style.color = "var(--accent1Color)";
            $("password").value = "";
        }
    } catch (err) {
        clearInterval(verifyingInterval);
        console.error("Fetch error:", err);
        $("signInMessageText").innerHTML = "Connection error. Try again.";
        $("signInMessageText").style.color = "var(--accent1Color)";
    }
}

async function signOut(inputStatus) {
    stopHeartbeat();
    const userData = {
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
        console.log("SignOut response:", res);
    } catch (err) {
        console.error("SignOut error:", err);
    }

    userLoggedIn = false;
    userID = undefined;
    user = undefined;
    sessionID = undefined;
    clearSession();
    pageRender();
}

function startHeartbeat() {
    sendHeartbeat();
    heartBeatInterval = setInterval(sendHeartbeat, 5 * 60 * 1000);
}

function sendHeartbeat() {
    navigator.sendBeacon(logInOut_Proxy_URL, JSON.stringify({
        action: "heartBeat",
        sessionID: sessionID,
        userID: userID
    }));
}

function stopHeartbeat() {
    clearInterval(heartBeatInterval);
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && userLoggedIn) {
        sendHeartbeat();
    }
});

function updateEyeLocation() {
    const passwordInput = document.getElementById("password");
    const passwordEye = document.getElementById("passwordEye");
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

let userLoggedIn = false;
const $ = id => document.getElementById(id);
const users = {
    chairman: "Dr. A. B. Koteshwara Rao Sir",
    po_unit_1: "Dr. Sateesh Virothu Sir",
    po_unit_2: "Dr. T. S. Vamsi Krishna Sir",
    president_unit_1: "Unit-1 Student President",
    president_unit_2: "Unit-2 Student President",
    nsswebhandler: "Webhandler",
    webhandler_unit_1: "Unit-1 Student President",
    webhandler_unit_2: "Unit-2 Student President",
    author: "Lokesh Anand Varma"
};
let userID, user, sessionID;
let heartBeatInterval;
const logInOut_Proxy_URL = "https://gappscript-proxy.nss-gvpce-a.workers.dev/";

window.addEventListener("DOMContentLoaded", () => {
    const footerHeight = document.querySelector("footer").clientHeight;
    document.documentElement.style.setProperty("--footerHeight", `${footerHeight}px`);

    const savedSession = sessionStorage.getItem("userLoggedIn");
    if (savedSession === "true") {
        sessionID = sessionStorage.getItem("sessionID");
        userID = sessionStorage.getItem("userID");
        user = users[userID];
        userLoggedIn = true;
    }
    pageRender();
});

window.addEventListener("resize", () => {
    updateEyeLocation();
});

let mouseTimer, movingViaTouch, mouseIsMoving, keyboardIsClicked;
document.addEventListener("keypress", ()=> {
    keyboardIsClicked = true;
    autoLogOut();
});
document.addEventListener("mousemove", ()=> {
    clearInterval(mouseTimer);
    mouseIsMoving = true;
    autoLogOut();
    mouseTimer = setTimeout(() => {
        mouseIsMoving = false;
        autoLogOut();
    }, 1000)
})
document.addEventListener("touchmove", ()=> {
    movingViaTouch = true;
    autoLogOut();
})
document.addEventListener("keyup", ()=> {
    keyboardIsClicked = false;
    autoLogOut();
});
document.addEventListener("touchend", ()=> {
    movingViaTouch = false;
    autoLogOut();
})

function autoLogOut() {
    if (!movingViaTouch && !keyboardIsClicked && !mouseIsMoving) {
        let countMinutes = 0;
        const timeOutMin = 5;
        setInterval(()=>{
            if (countMinutes === timeOutMin - 2) {
                autoLogOutAlert();
            } else if (countMinutes === timeOutMin) {
                signOut("auto_logout");
            }
            countMinutes++
        }, 60*1000);
    }
}