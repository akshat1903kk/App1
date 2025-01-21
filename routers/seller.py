from fastapi import APIRouter, Depends, HTTPException, status
from ..models import Item
from .auth import db_dependency, get_current_user 
from pydantic import BaseModel

router = APIRouter(
    prefix='/seller',
    tags=['seller'],
)

class ItemRequest(BaseModel):
    title: str
    description: str

@router.post('/create_item')
async def create_item(item: ItemRequest, 
                      db: db_dependency, 
                      current_user: dict = Depends(get_current_user)):  # Inject current user as a dependency
    # Check user role
    if current_user['user_role'] != "seller":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="You are not authorized to create an item"
        )

    # Create a new item
    new_item = Item(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item
