const sort_by_dropdown_menu = document.getElementById("sort_by_dropdown_menu");
const user_name_filter = document.getElementById("user_name_filter");
const language_filter = document.getElementById("language_filter");
const difficulty_filter = document.getElementById("difficulty_filter");
const previous_page_link = document.getElementById("previous_page_link");
const next_page_link = document.getElementById("next_page_link");

function populateFromURL(){
    let url_params = new URLSearchParams(window.location.search);
    let url_user_name = url_params.get("user_name");
    let url_language = url_params.get("language") ?? user_settings.default_language;
    let url_difficulty = url_params.get("difficulty") ?? user_settings.default_difficulty;
    user_name_filter.value = url_user_name;
    language_filter.value = url_language;
    difficulty_filter.value = url_difficulty;
}

function setNewURL(url_params){
    let new_url = window.location.origin + window.location.pathname + "?" + url_params.toString();
    window.location.href = new_url;
}

function updatePageValue(new_page_value){
    if(new_page_value < 1 || new_page_value > total_pages){
        return;
    }

    let url_params = new URLSearchParams(window.location.search);
    url_params.set("page", new_page_value);
    setNewURL(url_params);
}

sort_by_dropdown_menu.addEventListener("click", function(event){
    let sort_by_value = event.target.getAttribute("data-value");
    let url_params = new URLSearchParams(window.location.search);
    url_params.set("user_name", user_name_filter.value ? user_name_filter.value : "all");
    url_params.set("language", language_filter.value);
    url_params.set("difficulty", difficulty_filter.value);
    url_params.set("sort_by", sort_by_value);
    url_params.set("page", 1);
    setNewURL(url_params);
});


previous_page_link?.addEventListener("click", function(){
    updatePageValue(current_page-1);
});

next_page_link?.addEventListener("click", function(){
    updatePageValue(current_page+1);
});

populateFromURL();