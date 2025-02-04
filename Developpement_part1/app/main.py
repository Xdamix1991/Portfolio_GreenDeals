from db.database import db, engine
from Models import User, Deal


print("table creation....")
db.create_all()
print("table created")
