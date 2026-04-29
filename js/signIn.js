function pageRender() {
    const signInMain = document.getElementById("signIn");
    if (!userLoggedIn) {
        const signInForm = document.createElement("div");
        signInForm.id = "signInForm";
        signInForm.className = "signInForm";
        signInForm.innerHTML = `
        <div>
            <h2 class="formTitle">CMS of Events</h2>
            <p>Sign In to update events</p>
        </div>`;

        const userIdField = document.createElement("div");
        userIdField.className = "formField";
        const userIdLabel = document.createElement("label");
        userIdLabel.innerHTML = "User ID";
        const userIdInput = document.createElement("input");
        userIdInput.type = "text";
        userIdInput.id = "userId";
        userIdInput.placeholder = "Enter your user ID";
        userIdInput.autocomplete = 'off';

        userIdField.appendChild(userIdLabel);
        userIdField.appendChild(userIdInput);
        userIdInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") passwordInput.focus();
        });

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

        const passwordEye = document.createElement('i');
        passwordEye.id = "passwordEye";
        passwordEye.className = "fa-solid fa-eye";
        passwordEye.addEventListener("click", () => {
            const passwordInputElement = document.getElementById("password");
            const passwordEyeElement = document.getElementById("passwordEye");
            if (passwordInputElement.type === "password") {
                passwordEyeElement.classList.replace("fa-eye", "fa-eye-slash");
                passwordInputElement.type = "text";
                console.log(passwordEyeElement, "password");
            } else {
                passwordEyeElement.classList.replace("fa-eye-slash", "fa-eye");
                passwordInputElement.type = "password";
                console.log(passwordEyeElement, "text");
                
            }
        })

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
        messageText.innerHTML = "&nbsp;"

        const submit = document.createElement("button");
        submit.id = "signInSubmit";
        submit.className = "signInSubmit";
        submit.innerHTML = "Submit";
        submit.addEventListener("click", ()=> {
            signIn();
        });
        
        message_button_container.appendChild(messageText);
        message_button_container.appendChild(submit)
        
        signInForm.appendChild(userIdField);
        signInForm.appendChild(passwordField);
        signInForm.appendChild(message_button_container)
        signInMain.appendChild(signInForm);
    } else {

    }
}
function signIn() {
    const userID = $("userId").value.toLowerCase().trim();
    const password = $("password").value;
    $("signInMessageText").innerHTML = ``
    if (!userID || !password) {
        $("signInMessageText").innerHTML = `Please enter both fields !!`;
        $("signInMessageText").style.color = "var(--accent1Color)";
        return;
    }
    if (!Object.keys(users).includes(userID)) {
        $("signInMessageText").innerHTML = `${userID} is not a valid User ID !!`;
        $("signInMessageText").style.color = "var(--accent1Color)";
        $("userId").value = "";
        $("password").value = "";
        return;
    } else {
        $("signInMessageText").style.color = "var(--accent2Color)";
        let count = 0;
        setInterval(()=> {
            if (count === 0) {
                $("signInMessageText").innerHTML = "Verfiying.";
            } else if (count === 1) {
                $("signInMessageText").innerHTML = "Verfiying..";
            } else {
                $("signInMessageText").innerHTML = "Verfiying...";
                count = -1;
            }
            count++;
        }, 400);

        console.log(userID, password);
        console.log(users);
    }
}

let userLoggedIn = false;
const $ = id => document.getElementById(id);
const users = {
    chairman: "Dr. A. B. Koteshwara Rao Sir",
    unit_1PO: "Dr. Sateesh Virothu Sir",
    unit_2PO: "Dr. T. S. Vamsi Krishna Sir",
    unit_1President: "Unit-1 Student President",
    unit_2President: "Unit-2 Student President",
    nsswebhandler: "Webhandler",
    author: "Lokesh Anand Varma"
}

window.addEventListener("DOMContentLoaded", ()=> {
    const footerHeight = document.querySelector("footer").clientHeight;
    document.documentElement.style.setProperty("--footerHeight", `${footerHeight}px`);

    pageRender();
    const passwordInputHeight = document.getElementById("password").clientHeight;
    const passwordEyeHeight = document.getElementById("passwordEye").clientHeight;
    const appearanceAdjustment = 2;
    document.documentElement.style.setProperty("--passwordEyeBottom", `${passwordInputHeight/2 - passwordEyeHeight/2 - appearanceAdjustment}px`);
});
document.addEventListener("resize", ()=> {
    const passwordInputHeight = document.getElementById("password").clientHeight;
    const passwordEyeHeight = document.getElementById("passwordEye").clientHeight;
    const appearanceAdjustment = 2;
    document.documentElement.style.setProperty("--passwordEyeBottom", `${passwordInputHeight/2 - passwordEyeHeight/2 - appearanceAdjustment}px`);
})