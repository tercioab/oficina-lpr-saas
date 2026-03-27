from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.services.ocr_service import ocr_service
import os

app = FastAPI(title="Oficina LPR SaaS API")

class ImageBase64(BaseModel):
    image: str

@app.get("/")
def read_root():
    return {"status": "online", "message": "Oficina LPR API v1.0"}

@app.post("/ocr/scan")
async def scan_plate(data: ImageBase64):
    try:
        result = ocr_service.read_plate(data.image)
        if not result:
            raise HTTPException(status_code=404, detail="Placa não identificada ou inválida.")
        
        # Aqui entra a integração com Firestore no futuro
        return {
            "success": True,
            "data": result,
            "message": "Placa identificada com sucesso."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
