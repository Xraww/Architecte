const form = document.getElementById("login-form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const userEmail = document.querySelector(`input[type="email"`).value;
    const userPassword = document.querySelector(`input[type="password"`).value;
    const errorMsg = document.querySelector(".submit-and-forget p");

    if (userEmail === "" || userPassword === "") {
        errorMsg.style.display = "block";
        return;
    } else {
        errorMsg.style.display = "none";

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: userEmail, password: userPassword})
        }).then((rep) => rep.json()).then((data) => {
            if (data.token !== undefined) {
                sessionStorage.setItem("token", data.token);
                window.location.href = "index.html";
            } else {
                errorMsg.style.display = "block";
            }
        });
    }
})