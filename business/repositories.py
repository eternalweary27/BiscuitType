from .models import db
from werkzeug.security import check_password_hash
from sqlalchemy import desc

class AbstractRepository:
    def __init__(self, entity):
        self.entity = entity
        self.default_page = 1
        self.default_per_page = 20
    
    def isValidId(self, object_id):
        return object_id != None and object_id > 0
    
    def getById(self, object_id):
        if not self.isValidId(object_id):
            return -1
        return self.entity.query.filter_by(id=object_id).first()
    
    def deleteById(self, object_id):
        target_entity = self.getById(object_id)
        if target_entity == -1 or target_entity == None:
            return -1
        
        db.session.delete(target_entity)
        db.session.commit()
        return 0
    
    def add(self, **kwargs):
        try:
            new_entity = self.entity(**kwargs)
            db.session.add(new_entity)
            db.session.commit()
            return new_entity
        except:
            return -1
        
    def updateById(self, object_id, **kwargs):
        target_entity = self.getById(object_id)
        if target_entity == -1 or target_entity == None:
            return -1
        
        try:
            for key, value in kwargs.items():
                if hasattr(target_entity,key) and key != "id":
                    setattr(target_entity, key, value)
            db.session.commit()
            return 0
        except:
            return -1
    
    def rollBack(self):
        db.session.rollback()
    
    def getDefaultPaginationValues(self):
        default_pagination_values = {
            "page": self.default_page,
            "per_page": self.default_per_page
        }
        return default_pagination_values
        
class UserRepository(AbstractRepository):
    def __init__(self, entity):
        super().__init__(entity)
    
    def getByUserNameAndPassword(self, user_name, password):
        target_user = self.entity.query.filter_by(user_name=user_name).first()
        if target_user and check_password_hash(target_user.password, password):
            return target_user
        return None
    
    def getByUserName(self, user_name):
        return self.entity.query.filter_by(user_name=user_name).first()
    
    def getByUserNameAndEmail(self, user_name, email):
        return self.entity.query.filter_by(user_name=user_name, email=email).first()

class ScoreRepository(AbstractRepository):
    def __init__(self, entity):
        super().__init__(entity)
    
    def getByUserId(self, user_id):
        if not self.isValidId(user_id):
            return -1
        
        return self.entity.query.filter_by(user_id=user_id)
    
    def getByUserIdPaginated(self, user_id, page, per_page):
        page = page or self.default_page
        per_page = per_page or self.per_page
        all_records = self.getByUserId(user_id)
        if all_records == -1:
            return -1
        
        return all_records.paginate(page=page, per_page=per_page)
    
    def getScoresPaginated(self, filter_fields):
        page = filter_fields["page"] or self.default_page
        per_page = filter_fields["per_page"] or self.per_page
        user_name = filter_fields["user_name"]
        language = filter_fields["language"]
        difficulty = filter_fields["difficulty"]
        sort_by = filter_fields["sort_by"]

        try:
            query_obj = self.entity.query
            if user_name != "all":
                user_id = filter_fields["user_id"]
                query_obj = query_obj.filter_by(user_id = user_id)
            
            if language != "all":
                query_obj = query_obj.filter_by(game_language = language)
            
            if difficulty != "all":
                query_obj = query_obj.filter_by(game_difficulty = difficulty)
            
            if sort_by == "points":
                query_obj = query_obj.order_by(desc(self.entity.points))

            elif sort_by == "wpm":
                query_obj = query_obj.order_by(desc(self.entity.wpm))

            elif sort_by == "recent":
                query_obj = query_obj.order_by(desc(self.entity.game_date))
            
            total_pages = (query_obj.count() + per_page - 1) // per_page
            paginated_records = query_obj.paginate(page=page, per_page=per_page)

            return {"paginated_records":paginated_records, "total_pages":total_pages}
        except:
            return -1

class FeedbackRepository(AbstractRepository):
    def __init__(self, entity):
        super().__init__(entity)