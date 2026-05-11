let userLoggedIn = false;
const logInOut_Proxy_URL = "https://gappscript-proxy.nss-gvpce-a.workers.dev/";
const logInAppScriptLink = "https://script.google.com/macros/s/AKfycbxLtDMInrMaQl2K5llhsqD0Ll--Y4J1QBeC-s8prCsrpNf6ykZiEBJjja_dzdPCQ8WV/exec";
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
let userID, user, sessionID;
const userIDInput   = $("userID");
const passwordInput = $("password");
const passwordEye   = $("passwordEye");

window.addEventListener("DOMContentLoaded", () => {
    updateEyeLocation();
    const footerHeight = document.querySelector("footer").clientHeight;
    document.documentElement.style.setProperty("--footerHeight", `${footerHeight}px`);

    const savedSession = sessionStorage.getItem("userLoggedIn");
    if (savedSession === "true") {
        pageReDirect("dashboard.html");
    }
});

window.addEventListener("resize", () => updateEyeLocation());

userIDInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") passwordInput.focus();
});

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

$("logInSubmit").addEventListener("click", () => logIn());

// setURL("Log In", "login");


function updateEyeLocation() {
    const passwordInput = document.getElementById("password");
    const passwordEye   = document.getElementById("passwordEye");
    if (!passwordInput || !passwordEye) return;
    const appearanceAdjustment = 2;
    document.documentElement.style.setProperty(
        "--passwordEyeBottom",
        `${passwordInput.clientHeight / 2 - passwordEye.clientHeight / 2 - appearanceAdjustment}px`
    );
};

function setMsg(id, html, colorVar) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = html;
    el.style.color = `var(--${colorVar}Color)`;
};

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
                userLoggedIn = true;
                sessionID    = generatedSessionID;
                userID       = inputUserID;
                user         = users[inputUserID];

                sessionStorage.setItem("sessionID", generatedSessionID);
                sessionStorage.setItem("userID", inputUserID);
                sessionStorage.setItem("userLoggedIn", "true");

                setTimeout(() => {
                    pageReDirect("dashboard.html");
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
};