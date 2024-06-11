const password_input = document.getElementById("password_input");
const show_password_checkbox = document.getElementById("show_password_checkbox");
const forgotten_password_button = document.getElementById("forgotten_password_button");

show_password_checkbox.addEventListener("click", function(){
    password_input.type = show_password_checkbox.checked ? "text" : "password";
});

forgotten_password_button.addEventListener("click", function(){
    let reset_page_url = `${window.location.origin}/forgot-password`;
    window.location.href = reset_page_url;
});