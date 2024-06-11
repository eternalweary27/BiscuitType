const password_input_1 = document.getElementById("password_input_1");
const password_input_2 = document.getElementById("password_input_2");
const show_password_checkbox = document.getElementById("show_password_checkbox");
const numbers_check = document.getElementById("numbers_check");
const lowercase_check = document.getElementById("lowercase_check");
const uppercase_check = document.getElementById("uppercase_check");
const special_check = document.getElementById("special_check");
const length_check = document.getElementById("length_check");
const match_check = document.getElementById("match_check");

const NUMBERS = "0123456789".split("");
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz".split("");
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const SPECIAL =  "!@#$%^&*()_+-=[]{}|;':\",./<>?`~\\".split("");

function updateHiddenField(value, element, array){
    element.hidden = !array.some(x => value.includes(x));
}

password_input_1.addEventListener("input", function(){
    let password_value = password_input_1.value;

    updateHiddenField(password_value, numbers_check, NUMBERS);
    updateHiddenField(password_value, lowercase_check, LOWERCASE);
    updateHiddenField(password_value, uppercase_check, UPPERCASE);
    updateHiddenField(password_value, special_check, SPECIAL);
    length_check.hidden = password_value.length < 8;
    match_check.hidden = !(password_value == password_input_2.value && password_value != "");
});

password_input_2.addEventListener("input", function(){
    match_check.hidden = !(password_input_1.value == password_input_2.value && password_input_1.value != "");
})

show_password_checkbox.addEventListener("click", function(){
    password_input_1.type = show_password_checkbox.checked ? "text" : "password";
    password_input_2.type = password_input_1.type;
});