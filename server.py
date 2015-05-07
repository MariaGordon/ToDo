#/usr/bin/python3
import os
from backend import app, db

db.create_all()
app.run(port=int(os.environ.get("PORT",3000)), debug=True)