"""
Placeholder "AI" logic.

Each function here stands in for a real trained model / external API call.
They're deterministic-ish and rule-based so the endpoints work out of the box
with no ML dependencies installed. Swap the body of each function for a call
into your actual model (e.g. a saved Keras/PyTorch model, a scikit-learn
pipeline, or a hosted inference endpoint) — the view layer doesn't need to
change.
"""
import os
import random

import requests
from django.conf import settings

_DISEASES = [
    ("Leaf Blight", "Apply a copper-based fungicide and improve field drainage."),
    ("Powdery Mildew", "Apply sulfur-based fungicide; increase air circulation between plants."),
    ("Bacterial Spot", "Remove and destroy infected leaves; avoid overhead watering."),
    ("Healthy", "No disease detected. Continue regular monitoring and balanced fertilization."),
]


def detect_disease(image_file, crop_type: str = ""):
    """Returns (disease_name, confidence, recommendation)."""
    disease, recommendation = random.choice(_DISEASES)
    confidence = round(random.uniform(0.72, 0.98), 2)
    return disease, confidence, recommendation


_BASE_PRICES = {
    "rice": 45, "wheat": 38, "maize": 30, "potato": 25, "tomato": 40,
    "onion": 35, "sugarcane": 5, "cotton": 65,
}


def predict_price(crop: str, market: str = "", quantity=None):
    """Returns (predicted_price_per_unit, trend)."""
    base = _BASE_PRICES.get(crop.strip().lower(), 30)
    fluctuation = random.uniform(-0.15, 0.15)
    price = round(base * (1 + fluctuation), 2)
    trend = "rising" if fluctuation > 0.03 else "falling" if fluctuation < -0.03 else "stable"
    return price, trend


def recommend_fertilizer(crop, soil_type="", n=None, p=None, q=None):
    tips = []
    if n is not None and n < 40:
        tips.append("Nitrogen is low — apply Urea or ammonium sulfate.")
    if p is not None and p < 30:
        tips.append("Phosphorus is low — apply DAP or single super phosphate.")
    if q is not None and q < 30:
        tips.append("Potassium is low — apply Muriate of Potash (MOP).")
    if not tips:
        tips.append(f"Soil nutrient levels look adequate for {crop}. Maintain with balanced NPK (e.g. 10:26:26) at sowing.")
    return " ".join(tips)


_CROP_BY_SEASON = {
    "summer": ["Maize", "Sugarcane", "Cotton", "Groundnut"],
    "winter": ["Wheat", "Mustard", "Potato", "Peas"],
    "monsoon": ["Rice", "Soybean", "Maize", "Pigeon Pea"],
}


def recommend_crops(soil_type="", region="", season="", rainfall_mm=None):
    season_key = (season or "").strip().lower()
    options = _CROP_BY_SEASON.get(season_key, ["Rice", "Wheat", "Maize", "Vegetables"])
    return random.sample(options, k=min(3, len(options)))


_CHATBOT_RESPONSES = [
    "You can find current market prices under the Price Prediction tool.",
    "For pest issues, try the Disease Detection tool — upload a clear photo of the affected leaf.",
    "I can help with crop selection, fertilizer advice, weather, or marketplace questions. What do you need?",
    "You can list your produce for sale from the Farmer Dashboard → Products → Add Product.",
]


def chatbot_reply(message: str, history=None):
    """Use Gemini when configured, otherwise fall back to a deterministic rule-based response."""
    api_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", "")
    if api_key:
        try:
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": (
                                    "You are Krishi AI, a helpful farming assistant for farmers in Nepal. "
                                    "Answer the user's question concisely and practically.\n"
                                    f"User: {message}"
                                )
                            }
                        ]
                    }
                ],
                "generationConfig": {"temperature": 0.4, "maxOutputTokens": 250},
            }
            response = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/{os.getenv('GEMINI_MODEL', 'gemini-2.0-flash')}:generateContent?key={api_key}",
                json=payload,
                timeout=20,
            )
            response.raise_for_status()
            data = response.json()
            candidates = data.get("candidates") or []
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip() or "I can help with crop, price, weather, and fertilizer questions."
        except Exception:
            pass

    msg = message.lower()
    if "price" in msg:
        return "Prices vary by market and season — try the Price Prediction tool with your crop name for an estimate."
    if "disease" in msg or "pest" in msg:
        return "Upload a photo of the affected plant in the Disease Detection tool and I'll help identify the issue."
    if "fertilizer" in msg:
        return "Share your crop and soil NPK values in the Fertilizer Recommendation tool for tailored advice."
    if "weather" in msg:
        return "Check the Weather page for the forecast in your area before planning field work."
    return random.choice(_CHATBOT_RESPONSES)
