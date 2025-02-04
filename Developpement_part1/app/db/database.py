from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from flask_sqlalchemy import SQLAlchemy


engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SQLAlchemy()

