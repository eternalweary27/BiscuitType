from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify, session
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash
from business.services import UserService, EmailService, PasswordService
import traceback
import random
import os
from datetime import datetime

auth = Blueprint("auth", __name__)

user_service = UserService()
email_service = EmailService(None, None)
password_service = PasswordService()
CODE_EXPIRY = 60*1

def requiredDataEntered(required_data):
    for data in required_data:
        if data == "" or data == None:
            flash("Please Enter All Required Data", category="error")
            return False
    return True

@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user_name = request.form.get("user_name")
        password = request.form.get("password")
        required_data = [user_name, password]

        if requiredDataEntered(required_data):
            try:
                target_user = user_service.getByUserNameAndPassword(user_name, password)
                if target_user == None:
                    flash("Invalid Login, User Not Found", category="error")
                else:
                    login_user(target_user, remember=True)
                    flash(f"Logged in as {target_user.user_name}", category="success")
                    return redirect(url_for("views.home"))
            except:
                flash("Server Error", category="error")
                traceback.print_exc()

    return render_template("login.html", user=current_user)

@auth.route("/logout")
@login_required
def logout():
    try:
        logout_user()
        flash("Logged Out Successfully", category="success")
        return redirect(url_for("auth.login")) 
    except:
        flash("Logout failed", category="error")
        return redirect(url_for("views.home"))

@auth.route("/forgot-password", methods=["GET", "POST"])
def forgotPassword():
    if request.method == "POST":
        user_name = request.form.get("user_name")
        email = request.form.get("email")
        required_data = [user_name, email]
        session["email"] = email

        if requiredDataEntered(required_data):
            target_user = user_service.getByUserNameAndEmail(user_name, email)
            if target_user == None:
                flash("Invalid Credentials, User Not Found", category="error")

            else:
                session["user_id"] = target_user.id
                try:
                    sendResetCodeEmail(email)
                    hidden_email = email[0:3] + "***" + email[email.index("@"):]
                    flash(f"Reset Code sent to {hidden_email}", category="success")
                    return redirect(url_for("auth.resetCode"))
                except:
                    flash("Server Error", category="error")
                    traceback.print_exc()

    return render_template("forgot_password.html", user=current_user)

def sendResetCodeEmail(email):
    subject = "Biscuit Type Password Reset Code"
    random_code = "".join([str(random.randint(0,9)) for i in range(6)])
    body = f"Please use the following code to reset your password: {random_code}"
    email_service.sendEmail(email, subject, body)
    session["reset_code"] = random_code
    session["reset_code_start_time"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

@auth.route("/reset-code", methods=["GET", "POST"])
def resetCode():
    email = session["email"]

    if request.method == "POST":
        input_reset_code = request.form.get("reset_code")
        resend_code = request.form.get("resend_code")
        if input_reset_code == None and resend_code:
            try:
                sendResetCodeEmail(email)
                hidden_email = email[0:3] + "***" + email[email.index("@"):]
                flash(f"Reset Code resent to {hidden_email}", category="success")
            except:
                flash("Server Error", category="error")
                traceback.print_exc()
        else:
            reset_code = session["reset_code"]
            if input_reset_code == reset_code:
                reset_code_start_time =  datetime.strptime(session["reset_code_start_time"], "%Y-%m-%d %H:%M:%S")
                time_elapsed = datetime.now() - reset_code_start_time
                if time_elapsed.seconds > CODE_EXPIRY:
                    flash("Reset Code Expired, Please Resend New Code", category="error")
                else:
                    session.pop("reset_code", None)
                    session.pop("reset_code_start_time", None)
                    flash("Passcode Confirmed, You can Change your Password Now", category="success")
                    return redirect(url_for("auth.resetPassword"))
            else:
                flash("Incorrect Passcode", category="error")

    return render_template("reset_code.html", user=current_user)

def validPasswords(password_1, password_2):
    if password_1 != password_2:
        flash("Passwords do not Match", category="error")
        return False
        
    elif not password_service.isStrongPassword(password_1):
        flash("Password does not meet Requirements", category="error")
        return False
    
    return True

@auth.route("/reset-password", methods=["GET", "POST"])
def resetPassword():
    user_id = session["user_id"]
    if request.method == "POST":
        password_1 = request.form.get("password_1")
        password_2 = request.form.get("password_2")
        required_data = [password_1, password_2]

        successful_password_entry = requiredDataEntered(required_data) and validPasswords(password_1, password_2)
        if successful_password_entry:
            hashed_password = generate_password_hash(password_1, "sha256")
            return_value = user_service.updateById(user_id, password=hashed_password)
            if return_value == -1:
                flash("Server Error", category="error")
            else:
                flash("Password Successfully updated", category="success")
                return redirect(url_for("auth.login"))

    return render_template("reset_password.html", user=current_user)

@auth.route("/sign-up", methods=["GET", "POST"])
def signUp():
    if request.method == "POST":
        user_name = request.form.get("user_name")
        password_1 = request.form.get("password_1")
        password_2 = request.form.get("password_2")
        email = request.form.get("email")
        required_data = [user_name, password_1, password_2]

        if requiredDataEntered(required_data):
            user_name_taken = user_service.getByUserName(user_name) != None
            if user_name_taken:
                flash("User-Name is Taken", category="error")

            elif validPasswords(password_1, password_2):
                hashed_password = generate_password_hash(password_1, "sha256")
                return_value = user_service.add(user_name=user_name, password=hashed_password, email=email)
                if return_value == -1:
                    flash("Server Error", category="error")
                else:
                    login_user(return_value,remember=True, force=True)
                    flash(f"Account Created Successfully, Logged in as {user_name}", category="success")
                    return redirect(url_for("views.home"))

    return render_template("sign_up.html", user=current_user)

@auth.route("/settings", methods=["GET", "POST"])
@login_required
def settings():
    if request.method == "POST":
        default_language = request.form.get("language_selection")
        default_difficulty = request.form.get("difficulty_selection")
        music_volume = request.form.get("music_volume")
        ding_volume = request.form.get("ding_volume")
        email = request.form.get("account_email")

        return_value = user_service.updateById(current_user.id, email=email, default_language = default_language, default_difficulty=default_difficulty, music_volume=music_volume, ding_volume=ding_volume);
        if return_value == -1:
            flash("Server Error", category="error")
        else:
            flash("Settings Updated", category="success")

    user_settings = {
        "user_name": current_user.user_name,
        "email": current_user.email,
        "default_language": current_user.default_language,
        "default_difficulty": current_user.default_difficulty,
        "music_volume": current_user.music_volume,
        "ding_volume": current_user.ding_volume
    }

    return render_template("settings.html", user=current_user, user_settings=user_settings)

@auth.route("/user/settings", methods=["GET"])
def getUserSettings():
    if current_user.is_authenticated:
        default_language = current_user.default_language
        default_difficulty = current_user.default_difficulty
        music_volume =  current_user.music_volume
        ding_volume = current_user.ding_volume
    else:
        default_language = "english"
        default_difficulty = "medium"
        music_volume =  0.4
        ding_volume = 0.4

    user_settings = {
        "default_language": default_language,
        "default_difficulty": default_difficulty,
        "music_volume": music_volume,
        "ding_volume": ding_volume,
    }

    return jsonify({"data": user_settings}), 200

@auth.route("/change-password", methods=["GET", "POST"])
@login_required
def changePassword():
    if request.method == "POST":
        old_password = request.form.get("old_password")
        password_1 = request.form.get("password_1")
        password_2 = request.form.get("password_2")
        required_data = [old_password, password_1, password_2]

        if requiredDataEntered(required_data) and validPasswords(password_1, password_2):
            target_user = user_service.getByUserNameAndPassword(current_user.user_name, old_password)
            if target_user == None:
                flash("Incorrect Old Password", category="error")
            else:
                hashed_password = generate_password_hash(password_1, "sha256")
                return_value = user_service.updateById(current_user.id, password=hashed_password)
                if return_value == -1:
                    flash("Server Error", category="error")
                else:
                    flash("Password Updated", category="success")
                    return redirect(url_for("auth.settings"))

    return render_template("change_password.html", user=current_user)

@auth.route("/user/delete", methods=["DELETE"])
@login_required
def deleteUser():
    if not current_user.is_authenticated:
        return jsonify({"error": "User is Not Logged In"}), 400
    
    user_id = current_user.id
    logout_user()
    return_value = user_service.deleteById(user_id)
    if return_value == -1:
        flash("Server Error", category="error")
        return jsonify({"error": "Server Error"}), 500
    
    flash("Account Deleted Successfully", category="success")
    return jsonify({"data": "Delete Successful"}), 200
