from fastapi import APIRouter, Depends, HTTPException, status , Request
from ..models import Item
from .auth import db_dependency, get_current_user
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

router = APIRouter(prefix='/buyer', 
                   tags=['buyer'])

templates = Jinja2Templates(directory='templates')

@router.get('/')
async def buy_item(request: Request):
    return templates.TemplateResponse('buyer.html', {'request': request})

@router.get('/items')
async def get_items(db: db_dependency):
    items = db.query(Item).all()
    return items

router.mount("/static", StaticFiles(directory="static"), name="static")
@router.post('/buy_item/{item_id}')

async def buy_item(item_id: int, db: db_dependency, current_user: dict = Depends(get_current_user)):
    if current_user['user_role'] != "Admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="You are not authorized to buy an item"
        )

    # Get the item
    item = db.query(Item).filter(Item.id == item_id).first()
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Item not found"
        )
    item.status = "sold"
    db.commit()
    db.refresh(item)
    return item