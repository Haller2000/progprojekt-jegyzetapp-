document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  document.addEventListener("submit", (e) => {
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
      window.location.href = "index.html";
    }
  });
});


