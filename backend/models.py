from backend import db
from sqlalchemy.sql.expression import func

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(140))
    done = db.Column(db.Boolean)
    index = db.Column(db.Integer)    
    
    def __init__(self, description):
        self.description = description
        self.done = False
        
        maxIndex = db.session.query(func.max(Task.index)).scalar()
        if maxIndex is None:
            self.index = 0
        else:
            self.index = maxIndex + 1         
    
    def json(self):
        '''
        JSON representation of Task
        '''        
        return {self.id: {
                'description': self.description,
                'index': self.index,
                'done': self.done}}
    