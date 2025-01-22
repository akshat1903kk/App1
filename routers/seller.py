from fastapi import APIRouter, Depends, HTTPException, status, Request
from ..models import Item
from .auth import db_dependency, get_current_user
from pydantic import BaseModel
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

router = APIRouter(
    prefix='/seller',
    tags=['seller'],
)

# Request model to create items
class ItemRequest(BaseModel):
    title: str
    description: str

# Setup Jinja2 Templates directory
templates = Jinja2Templates(directory='templates')

# Mount static files directory (CSS, JS, Images)
router.mount("/static", StaticFiles(directory="static"), name="static")

# Route to render seller form page (create_item page)
@router.get('/')
async def seller_page(request: Request):
    return templates.TemplateResponse('seller.html', {'request': request})

# Route to handle item creation for sellers
@router.post('/create_item')
async def create_item(item: ItemRequest, 
                      db: db_dependency, 
                      current_user: dict = Depends(get_current_user)):  
    # Check user role, only sellers can add items
    if current_user['user_role'] != "User":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="You are not authorized to create an item"
        )

    # Create a new item entry in the database
    new_item = Item(**item.model_dump())  # Use dict() method instead of model_dump()
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item
