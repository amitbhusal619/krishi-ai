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


_CROP_KNOWLEDGE = {
    "tomato": (
        "Tomatoes grow best in warm weather with well-drained, fertile loam soil (pH 6.0–6.8). "
        "Key tips: Provide 6-8 hours of sunlight daily, use stakes or cages to support vines, and water at the soil level to prevent leaf diseases. "
        "Common pests include fruit borers and whiteflies; use Neem oil spray or copper-based fungicide for early blight."
    ),
    "potato": (
        "Potato is a major winter/cool season crop in Nepal. Plant seed tubers in loose, sandy loam soil rich in organic manure. "
        "Apply balanced NPK (recommended 100:60:100 kg/ha) with Urea, DAP, and MOP. "
        "Earth up soil around tubers at 30 days to protect tubers from light and pests."
    ),
    "rice": (
        "Rice (Paddy) is Nepal's main monsoon crop. Transplants thrive in clay loam soil with high water retention. "
        "Key practices: Maintain 2-5 cm water depth during early growth, apply Nitrogen in splits (at transplanting, tillering, and panicle initiation), "
        "and monitor for stem borer and leaf folder pests."
    ),
    "paddy": (
        "Rice (Paddy) is Nepal's main monsoon crop. Transplants thrive in clay loam soil with high water retention. "
        "Key practices: Maintain 2-5 cm water depth during early growth, apply Nitrogen in splits (at transplanting, tillering, and panicle initiation), "
        "and monitor for stem borer and leaf folder pests."
    ),
    "wheat": (
        "Wheat is cultivated during the winter season (November to April). Requires well-drained loam soil. "
        "Sow seeds after land preparation with initial DAP application. Irrigate at critical growth stages: Crown Root Initiation (20-25 days), "
        "flowering, and grain filling stages."
    ),
    "maize": (
        "Maize (Corn) grows well in both hill and terai regions of Nepal during spring and summer. "
        "Prefers fertile, deep loam soil with good drainage. Apply Nitrogen-rich fertilizers (Urea) at knee-high and tasseling stages for optimal yield."
    ),
    "corn": (
        "Maize (Corn) grows well in both hill and terai regions of Nepal during spring and summer. "
        "Prefers fertile, deep loam soil with good drainage. Apply Nitrogen-rich fertilizers (Urea) at knee-high and tasseling stages for optimal yield."
    ),
    "onion": (
        "Onions require cool weather during nursery stage and warm dry weather for bulb development. "
        "Plant in well-drained sandy loam soil with organic compost. Avoid overwatering near harvest to prevent bulb rot."
    ),
    "mustard": (
        "Mustard (Tori) is an important winter oilseed crop in Nepal. Requires light loam soil and minimal irrigation. "
        "Watch for aphid infestations during flowering; treat with wood ash dusting or organic insecticidal soap."
    ),
    "sugarcane": (
        "Sugarcane requires deep, fertile, moisture-retentive soil with good drainage and hot humid climate. "
        "Requires heavy Nitrogen fertilization and regular irrigation during hot dry months."
    ),
}


def _smart_fallback_reply(message: str) -> str:
    """Generate an informative, context-rich response for farming and marketplace queries when external LLM API is unavailable."""
    msg = message.lower().strip()

    # Greetings & Introductions
    if any(w in msg for w in ["hello", "hi", "namaste", "hey", "who are you", "what can you do"]):
        return (
            "Namaste! I am your Krishi AI Assistant. I can help you with:\n"
            "- Crop selection & cultivation advice (Rice, Wheat, Potato, Tomato, Maize, etc.)\n"
            "- Disease diagnosis & pest remedies\n"
            "- Fertilizer recommendations & NPK soil management\n"
            "- Market price trends in Nepal & listing products on the Krishi AI Marketplace\n"
            "- Seasonal weather & irrigation planning\n"
            "How can I assist your farming or produce trading today?"
        )

    # Starter prompts & Specific scenarios
    if "winter" in msg and ("soil" in msg or "crop" in msg):
        return (
            "For winter cultivation in loam soil in Nepal, the best recommended crops are:\n"
            "1. Wheat - Excellent for well-drained loam; high market demand.\n"
            "2. Potato - Thrives in loose loam rich in organic matter.\n"
            "3. Mustard (Tori) - Low water requirement; great cash crop.\n"
            "4. Winter Peas & Vegetables (Cauliflower, Cabbage, Spinach).\n"
            "Ensure proper land preparation and basal NPK application before sowing."
        )

    if "organic" in msg or ("treat" in msg and "blight" in msg):
        return (
            "Organic treatment options for plant leaf blight & fungal issues:\n"
            "1. Copper Fungicide / Bordeaux mixture spray early in the morning.\n"
            "2. Neem Oil Solution (5ml Neem oil + 2ml liquid soap per Liter of water).\n"
            "3. Baking Soda Spray (1 tbsp baking soda + 1/2 tsp liquid soap in 4L water).\n"
            "4. Prune affected bottom leaves and ensure proper plant spacing for air circulation."
        )

    if "npk" in msg and "potato" in msg:
        return (
            "NPK recommendation for Potato cultivation:\n"
            "- Recommended Ratio: 100 kg Nitrogen, 60 kg Phosphorus, 100 kg Potassium per hectare (approx 10:6:10 ratio).\n"
            "- Basal Application: Apply all Phosphorus (DAP) and Potassium (MOP) along with 50% Urea at planting.\n"
            "- Top Dressing: Apply remaining 50% Urea during earthing-up (30 days after planting)."
        )

    # Crop Specific Matches
    for crop_name, guidance in _CROP_KNOWLEDGE.items():
        if crop_name in msg:
            return f"**{crop_name.capitalize()} Cultivation Guidance:**\n{guidance}\n\nTip: You can also use our Price Prediction tool to check live market rates!"

    # Diseases & Pests
    if any(w in msg for w in ["disease", "pest", "blight", "spot", "mildew", "yellow", "rot", "bug", "insect", "fungus"]):
        return (
            "For plant disease & pest control:\n"
            "1. Inspect leaves for discoloration, spot patterns, or powdery coatings.\n"
            "2. For fungal diseases (Blight, Mildew), apply copper or sulfur-based sprays.\n"
            "3. For insect pests (Aphids, Stem Borers), use Neem oil spray or bio-pesticides.\n"
            "4. You can also upload a photo of the affected plant to our Disease Detection tool for an automated diagnosis!"
        )

    # Fertilizer & Soil
    if any(w in msg for w in ["fertilizer", "soil", "npk", "urea", "dap", "mop", "compost", "manure", "nitrogen", "phosphorus", "potassium"]):
        return (
            "Soil Nutrient & Fertilizer Guidance:\n"
            "- Nitrogen (Urea): Promotes foliage growth & green leaves.\n"
            "- Phosphorus (DAP): Essential for root establishment & flowering.\n"
            "- Potassium (MOP): Improves disease resistance & fruit/grain quality.\n"
            "- Compost / Farmyard Manure: Improves soil structure & organic matter.\n"
            "Try our Fertilizer Recommendation tool with your specific soil NPK values for precise field dosages."
        )

    # Market Prices & Selling
    if any(w in msg for w in ["price", "rate", "cost", "market", "sell", "buy", "khalti", "esewa", "order", "listing"]):
        return (
            "Marketplace & Price Information:\n"
            "- Check current estimated crop prices across markets in Nepal via the Price Prediction tool.\n"
            "- Farmers can list fresh harvest for direct sale under Farmer Dashboard -> Products -> Add Product.\n"
            "- Buyers can browse verified local produce, place orders, and pay securely via Khalti / eSewa."
        )

    # Weather & Seasons
    if any(w in msg for w in ["weather", "rain", "monsoon", "summer", "season", "forecast", "temperature"]):
        return (
            "Weather & Seasonal Planting Tips:\n"
            "- Monsoon (June-Sept): Ideal for Rice, Soybean, Maize, and Sugarcane.\n"
            "- Winter (Oct-March): Ideal for Wheat, Potato, Mustard, Cauliflower, and Peas.\n"
            "- Check the Weather page for localized forecasts before spraying or scheduling irrigation."
        )

    # Default Helpful Response
    return (
        "I am here to support your farming and marketplace needs in Nepal! "
        "You can ask me about specific crops (Rice, Wheat, Potato, Tomato, Maize), pest treatments, fertilizer dosage, "
        "market price trends, or listing products on the Krishi AI platform."
    )



def chatbot_reply(message: str, history=None):
    """Use Gemini when configured with a valid API key, otherwise fallback to our rich domain knowledge engine."""
    api_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", "")
    # Check if key is present and is a valid Google AI Studio key (not default dummy key)
    if api_key and not api_key.startswith("AQ.Ab"):
        try:
            contents = []
            if history:
                for sender, text in history:
                    role = "user" if sender == "user" else "model"
                    if contents and contents[-1]["role"] == role:
                        contents[-1]["parts"][0]["text"] += f"\n{text}"
                    else:
                        contents.append({
                            "role": role,
                            "parts": [{"text": text}]
                        })
            else:
                contents.append({
                    "role": "user",
                    "parts": [{"text": message}]
                })

            payload = {
                "system_instruction": {
                    "parts": [
                        {
                            "text": (
                                "You are Krishi AI, an expert agricultural and marketplace assistant for farmers and buyers in Nepal. "
                                "Provide helpful, concise, and practical answers regarding crop cultivation, disease management, soil health, fertilizer usage, market prices, weather forecasts, and marketplace trading."
                            )
                        }
                    ]
                },
                "contents": contents,
                "generationConfig": {"temperature": 0.4, "maxOutputTokens": 400},
            }
            model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
            response = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}",
                json=payload,
                timeout=20,
            )
            response.raise_for_status()
            data = response.json()
            candidates = data.get("candidates") or []
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    reply_text = parts[0].get("text", "").strip()
                    if reply_text:
                        return reply_text
        except Exception as e:
            print(f"[Gemini API Error] Falling back to Krishi AI Knowledge Engine: {e}")

    return _smart_fallback_reply(message)

