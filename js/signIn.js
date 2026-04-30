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

        // ✅ keydown on userIDInput defined AFTER passwordInput exists
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
    }

    // ✅ moved outside else block — cleaner
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

        const rawText = await response.text(); // ✅ read as text first for safe debugging
        console.log("Raw response:", rawText);
        const data = JSON.parse(rawText);

        clearInterval(verifyingInterval);

        if (data.auth) {
            $("signInMessageText").innerHTML = "Login Successful!";
            $("signInMessageText").style.color = "var(--accent2Color)";

            // ✅ set sessionStorage BEFORE setTimeout so refresh during delay still works
            sessionStorage.setItem("sessionID", generatedSessionID);
            sessionStorage.setItem("userID", inputUserID);
            sessionStorage.setItem("userLoggedIn", "true");

            setTimeout(() => {
                userLoggedIn = true;
                sessionID = generatedSessionID;
                userID = inputUserID;
                user = users[inputUserID];
                pageRender();
            }, 1000);

        } else {
            $("signInMessageText").innerHTML = "Wrong password! Try Again";
            $("signInMessageText").style.color = "var(--accent1Color)";
            $("password").value = ""; // ✅ clear password on wrong attempt
        }
    } catch (err) {
        clearInterval(verifyingInterval);
        console.error("Fetch error:", err);
        $("signInMessageText").innerHTML = "Connection error. Try again.";
        $("signInMessageText").style.color = "var(--accent1Color)";
    }
}

async function signOut(inputStatus) {
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

    // ✅ always log out locally regardless of server response
    userLoggedIn = false;
    userID = undefined;
    user = undefined;
    sessionID = undefined;
    clearSession();
    pageRender(); // ✅ moved after clearSession
}

function updateEyeLocation() {
    const passwordInput = document.getElementById("password");
    const passwordEye = document.getElementById("passwordEye");
    if (!passwordInput || !passwordEye) return; // ✅ guard if elements don't exist
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
const logInOut_Proxy_URL = "https://gappscript-proxy.nss-gvpce-a.workers.dev/";

window.addEventListener("DOMContentLoaded", () => {
    const footerHeight = document.querySelector("footer").clientHeight;
    document.documentElement.style.setProperty("--footerHeight", `${footerHeight}px`);

    const savedSession = sessionStorage.getItem("userLoggedIn");
    console.log(savedSession);
    if (savedSession === "true") {
        sessionID = sessionStorage.getItem("sessionID");
        userID = sessionStorage.getItem("userID");
        user = users[userID];
        userLoggedIn = true;
    }
    pageRender();
});

window.addEventListener("resize", () => { // ✅ window not document for resize
    updateEyeLocation();
});

window.addEventListener("beforeunload", () => {
    if (userLoggedIn) {
        const data = JSON.stringify({
            action: "logOut",
            sessionID: sessionID,           // ✅ outer let, not generatedSessionID
            userID: userID,
            status: "abrupt_close"
        });
        navigator.sendBeacon(logInOut_Proxy_URL, data); // ✅ correct URL var
        clearSession();
    }
});