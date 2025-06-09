document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  document.getElementById("login-button").addEventListener("click", (e) => {
    e.preventDefault();

    let isValid = true;
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    emailError.textContent = "";
    passwordError.textContent = "";

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

      fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: new URLSearchParams({
          email: emailValue,
          password: passwordValue
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Hibás válasz a szervertől');
        }
        return response.json();
      })
      .then(data => {
        if (data.redirect) {
          window.location.href = data.redirect;
        } else if (data.error) {
          emailError.textContent = data.error;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        emailError.textContent = 'Hibás email vagy jelszó!';
      });
    }
  });
});




function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
      const emailValue = emailInput.value.trim();
      const passwordValue = passwordInput.value;

      nameError.textContent = "";
      emailError.textContent = "";
      passwordError.textContent = "";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailValue)) {
        emailError.textContent = "Kérlek, érvényes email címet adj meg!";
        isValid = false;
      }

      const hasLetter = /[a-zA-Z]/.test(passwordValue);
      const hasNumber = /[0-9]/.test(passwordValue);
      if (passwordValue.length < 4 || !hasLetter || !hasNumber) {
        passwordError.textContent = "A jelszónak legalább 4 karakterből kell állnia, és tartalmaznia kell betűt és számot!";
        isValid = false;
      }
      if (isValid) {
        window.location.href = "bejelentkezes.html";
      }
  
