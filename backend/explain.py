#!/usr/bin/env python3
"""
Error Explainer – AI backend

Reads  JSON from stdin : {"code": "...", "error": "..."}
Writes JSON to stdout  : {"explanation": "..."} or {"error": "..."}
"""

import json
import os
import sys


def main() -> None:
    # ── Parse input ──────────────────────────────────────────────────────────
    try:
        payload = json.loads(sys.stdin.read())
    except json.JSONDecodeError as exc:
        print(json.dumps({"error": f"Invalid JSON input: {exc}"}))
        return

    code: str = payload.get("code", "").strip()
    error_msg: str = payload.get("error", "").strip()

    if not error_msg:
        print(json.dumps({"error": "No error message provided."}))
        return

    # ── Check for groq package ────────────────────────────────────────────────
    try:
        from groq import Groq  # type: ignore
    except ImportError:
        print(json.dumps({
            "error": (
                'The "groq" Python package is not installed.\n'
                "Fix: pip3 install groq"
            )
        }))
        return

    # ── Check for API key ─────────────────────────────────────────────────────
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key:
        print(json.dumps({"error": "GROQ_API_KEY environment variable is not set."}))
        return

    # ── Build prompt ──────────────────────────────────────────────────────────
    fence = "```"
    code_section = f"\n\nCODE:\n{fence}\n{code}\n{fence}" if code else ""

    prompt = f"""You are a friendly coding tutor helping a beginner programmer understand an error.{code_section}

ERROR MESSAGE:
{error_msg}

Explain this error clearly and simply. Use exactly this format (keep each section short):

**What went wrong**
[1-2 plain English sentences – no jargon, imagine explaining to a friend]

**Why this happened**
[Brief cause; use a simple analogy if it helps]

**How to fix it**
[Numbered steps]

**Fixed code**
{fence}
[The corrected snippet – only include if code was provided or a short example is obviously helpful]
{fence}

Rules: be encouraging, avoid overly technical terms, keep it concise."""

    # ── Call the API ──────────────────────────────────────────────────────────
    try:
        client = Groq(api_key=api_key)
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=1024,
        )
        explanation = completion.choices[0].message.content
        print(json.dumps({"explanation": explanation}))
    except Exception as exc:  # noqa: BLE001
        print(json.dumps({"error": f"Groq API error: {exc}"}))


if __name__ == "__main__":
    main()
