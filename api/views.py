from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import current_user, login_required
from business.services import ScoreService, CountryService, FeedbackService
from datetime import datetime

views = Blueprint("views", __name__);

score_service = ScoreService()
country_service = CountryService()
feedback_service = FeedbackService()

@views.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        feedback = request.form.get("feedback")
        feedback_category = request.form.get("feedback_category")
        feedback_date = datetime.now()
        if feedback:
            return_value = feedback_service.add(text=feedback, category=feedback_category, date=feedback_date)
            if return_value == -1:
                flash("Server Error", category="error")
            else:
                flash("Feedback Successfully Submitted", category="success")

    return render_template("home.html", user=current_user)

@views.route("/game", methods=["GET"])
def game():
    return render_template("game.html", user=current_user)

@views.route("/user/score", methods=["POST"])
def saveScore():
    points = int(request.form.get("points"))
    wpm = round(float(request.form.get("wpm")),2)
    game_language = request.form.get("game_language")
    game_difficulty = request.form.get("game_difficulty")
    game_date = datetime.now()
    country = None
    if not current_user.is_authenticated:
        country = country_service.getCountry(request.headers.get("X-Forwarded-For", request.remote_addr))
    user_id = current_user.id if current_user.is_authenticated else None
    
    return_value = score_service.add(points=points, wpm=wpm, game_language=game_language, game_difficulty=game_difficulty, game_date=game_date, country=country, user_id=user_id)
    if return_value == -1:
        return jsonify({"error": "Server Error"}), 500
    else:
        return jsonify({"data": "Score Saved Successfully"}), 200

def convertToEmoji(country_code):
    OFFSET = 127397
    return ''.join(chr(ord(char) + OFFSET) for char in country_code.upper())

def convertToDisplayLanguage(language):
    display_language = {
        "english": "English",
        "french": "Français",
        "german": "Deutsch",
        "spanish": "Español",
        "finnish": "Finnish"
    }

    return display_language[language]

@views.route("/leaderboards", methods=["GET"])
def leaderBoards():
    default_pagination_values = score_service.getDefaultPaginationValues()
    page = int(request.args.get("page") or default_pagination_values["page"])
    per_page = int(request.args.get("per_page") or default_pagination_values["per_page"])

    user_settings = dict()
    user_settings["default_language"] = current_user.default_language if current_user.is_authenticated else "all"
    user_settings["default_difficulty"] = current_user.default_difficulty if current_user.is_authenticated else "medium"
    filter_fields = {
        "page":page,
        "per_page": per_page,
        "user_name":  request.args.get("user_name") or "all",
        "language": request.args.get("language") or user_settings["default_language"],
        "difficulty": request.args.get("difficulty") or user_settings["default_difficulty"],
        "sort_by": request.args.get("sort_by") or "points"
    }

    score_records = []
    total_pages = 0
    response = score_service.getScoresPaginated(filter_fields)
    if response == -1:
        flash("Server Error", category="error")
    else:
        score_records_paginated = response["paginated_records"]
        total_pages = response["total_pages"]
        for index, score_record in enumerate(score_records_paginated.items):
            score_record_json = {
                "rank": ((page-1)*per_page) + index + 1,
                "user_name": getattr(score_record.user, "user_name", "Anonymous"),
                "points": score_record.points,
                "wpm": score_record.wpm,
                "language": convertToDisplayLanguage(score_record.game_language),
                "difficulty": score_record.game_difficulty.capitalize(),
                "country_emoji": convertToEmoji(score_record.country) if score_record.country else "",
                "date": score_record.game_date.strftime("%Y-%m-%d"),
                "is_current_user": (current_user.id == getattr(score_record.user, "id", -1)) if current_user.is_authenticated else False
            }
            score_records.append(score_record_json)

    return render_template("leaderboards.html", user=current_user, user_settings=user_settings, score_records=score_records, page=page, per_page=per_page, total_pages=total_pages)

@views.route("/stats", methods=["GET"])
@login_required
def stats():
    language = request.args.get("language") or current_user.default_language
    difficulty = request.args.get("difficulty") or current_user.default_difficulty
    time = request.args.get("time") or "100"

    user_stats = dict()
    user_scores = current_user.scores

    if language != "all":
        user_scores = [score for score in user_scores if score.game_language == language]
    
    if difficulty != "all":
        user_scores = [score for score in user_scores if score.game_difficulty == difficulty]
    
    if time != "all":
        time_int = int(time)
        user_scores = user_scores[-time_int:]

    total_scores = len(user_scores)
    user_stats["all_points"] = [score.points for score in user_scores]
    user_stats["all_wpm"] = [score.wpm for score in user_scores]
    user_stats["avg_points"] = round(sum(user_stats["all_points"]) / total_scores, 2) if total_scores > 0 else 0
    user_stats["avg_wpm"] = round(sum(user_stats["all_wpm"]) / total_scores, 2) if total_scores > 0 else 0
    user_stats["highest_points"] = max(user_scores, key=lambda item: item.points).points if total_scores > 0 else 0
    user_stats["highest_wpm"] = max(user_scores, key=lambda item: item.wpm).wpm if total_scores > 0 else 0
    user_stats["default_language"] = current_user.default_language
    user_stats["default_difficulty"] = current_user.default_difficulty

    return render_template("stats.html", user=current_user, user_stats=user_stats)
