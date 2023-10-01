---
date: 2018-11-20
description: Pár egyszerű művelet, amivel nyomdakésszé varázsolhatjuk vektorgrafikánkat, legyen az névjegykártya vagy cégtábla. A font probléma elkerülése és CMYK-ra konvertálás.
lang: hu
lightbox: true
tags: cmyk ghostscript inkscape pdf printing vector-graphics
title: Nyomdakész PDF előállítása
---

## Bevezetés

Kissé rendhagyó ez a poszt, de ki mondta, hogy csak programozásról fogok írni? 😜 Messze nem vagyok profi ezen a téren, de egyszerűbb vektorgrafikákat olykor összetákolok, ha szükségem van rá és nem bonyolult a feladat. Egyrészt élvezem is, másrészt így ingyen van. A honlapom logóját és a kapcsolódó social media képeket [Inkscape](https://inkscape.org/)-ben raktam össze. Már pár hónapja megterveztem a névjegykártyámat, illetve a minap egy cégtáblát készítettem és gyártattam le.

Fontos, hogy amikor nyomdát keresünk, nézzük meg az **anyagleadási útmutatójukat,** ahol leírják, milyen formátumokat fogadnak el, milyen kritériumok mentén. A legtöbb helyen a **nyomtatásra kész** formátumot preferálják (PDF), de láttam olyan céget is, ahol ajánlottak egy speciális programot és annak a mentéséből (is) tudnak dolgozni. Adott esetben vágójeleket is kérhetnek - na ehhez még nem értek, de 2 egyszerű műveletet bemutatok alább Inkscape használatával.

## Szövegek

Ha a grafikánk szöveget is tartalmaz, nyilván egy szép betűtípust is választottunk hozzá, amit adott esetben mi is kézzel telepítettünk a gépünkre. Innen következik, hogy a nyomdában sem lesz jelen az a font, ott is telepíteni kéne. E probléma feloldására 2 féle megoldás létezik:

-   vagy beágyazzuk a betűtípusokat a PDF-be
-   vagy "legörbézzük a szövegeket".

A nyomdák többnyire az utóbbit javasolják. Ez annyit tesz, hogy a feliratokat útvonalakká (_path_), azaz görbékké konvertáljuk, így **grafikaként lesznek tárolva**, és nem betűtípust igénylő szövegként. Inkscape-ben erre 2 mód is van:

Egyrészt a _Path_ menü _Object to Path_ (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>) menüpontjával a kijelölt text objektumot szövegből görbévé lehet konvertálni egy mozdulattal. Ennek a megoldásnak az a hátránya, hogy ezután a szöveg már nem szerkeszthető szövegként. Viszont útvonalként igen, tehát ügyesebbek tuningolhatják kézzel a betűket.

Másik megoldás, hogy amikor a _Save As..._ opcióval elmentjük PDF fájlba a grafikát, kiválasztjuk a _Convert text to path_ opciót az ablakban, amit az Inkscape feldob. Ezzel a módszerrel **csak a kimeneti fájlban alakulnak át** a szövegek, a szöveg szerkeszthető marad a programban.

<style>.content img { width: auto; }</style>

[![Inkscape PDF options]({{ '/assets/inkscape/inkscape-pdf.png' | relative_url }})]({{ '/assets/inkscape/inkscape-pdf.png' | relative_url }})

## Színek

A legtöbb anyagleadási útmutatóban azt is kérik, hogy a PDF-ben CMYK színteret használjunk, mely pontosabban leírja, hogyan keverje a színeket a nyomtató. Az Inkscape nem CMYK alakban menti a színeket, illetve az ezt lehetővé tevő [plugin](http://wiki.inkscape.org/wiki/index.php/ExportPDFCMYK) csak Linux-ra elérhető.

Windows-on azt lehet csinálni, hogy feltelepítjük a [GhostScript](https://www.ghostscript.com/download/gsdnld.html)-et, és megkérjük rá, hogy az Inkscape-ből kimentett PDF-et alakítsa át CMYK színeket tartalmazó PDF-re:

```powershell
> "c:\Program Files\gs\gs9.25\bin\gswin64.exe" ^
		-o "KIMENETI FÁJL ÚTVONALA" ^
		-sDEVICE=pdfwrite ^
		-dUseCIEColor ^
		-sProcessColorModel=DeviceCMYK ^
		-sColorConversionStrategy=CMYK ^
		-sColorConversionStrategyForImages=CMYK ^
		"BEMENETI FÁJL ÚTVONALA"
```
