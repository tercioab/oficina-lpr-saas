import easyocr
import cv2
import numpy as np
import re
import base64

class OCRService:
    def __init__(self):
        # Inicializa o EasyOCR para Português e Inglês (melhor precisão para placas)
        self.reader = easyocr.Reader(['pt', 'en'])
        
        # Regex para placas brasileiras
        self.pattern_old = re.compile(r'^[A-Z]{3}\d{4}$')
        self.pattern_mercosul = re.compile(r'^[A-Z]{3}\d{1}[A-Z]{1}\d{2}$')

    def preprocess_image(self, image_bytes):
        # Converte bytes para imagem OpenCV
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Converte para escala de cinza
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Aplica binarização (Otsu) para lidar com variações de luz em oficinas
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        return binary

    def read_plate(self, base64_image):
        # Decodifica base64
        image_data = base64.b64decode(base64_image.split(',')[1] if ',' in base64_image else base64_image)
        processed_img = self.preprocess_image(image_data)
        
        # Executa OCR
        results = self.reader.readtext(processed_img)
        
        # Filtra e valida resultados
        for (bbox, text, prob) in results:
            clean_text = re.sub(r'[^A-Z0-9]', '', text.upper())
            
            if self.validate_plate(clean_text):
                return {
                    "plate": clean_text,
                    "confidence": prob,
                    "type": "mercosul" if self.pattern_mercosul.match(clean_text) else "old"
                }
        
        return None

    def validate_plate(self, plate):
        return bool(self.pattern_old.match(plate) or self.pattern_mercosul.match(plate))

ocr_service = OCRService()
