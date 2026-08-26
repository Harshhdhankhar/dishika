import re
import unicodedata
from typing import Dict

class SpeechNormalizer:
    """Normalize text for TTS output."""
    
    # Hindi acronym expansions
    HINDI_ACRONYMS = {
        "PACS": "पैक्स",
        "FPO": "एफ-पी-ओ",
        "NCDC": "एन-सी-डी-सी",
        "RBI": "आर-बी-आई",
        "GST": "जी-एस-टी",
        "KYC": "के-वाई-सी",
    }
    
    # English to Hindi numbers (for amounts)
    HINDI_NUMBERS = {
        "0": "शून्य",
        "1": "एक",
        "2": "दो",
        "3": "तीन",
        "4": "चार",
        "5": "पांच",
        "6": "छः",
        "7": "सात",
        "8": "आठ",
        "9": "नौ",
        "10": "दस",
        "100": "सौ",
        "1000": "हजार",
        "10000": "दस हजार",
        "100000": "लाख",
        "1000000": "दस लाख",
    }
    
    @classmethod
    def normalize(cls, text: str, language: str = "hi") -> str:
        """Normalize text for speech synthesis."""
        # Remove markdown
        text = cls._remove_markdown(text)
        
        # Remove URLs
        text = cls._remove_urls(text)
        
        # Remove code blocks
        text = cls._remove_code_blocks(text)
        
        # Remove citations and references
        text = cls._remove_citations(text)
        
        # Normalize whitespace
        text = " ".join(text.split())
        
        if language == "hi":
            text = cls._normalize_hindi(text)
        
        return text
    
    @staticmethod
    def _remove_markdown(text: str) -> str:
        """Remove markdown formatting."""
        # Remove bold
        text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
        # Remove italic
        text = re.sub(r"\*(.*?)\*", r"\1", text)
        text = re.sub(r"_(.*?)_", r"\1", text)
        # Remove headers
        text = re.sub(r"^#+\s+", "", text, flags=re.MULTILINE)
        # Remove blockquotes
        text = re.sub(r"^>\s+", "", text, flags=re.MULTILINE)
        return text
    
    @staticmethod
    def _remove_urls(text: str) -> str:
        """Remove URLs."""
        text = re.sub(r"https?://\S+", "", text)
        text = re.sub(r"www\.\S+", "", text)
        return text
    
    @staticmethod
    def _remove_code_blocks(text: str) -> str:
        """Remove code blocks and inline code."""
        # Remove triple-backtick code blocks
        text = re.sub(r"```[\s\S]*?```", "", text)
        # Remove single-backtick inline code
        text = re.sub(r"`([^`]+)`", r"\1", text)
        return text
    
    @staticmethod
    def _remove_citations(text: str) -> str:
        """Remove citations like [1], [2], etc."""
        text = re.sub(r"\[\d+\]", "", text)
        # Remove footnote references
        text = re.sub(r"\{\d+\}", "", text)
        return text
    
    @classmethod
    def _normalize_hindi(cls, text: str) -> str:
        """Hindi-specific normalization."""
        # Expand acronyms
        for acronym, expansion in cls.HINDI_ACRONYMS.items():
            text = re.sub(r"\b" + acronym + r"\b", expansion, text, flags=re.IGNORECASE)
        
        # Normalize currency (₹10,000 -> दस हजार रुपये)
        text = re.sub(
            r"[₹]\s*(\d+(?:,\d+)*)",
            lambda m: cls._number_to_hindi_words(m.group(1)) + " रुपये",
            text
        )
        
        return text
    
    @staticmethod
    def _number_to_hindi_words(number_str: str) -> str:
        """Convert numbers to Hindi words."""
        # Remove commas
        number_str = number_str.replace(",", "")
        
        try:
            num = int(number_str)
        except ValueError:
            return number_str
        
        # Simple mapping for common amounts
        if num == 10000:
            return "दस हजार"
        elif num == 100000:
            return "एक लाख"
        elif num == 1000000:
            return "दस लाख"
        elif num == 10000000:
            return "एक करोड़"
        
        return number_str
