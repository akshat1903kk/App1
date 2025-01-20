from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base


databse_url = "sqlite:///./App.db"
engine = create_engine(databse_url, connect_args={"check_same_thread": False})
SessionLocal = Session(bind=engine)
Base = declarative_base()