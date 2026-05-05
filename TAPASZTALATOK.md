# Projekt tapasztalatok – Error Explainer
### Az agentic AI használatának tanulságai

---

## A projekt menete

A feladat egy VSCodium/VS Code bővítmény elkészítése volt, amely programozási hibaüzeneteket magyaráz el egyszerű, kezdőknek is érthető nyelven – mesterséges intelligencia segítségével.

A megvalósítás teljes egészében egy agentic AI (Oz, a Warp beépített AI ügynöke) irányításával történt. Az emberi feladat minimális volt: utasítások adása, hibák jelzése, és döntések meghozatala.

### Fő lépések időrendben

1. **Tervezés és architektúra** – Az AI önállóan döntötte el a projekt felépítését: VS Code extension API (JavaScript) a felszínhez, Python backend a Groq API híváshoz.
2. **Összes fájl legenerálása** – `package.json`, `extension.js`, `webview/panel.html`, `backend/explain.py`, `requirements.txt`, `README.md`, `.gitignore`, `.vscode/launch.json` – mindet az AI írta.
3. **Hibakeresés és javítás** – Pip telepítési hibák, Python útvonal problémák, VS Code debugger konfiguráció hiánya – ezeket menet közben oldottuk meg.
4. **Dokumentáció frissítése** – A README-t az AI többször is újraírta, ahogy kiderültek a valódi felhasználói lépések.

---

## Tanulságok az agentic AI használatáról

### 1. Az AI tud gondolkodni, de nem tud látni
Az AI kódot generál, fájlokat ír, hibákat elemez – de nem látja a képernyődet. Minden visszajelzés, amit adsz neki (pl. *„ugyanaz a popup jelenik meg"*, *„CMD+, nagyítja a tabot"*), alapvetően fontos. Minél pontosabb a visszajelzés, annál pontosabb a megoldás.

### 2. A kontextus mindent meghatároz
Ha az AI nem tudja, hogy a fájlok átkerültek egy másik mappába, vagy hogy a projekt struktúrája megváltozott, vakon dolgozik. Ez a projekt során konkrétan megtörtént: az AI egy üres mappában próbált fájlokat szerkeszteni, mert nem tudta, hogy a projekt máshova lett áthelyezve.

**Tanulság:** Mindig add meg az AI-nak a releváns kontextust. Ne feltételezd, hogy tudja.

### 3. Az AI által generált kód működik – de a környezet nem mindig
A kód önmagában helyes volt, de a telepítési lépések (pl. `pip install`) a helyi gépen más hibákat dobtak, mint ami várható lett volna. A rendszerszintű problémák (törölt könyvtár, macOS jogosultságok, Xcode Python) nem kódolási hibák – az AI ezeket csak a hibaüzenetek alapján tudja azonosítani.

**Tanulság:** Az AI-generált instrukciók általánosak. A te géped egyedi. Ha valami nem működik, másold be a pontos hibaüzenetet.

### 4. Az iteráció természetes – ne várd el az első próbára a tökéletes megoldást
Ez a projekt több körben jutott el a működő végeredményhez:
- Első pip parancs → hiba
- Javított pip parancs → hiba
- Harmadik variáció → siker

Ez nem az AI kudarca – ez az agentic munkafolyamat természete. Az AI tanul a visszajelzéseidből és finomít.

### 5. A dokumentáció utólag lesz pontos
Az AI a README-t a tervek alapján írta meg először. A valódi, pontos lépések (pl. hogy `CMD+,` nem nyitja meg a beállításokat, hanem a **Code → Settings → Settings** kell) csak a tényleges használat során derültek ki.

**Tanulság:** Az AI által írt dokumentációt mindig teszteld valaki mással. Az első változat mindig idealizált.

### 6. Az AI gyorsan dolgozik, de az ember dönti el az irányt
Az összes fájl – több száz sor kód – percek alatt elkészült. Ami időt vett igénybe: a kommunikáció, a visszajelzések, a félreértések tisztázása. A szűk keresztmetszet sosem az AI sebessége volt.

---

## Összefoglalás

| Terület | Tapasztalat |
|---|---|
| Kódgenerálás | Gyors, megbízható, jól strukturált |
| Hibakeresés | Hatékony, ha pontos hibaüzenetet kap |
| Dokumentáció | Jó alap, de valós tesztelés után kell finomítani |
| Kommunikáció | Minél konkrétabb az utasítás, annál jobb az eredmény |
| Korlátok | Nem látja a képernyőt, nem ismeri a helyi rendszert |

Az agentic AI nem varázslat – hanem egy nagyon gyors, kontextusérzékeny fejlesztési partner, aki csak annyit tud, amennyit elmondasz neki.
