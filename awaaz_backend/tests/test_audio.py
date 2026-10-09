import os
import math
import wave
import struct
import tempfile
import pytest
from services.audio import (
    get_audio_duration_wave,
    validate_and_convert_audio,
    is_audio_silent
)


def create_synthetic_wav(path: str, duration_sec: float = 1.0, sample_rate: int = 16000, frequency: float = 440.0):
    """Generates a synthetic audible mono WAV tone for testing."""
    n_samples = int(duration_sec * sample_rate)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)  # 16-bit
        wf.setframerate(sample_rate)
        for i in range(n_samples):
            # 440Hz audible sine wave tone
            val = int(16000 * math.sin(2.0 * math.pi * frequency * i / sample_rate))
            data = struct.pack("<h", val)
            wf.writeframes(data)


def test_wave_duration():
    """Verify wave duration calculation."""
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        create_synthetic_wav(tmp_path, duration_sec=2.5)
        dur = get_audio_duration_wave(tmp_path)
        assert dur is not None
        assert 2.4 <= dur <= 2.6
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def test_empty_audio_rejection():
    """Verify 0-byte audio file is rejected."""
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        out_wav = tmp_path + "_out.wav"
        is_valid, dur, msg = validate_and_convert_audio(tmp_path, out_wav)
        assert is_valid is False
        assert "empty" in msg.lower()
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def test_nonexistent_audio_rejection():
    """Verify non-existent file path fails gracefully."""
    is_valid, dur, msg = validate_and_convert_audio("non_existent_12345.wav", "out.wav")
    assert is_valid is False
    assert "not exist" in msg.lower()


def test_synthetic_audio_conversion_and_validation():
    """Verify valid synthetic audio converts and passes duration validation."""
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as in_tmp:
        in_path = in_tmp.name
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as out_tmp:
        out_path = out_tmp.name

    try:
        create_synthetic_wav(in_path, duration_sec=1.5, frequency=440.0)
        is_valid, dur, msg = validate_and_convert_audio(in_path, out_path)
        assert is_valid is True
        assert 1.4 <= dur <= 1.6
        assert msg == "Success"
        assert os.path.exists(out_path)
    finally:
        for p in [in_path, out_path]:
            if os.path.exists(p):
                os.remove(p)


def test_too_short_audio_rejection():
    """Verify audio under 0.5s is rejected."""
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as in_tmp:
        in_path = in_tmp.name
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as out_tmp:
        out_path = out_tmp.name

    try:
        create_synthetic_wav(in_path, duration_sec=0.2)
        is_valid, dur, msg = validate_and_convert_audio(in_path, out_path)
        assert is_valid is False
        assert "too short" in msg.lower()
    finally:
        for p in [in_path, out_path]:
            if os.path.exists(p):
                os.remove(p)

