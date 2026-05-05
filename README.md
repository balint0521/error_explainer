# Error Explainer

Egy VS Code bővítmény, amely érthetővé teszi a programozási hibákat a Groq AI segítségével.

## Mit tud?

Illessz be egy hibaüzenetet (és opcionálisan a kódodat), és a bővítmény megmondja:
- mi a hiba lényege egyszerűen
- miért történt
- hogyan javíthatod ki
- javított kódot is ad, ha megadtad a kódodat

---

## Telepítés (egyszer kell megcsinálni)

**Első lépés – Telepítsd a Python 3-at**

Nyiss egy terminált, és ellenőrizd a verziót:

```bash
python3 --version
```

Ha nem látod a verziót, töltsd le a [python.org](https://www.python.org/downloads/) weboldalról.

**Második lépés – Telepítsd a Groq Python csomagot**

```bash
python3 -m pip install groq --user
```

**Harmadik lépés – Szerezz egy ingyenes Groq API kulcsot**

1. Menj a [console.groq.com](https://console.groq.com) oldalra
2. Regisztrálj
3. Kattints az **API Keys** menüpontra, majd a **Create API Key** gombra
4. Másold ki a kulcsot

**Negyedik lépés – Töltsd le ezt a projektet**

Kattints a zöld **Code** gombra, majd a **Download ZIP** lehetőségre, és csomagold ki a számítógépeden.

**Ötödik lépés – Nyisd meg a mappát VS Code-ban**

1. Indítsd el a VS Code-ot
2. Kattints a **File → Open Folder...** lehetőségre
3. Válaszd ki a kicsomagolt `error-explainer` mappát

**Hatodik lépés – Indítsd el a bővítményt**

Nyomd meg az **F5** billentyűt. Ekkor megnyílik egy második VS Code ablak, ahol a bővítmény futni fog.

**Hetedik lépés – Add meg a Groq API kulcsodat**

A második ablakban nyisd meg a beállításokat:
- **Windows/Linux:** `File → Preferences → Settings` vagy `Ctrl+,`
- **macOS:** `Code → Settings → Settings`

A keresőmezőbe írd be: **Error Explainer**, majd illeszd be a kulcsodat a **Groq Api Key** mezőbe.

---

## Használat

A második VS Code ablakban:

1. Nyomd meg a **Cmd+Shift+P** (macOS) vagy **Ctrl+Shift+P** (Windows/Linux) billentyűkombinációt
2. Írd be: **Explain Error**, majd nyomj Entert
3. A jobb oldalon megnyílik egy panel
4. Illeszd be a hibaüzenetet az **Error Message** mezőbe
5. Opcionálisan a kódodat is beillesztheted a **Code** mezőbe
6. Kattints az **Explain Error** gombra, vagy nyomd meg a **Cmd+Enter** / **Ctrl+Enter** billentyűkombinációt

Néhány másodpercen belül megkapod az érthető magyarázatot.

> **Megjegyzés:** Minden alkalommal, amikor használni szeretnéd a bővítményt, ismételd meg a hatodik lépést – nyomj F5-öt a második ablak megnyitásához.

---

## Licenc

MIT
