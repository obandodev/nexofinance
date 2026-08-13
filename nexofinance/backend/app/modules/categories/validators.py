from fastapi import HTTPException
def validate_custom_category(category, user_id):
    if category.user_id is None:
        raise HTTPException(status_code=400, detail="No se pueden eliminar las categorías del sistema")
    if category.user_id != user_id:
        raise HTTPException(status_code=403, detail="No podés eliminar una categoría que no es tuya")
