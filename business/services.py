from .models import User, Score, Feedback
from .repositories import UserRepository, ScoreRepository, FeedbackRepository
import smtplib
import ssl
from email.message import EmailMessage
import requests

class UserService:
    user_respository = UserRepository(User)
    score_repository = ScoreRepository(Score)

    def getByUserNameAndPassword(self, user_name, password):
        return self.user_respository.getByUserNameAndPassword(user_name, password)
    
    def getByUserName(self, user_name):
        return self.user_respository.getByUserName(user_name)
    
    def getByUserNameAndEmail(self, user_name, email):
        return self.user_respository.getByUserNameAndEmail(user_name, email)
    
    def updateById(self, object_id, **kwargs):
        return self.user_respository.updateById(object_id, **kwargs)
    
    def add(self, **kwargs):
        return self.user_respository.add(**kwargs)
    
    def deleteById(self, object_id):
        return self.user_respository.deleteById(object_id)

class ScoreService:
    score_repository = ScoreRepository(Score)
    user_repository = UserRepository(User)

    def add(self, **kwargs):
        return self.score_repository.add(**kwargs)
    
    def getByUserIdPaginated(self, user_id, page=None,per_page=None):
        return self.score_repository.getByUserIdPaginated(user_id, page, per_page)
    
    def getScoresPaginated(self, filter_fields):
        user_name = filter_fields["user_name"]
        if user_name != "all":
            if user_name == "Anonymous":
                user_id = None
            else:
                target_user = self.user_repository.getByUserName(user_name)
                user_id = target_user.id if target_user else -1
            filter_fields["user_id"] = user_id

        return self.score_repository.getScoresPaginated(filter_fields)
    
    def getDefaultPaginationValues(self):
        return self.score_repository.getDefaultPaginationValues()

class FeedbackService:
    feedback_repository = FeedbackRepository(Feedback)

    def add(self, **kwargs):
        return self.feedback_repository.add(**kwargs)

class EmailService:
    def __init__(self, sender_address, password):
        self.sender_address = sender_address
        self.password = password
    
    def sendEmail(self, receiver_address, subject, body):
        email_msg = EmailMessage()
        email_msg["From"] = self.sender_address
        email_msg["To"] = receiver_address
        email_msg["Subject"] = subject
        email_msg.set_content(body)
        context = ssl.create_default_context()

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(self.sender_address, self.password)
            server.sendmail(self.sender_address, receiver_address, email_msg.as_string())
            server.close()

class CountryService():
    def getCountry(self, ip_address):
        try:
            response = requests.get(f"http://ipinfo.io/{ip_address}/json")
            data = response.json()
            return data.get("country")
        except:
            return None

class PasswordService():
    min_length = 8
    check_arrays = [
        list("0123456789"),
        list("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
        list("abcdefghijklmnopqrstuvwxyz"),
        list("!@#$%^&*()_+-=[]{}|;':\",./<>?`~\\")
    ]

    def isStrongPassword(self, password):
        if len(password) < self.min_length:
            return False

        for arr in self.check_arrays:
            if not any([i in password for i in arr]):
                return False
        
        return True
