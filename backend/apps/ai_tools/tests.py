import os
from unittest.mock import Mock, patch

from django.test import SimpleTestCase

from . import engine


class GeminiChatbotTests(SimpleTestCase):
    def test_chatbot_reply_uses_gemini_when_configured(self):
        with patch.dict(os.environ, {"GEMINI_API_KEY": "AIzaSyTestKey123", "GEMINI_MODEL": "gemini-2.0-flash"}, clear=False):
            mock_response = Mock()
            mock_response.raise_for_status.return_value = None
            mock_response.json.return_value = {
                "candidates": [{"content": {"parts": [{"text": "Gemini answer"}]}}]
            }

            with patch("apps.ai_tools.engine.requests.post", return_value=mock_response) as post_mock:
                reply = engine.chatbot_reply("How is the weather today?")

        self.assertEqual(reply, "Gemini answer")
        post_mock.assert_called_once()

    def test_chatbot_reply_uses_knowledge_engine_for_crop_query(self):
        reply = engine.chatbot_reply("Tell me about tomato cultivation")
        self.assertIn("Tomato Cultivation Guidance", reply)
        self.assertIn("warm weather", reply)

    def test_chatbot_reply_uses_knowledge_engine_for_starter_prompts(self):
        reply = engine.chatbot_reply("What crops are best for winter in loam soil?")
        self.assertIn("Wheat", reply)
        self.assertIn("Potato", reply)

    def test_chatbot_reply_uses_knowledge_engine_when_api_fails(self):
        with patch.dict(os.environ, {"GEMINI_API_KEY": "AIzaSyTestKey123"}, clear=False):
            with patch("apps.ai_tools.engine.requests.post", side_effect=Exception("API Error")):
                reply = engine.chatbot_reply("Organic treatment for tomato leaf blight")

        self.assertIn("Organic treatment options", reply)

