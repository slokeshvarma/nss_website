
const params = new URLSearchParams({
            action: "logIn",
            sessionID: sessionID,
            userId: userID,
            password: password
        });

    const response = await fetch(`${GAppScript}?${params}`);