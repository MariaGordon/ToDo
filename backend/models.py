from backend import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(140), index=True, unique=True)
    done = db.Column(db.Boolean, index=True)
    
    def json(self):
        '''
        JSON representation of Task
        '''
        return {self.id: {
                'description': self.description,
                'done': self.done}}
    