from backend import db
from sqlalchemy.sql.expression import func

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(140))
    done = db.Column(db.Boolean)
    # Singly linked list, pointing to next ID
    next = db.Column(db.Integer)
    # First tells the task is the fist in the linked list 
    first = db.Column(db.Boolean)
    
    def __init__(self, description, first):
        self.description = description
        self.done = False
        self.next = None       
        self.first = first
    
    def json(self):
        '''
        JSON representation of Task
        '''        
        return {'id': self.id,
                'description': self.description,
                'next': self.next,
                'first': self.first,
                'done': self.done}
    