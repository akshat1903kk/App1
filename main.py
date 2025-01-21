from fastapi import FastAPI
from .database import engine
from .models import Base
from .routers import auth, seller,buyer

app = FastAPI()

Base.metadata.create_all(bind=engine)  

app.include_router(auth.router)
app.include_router(seller.router)
app.include_router(buyer.router)