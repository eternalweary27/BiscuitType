const privacy_policy_cookie_name = "seen_privacy_policy";
const privacy_policy_modal_agree_button = document.getElementById("privacy_policy_modal_agree");

function setCookie(cookie_name, cookie_val, lifespan_hours=null){
    let expire_time_str;
    if (lifespan_hours){
        let expire_time = new Date(Date.now() + (lifespan_hours * 3600 * 1000));
        expire_time_str = expire_time.toUTCString();
    }else{
        let default_expire_hours = 1;
        let default_expire_time = new Date(Date.now() + (default_expire_hours * 3600 * 1000));
        expire_time_str = default_expire_time.toUTCString();
    }
    document.cookie = `${cookie_name}=${cookie_val};expires=${expire_time_str};path='/';SameSite=Strict`
}

function getCookie(cookie_name){
    let cookie_arr = document.cookie.split(";");
    for(var cookie of cookie_arr){
        let fields = cookie.split("=");
        if (fields.length < 2){
            continue;
        }
        
        if (fields[0].trim() == cookie_name){
            return fields[1];
        }
    }
    return null;
}

function clearAllCookies(){
    let cookie_arr = document.cookie.split(";");
    for(var cookie of cookie_arr){
        let fields = cookie.split("=");
        let cookie_name = fields.length > 2 ? fields[0] : cookie;
        document.cookie = cookie_name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None";
    }
}

function renderModal(){
    let privacy_policy_seen = getCookie(privacy_policy_cookie_name);
    if (!privacy_policy_seen){
        let privacy_policy_modal = new bootstrap.Modal(document.getElementById("privacy_policy_modal"));
        privacy_policy_modal.show();
    }
}

privacy_policy_modal_agree_button.addEventListener("click", function(){
    setCookie(privacy_policy_cookie_name, true, 24*365*100);
});

renderModal();
