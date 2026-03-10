const instruction_modal = document.getElementById("instruction_modal");
const intructionButton = document.getElementById("intruction_button");
const closeButton = document.getElementById("close");
const name_modal = document.getElementById("name_modal");
const closeUsername = document.getElementById('close_username');
const usernameButton = document.getElementById("username_button");

let timer
let logout = false;


intructionButton.addEventListener("click", () => {
    instruction_modal.style.display = "block";
});

closeButton.addEventListener("click", () => {
    instruction_modal.style.display = "none";
});

usernameButton.addEventListener("click", () => {
    closeUsername.style.display = "block"
    name_modal.style.display = "block";
});

closeUsername.addEventListener("click", () => {
    name_modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === instruction_modal) {
        instruction_modal.style.display = "none";
    }
});

document.addEventListener('DOMContentLoaded', () => {

    const textarea = document.getElementById('message');

    document.querySelectorAll("button, input, textarea").forEach(el => el.disabled = true);

    const hour = new Date().getHours();
    let message = "";

    if (hour > 7 && hour < 12) {
        message = "Καλημέρα 🌞! Ξεκίνα συζήτηση με το φυτό.";
    } else if (hour >= 12 && hour < 19) {
        message = "Καλησπέρα 🌿! Ξεκίνα συζήτηση με το φυτό.";
    } else if (hour >= 19 || hour >= 0) {
        message = "Γεια σου 🌙! Ξεκίνα συζήτηση με το φυτό.";
    }

    document.getElementById("welcome").textContent = message;

    timer = setTimeout(() => { inactivityPage() }, 2 * 60 * 1000);

    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });

    fetch('/check_new_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json())
        .then(data => {

            document.querySelectorAll("button, input, textarea").forEach(el => el.disabled = false);
            if (data.user) {
                instruction_modal.style.display = "block";
                localStorage.setItem('mood', data.mood);
                closeUsername.style.display = "none"
                name_modal.style.display = "block"
                localStorage.setItem('messages', data.messages)
                localStorage.setItem('session', data.session)


            } else {
                let username = localStorage.getItem('username');
                localStorage.setItem('messages', data.messages);
                let messages = Number(localStorage.getItem('messages'));
                localStorage.setItem('session', data.session);
                let session = Number(localStorage.getItem('session'));
                console.log("Messages: ", messages);

                if (!username) {
                    closeUsername.style.display = "none"
                    name_modal.style.display = "block"
                } else {
                    fetch('/send_name', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ "username": username })
                    })
                        .then(data => {
                            if (data.status === "error") {
                                alert("Δώσε έγκυρο όνομα σε ελληνικά ή λατινικά, χωρίς αριθμούς και κενά")
                                closeUsername.style.display = "none"
                                name_modal.style.display = "block"
                            }

                        }).catch(error => {
                            console.error("Error sending name: ", error);
                        });
                }
            }
        })
});


document.getElementById("send_name").addEventListener("click", function () {

    username = document.getElementById("username").value.trim();

    if (username != "") {


        fetch('/send_name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "username": username })
        })
            .then(response => response.json())
            .then(data => {

                if (data.status === "error") {
                    alert("Δώσε έγκυρο όνομα σε ελληνικά ή λατινικά")
                } else {
                    localStorage.setItem('username', username);
                    name_modal.style.display = "none";
                }
            }).catch(error => {
                console.error("Error sending name: ", error);

            });
    }
});


document.getElementById("send-to-llm").addEventListener("click", async function () {

    const button = document.getElementById("send-to-llm");
    const message_box = document.getElementById('message');

    if (message_box.value.trim() != "") {
        button.disabled = true;
        message_box.disabled = true
        const message = message_box.value;

        if (timer) clearTimeout(timer);

        try {
            const response = await fetch('/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                })
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                message_box.value = "";
                let messages = localStorage.getItem('messages');
                messages = parseInt(messages);
                messages++;
                localStorage.setItem('messages', messages);

            } else if (response.ok && data.status === 'refresh') {
                alert("Αποσυνδέθηκες. Συνδέσου πάλι");
                window.location.reload();
            } else if (response.ok && data.status === 'no_connection') {
                alert("No connection to Raspberry Pi");
            } else {
                console.error("Server error");
            }

        } catch (error) {
            console.error("Error: ", error)
        } finally {

            button.disabled = false;
            message_box.disabled = false;

            if (timer) clearTimeout(timer);
            timer = setTimeout(() => { inactivityPage() }, 2 * 60 * 1000);
        }
    }
})

document.getElementById("message").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        document.getElementById("send-to-llm").click();
    }
});

document.getElementById("message").addEventListener("input", function () {
    if (timer) clearTimeout(timer);
    console.log("Resetting timer");
    timer = setTimeout(() => { inactivityPage() }, 2 * 60 * 1000);
});

window.addEventListener('pageshow', function (event) {
    if (event.persisted) {

        window.location.reload();
    }
});

document.getElementById("spray_button").addEventListener("click", () => {

    const confirmed = confirm("Έχεις ψεκάσει το φυτό;");

    if (confirmed) {
        fetch("/spray_button", {
            method: "POST"
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    console.log("Spray command sent successfully");
                } else if (data.status === "no_connection") {
                    console.error("No connection to Raspberry Pi");
                }
            })
            .catch(error => {
                console.error("Error: ", error);
            });
    }

});

document.getElementById("logout").addEventListener("click", async function () {
    try {
        logout = true
        const response = await fetch('/logout');
        const result = await response.json();

        if (result.status === 'success') {
            window.location.href = '/exit';
        } else {
            console.error("Server error");
        }
    } catch (error) {
        console.log(error);
    }
});

async function inactivityPage() {
    console.log("Logging out due to inactivity");
    try {
        const response = await fetch('/logout');
        const result = await response.json();

        if (result.status === 'success') {
            window.location.href = '/inactivity';
        } else {
            alert("Δεν υπάρχει σύνδεση με τον server")
            console.error("Server error");
        }
    } catch (error) {
        console.log(error);
    }
}

async function inactivityPageServerLogout() {
    console.log("Logging out due to inactivity");
    try {

        window.location.href = '/inactivity';

    } catch (error) {
        console.log(error);
    }
}

document.addEventListener("visibilitychange", async function () {
    let userId = localStorage.getItem('user_id');

    if (document.visibilityState === "hidden" && !logout) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => { inactivityPageServerLogout() }, 1 * 30 * 1000);
        fetch('/to_logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
            })
        })
            .catch(err => console.error("Error:", err));
    } else if (document.visibilityState === "visible") {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => { inactivityPage() }, 2 * 60 * 1000);

        fetch('/reset_last_activity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
            })
        })
            .catch(err => console.error("Error:", err));

    }

});
