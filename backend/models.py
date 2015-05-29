from backend import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(140), index=True, unique=True)
    done = db.Column(db.Boolean, index=True)
    previous = db.Column(db.Integer, index=True)
    
    def json(self):
        '''
        JSON representation of Task
        '''        
        return {self.id: {
                'previous': self.previous,
                'description': self.description,
                'done': self.done}}
    