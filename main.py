from fastapi import FastAPI, Request
from .database import engine
from .models import Base
from .routers import auth, seller,buyer
from  fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

Base.metadata.create_all(bind=engine)  
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/dashboard")
def home(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})


app.include_router(auth.router)
app.include_router(seller.router)
app.include_router(buyer.router)