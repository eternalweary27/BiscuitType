const language_selection = document.getElementById("language_selection");
const difficulty_selection = document.getElementById("difficulty_selection");
const music_volume = document.getElementById("music_volume");
const ding_volume = document.getElementById("ding_volume");
const account_username = document.getElementById("account_username");
const account_email = document.getElementById("account_email");
const email_help_message = document.getElementById("email_help_message");
const change_password_button = document.getElementById("change_password_button");
const delete_modal_title = document.getElementById("delete_modal_title");
const delete_account_button = document.getElementById("delete_account_button");
const delete_account_confirmation_button = document.getElementById("delete_account_confirmation_button");

language_selection.value = user_settings.default_language;
difficulty_selection.value = user_settings.default_difficulty;
music_volume.value = user_settings.music_volume;
ding_volume.value = user_settings.ding_volume;
account_username.value = user_settings.user_name;
account_email.value = user_settings.email;
email_help_message.hidden = account_email.value != "";

change_password_button.addEventListener("click", function(){
    let change_password_url = `${window.location.origin}/change-password`;
    window.location.href = change_password_url;
});

delete_account_button.addEventListener("click", function(){
    delete_modal_title.innerText = `Delete: ${user_settings.user_name}`;
    let delete_account_modal = new bootstrap.Modal(document.getElementById("delete_account_modal"));
    delete_account_modal.show();
});

delete_account_confirmation_button.addEventListener("click", async function(){
    let delete_account_api_url = `${window.location.origin}/user/delete`;
    let delete_account_response = await fetch(delete_account_api_url, {method:"DELETE"});

    if(!delete_account_response.ok){
        throw new Error("Failed to Delete Account");
    }

    window.location.href = `${window.location.origin}/`;
});