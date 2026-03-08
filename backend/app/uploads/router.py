import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.config import settings
from app.dependencies import get_current_user
from app.users.models import User

router = APIRouter(prefix="/api/v1/uploads", tags=["uploads"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx"}


@router.post("/")
async def upload_file(
    file: UploadFile,
    _: User = Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Файл не указан")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Недопустимый формат файла: {ext}")

    if file.size and file.size > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"Файл превышает {settings.MAX_UPLOAD_SIZE_MB} МБ")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    return {"url": f"/api/v1/uploads/{filename}", "filename": filename}


@router.get("/{filename}")
async def get_file(filename: str):
    filepath = os.path.join(settings.UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Файл не найден")
    return FileResponse(filepath)
