document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;
    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";

    if (nameValue.length < 2) {
      nameError.textContent = "A névnek legalább 2 karakterből kell állnia!";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      emailError.textContent = "Kérlek, érvényes email címet adj meg!";
      isValid = false;
    }

    const hasLetter = /[a-zA-Z]/.test(passwordValue);
    const hasNumber = /[0-9]/.test(passwordValue);
    if (passwordValue.length < 4 || !hasLetter || !hasNumber) {
      passwordError.textContent = "A jelszónak legalább 4 karakterből kell állnia, és tartalmaznia kell betűt ÉS számot!";
      isValid = false;
    }

    if (isValid) {
        const formData = new FormData();
        formData.append('first_name', nameInput.value);
        formData.append('email', emailInput.value);
        formData.append('password', passwordInput.value);
        
        fetch('/regisztracio.html/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect;
            } else if (data.error) {
                console.error('Server error:', data.error);
                alert(data.error);
            }
        })
        .catch(error => {
            console.error('Network error:', error);
            alert('Hiba történt a regisztráció során. Kérlek, próbáld újra!');
        });
    }
  });
});
