---
date: 2019-11-02
description: Júzer szempontból nem feltétlenül kényelmes Node.js-t és dependency-ket telepítgetni, meg parancssort nyitni a Díjnet Bot használata előtt. Erre próbáltam megoldást keresni. Többé-kevésbé sikerült is.
image: /assets/dijnet-bot/dijnet-bot-exe-vt1.png
lang: hu
lightbox: true
tags: bitdefender bundle browserify minify nodejs
title: Node.js app egy fájlba csomagolása
---

## Motiváció és célkitűzés

Az utóbbi hetekben elővettem a [Díjnet Bot](https://github.com/juzraai/dijnet-bot) projektemet, és elkezdtem tuningolási ötleteket összeírni, illetve megvalósítani. Az egyik ilyen ötlet a program egyetlen fájlba csomagolása volt. Végiggondoltam ugyanis, hogy a **célközönségem nem csak a fejlesztők, hanem mindenki**, és egy mezei felhasználó nem biztos, hogy tudja mi az a parancssor, meg nem feltétlenül kényelmes Node.js-t meg dependency-ket telepítgetni, mielőtt használni tudná a programomat.

A fentiek alapján 2 célt fogalmaztam meg: a program **legyen használható**

1. **Node.js telepítés és `npm i -g` futtatása nélkül,**
2. **illetve parancssorba/terminálba pötyögés nélkül.**

## Előkészületek

A fentiekből következik, hogy a program **konfigurálhatóságát** is úgy kellett kialakítani, hogy ahhoz se kelljen parancssor. Szerencsére a **konfigfájl** olvasása, illetve a környezeti változók kezelése a program legelső változatától kezdve adott volt.

Azonban ha elképzeljük, hogy duplaklikkre indul a program, és Díjnet bejelentkezési adatok hiányában kiprinteli a help-et, majd kilép, az nem valami felhasználóbarát működés. Ennek orvoslására a v2.0.0-ban bevezettem azt, hogy ha a szükséges adatokat nem kapja meg, akkor a program **prompttal** kéri be azokat a terminálban.

Ennek szebb/elegánsabb formája lenne egy korrekt **GUI**, de az egy külön történet. 🙂

## Bináris generálása

Szétnéztem, hogyan tudnám a fenti célokat elérni, és az első út, ami elém került, az a **bináris fájl generálása.** Van is két tool, ami ezt kínálja: a [pkg](https://www.npmjs.com/package/pkg) és a [nexe](https://www.npmjs.com/package/nexe). Mindkettő azt csinálja, hogy **egyetlen futtatható fájlba** csomagolja össze

-   a Node.js runtime-ot
-   a programomat
-   és a programom dependency-jeit.

Különféle platformokat és különféle Node.js verziókat lehet választani, és a folyamat végén minden megadott platform+Node kombinációra 1-1 futtatható fájlt köp ki, amik egyenként kb. 20-40 MB-ot nyomnak.

A kapott fájl ugyanúgy futtatható parancssorból, mint az eredeti program, emellett duplaklikkel is indítható, ekkor nyit magának egy Node konzolablakot (mint amikor a Node-hoz társítjuk a `.js` fájlunkat).

Mindez **perfektül hangzik**, mert mindkét célomat elérném pár karakter leütésével, viszont a kiköpott `.exe` fájlokat a **BitDefender kivétel nélkül kártékonynak érzékelte.** 🚨 Nem Díjnet Bot-specifikus a probléma, és a kiválasztott Node runtime verziótól sem függ. Érdekesség, hogy a BitDefender a fájl futtatása közben vagy után jelzett, ha pedig explicite kértem, hogy szkennelje az `.exe` fájlt, akkor azt mondta, hogy minden oké. 🤯

Tettem egy próbát [Electron.js](https://electronjs.org/)-el is, ami noha jóval nagyobb output méretet generál, a fenti célok elérésén felül egyszerűen tudnék vele GUI-t is csinálni az appnak. A BitDefender itt is lecsapott.

Ez nyilván fals-pozitív jelzés, és talán lehetne is jelenteni a BitDefender-nek, de akkor vajon minden verziót be kéne küldenem nekik? Illetve akkor ezt végig kéne csinálnom a többi antivírus szoftverrel is? Nem életszerű. A [VirusTotal szerint](https://www.virustotal.com/gui/file/1a6c995f23c676a58de288ae8e2e7fba2f9fa4b51d90e6da4c70776fc222ad89/detection) mondjuk csak a BitDefender problémázik:

[![VirusTotal Detection]({{ '/assets/dijnet-bot/dijnet-bot-exe-vt1.png' | relative_url }})]({{ '/assets/dijnet-bot/dijnet-bot-exe-vt1.png' | relative_url }})

Tippre az a baja, hogy a `pkg` úgy generálja a kimenetet, hogy egy meglévő `.exe` fájlba (`node.exe`) injektálja a programomat (valahol érthető, hogy ez gyanús, de na):

[![VirusTotal Details]({{ '/assets/dijnet-bot/dijnet-bot-exe-vt2.png' | relative_url }})]({{ '/assets/dijnet-bot/dijnet-bot-exe-vt2.png' | relative_url }})

Több helyen olvastam, hogy a program aláírása megoldhatja a gondot. A tanúsítványok, amiket eddig találtam, több száz dolcsiba kerülnek, ami csak a Díjnet Bot miatt nem éri meg. A témába nem ástam bele magam mélyebben, talán később megteszem. 🤨 Itt ezt a szálat feladtam, és egy **B-tervet** valósítottam meg.

## B-terv

Találtam egy köztes megoldást, amivel a Node.js telepítést ugyan nem tudom **megspórolni a júzernek,** de az **NPM-ezést** igen, illetve a parancssor használata is kikerülhető.

A **[Browserify](http://browserify.org/)** jutott eszembe, ami ugye egyetlen bundle fájlt tud generálni egy kiinduló `.js` fájlból, végigkövetve annak `require` hívásait. A `--node` kapcsolóval tud Node.js-kompatibilis kimenetet is generálni:

```bash
$ browserify index.js --node -o dijnet-bot.js
```

Az így kapott `.js` fájl pontosan úgy működik, mint az `index.js`, viszont nem kell mellé semmi más: sem `package.json`, sem `node_modules` mappa. Ha a felhasználó társítja a `.js` fájlokat a Node runtime-al, akkor **duplaklikkel is indítható, vagyis a 2. célt elértük.**

A kimeneti fájl mérete 1.3 MB, ami a 12 MB-os `node_modules` mappával szemben hatalmas előrelépés. Azonban én itt nem álltam meg - hamár csomagolunk, csomagoljunk rendesen! 🤓

A `.js` fájlok tömörítési eljárása a _minification_, melyre a standard tool az [Uglify JS](https://www.npmjs.com/package/uglify-js). Ez viszont elsírja magát egy `const` keyword-től is, vagyis kell még egy Babel fázis elé, ami a JavaScript egy régebbi verziójára fordítja a programom. Utóbbihoz kevéssé értek még és fölösleges bonyolításnak is tartom, szóval más utat kerestem.

Több más eszköz kipróbálása után rátaláltam a [Terser](https://terser.org/)-re, ami modern JS kódot is tud kezelni. A Browserify után bekötve a **végső fájlméret 707 KB lett.**

```js
const fs = require('fs');
const browserify = require('browserify');
const terser = require('terser');

browserify('./index.js', {
	/* --node */
	bare: true,
	browserField: false,
}).bundle((error, buffer) => {
	if (error) throw error;
	const bundle = buffer.toString(); // 1.3 MB
	const minified = terser.minify(bundle).code; // 0.7 MB
	fs.writeFileSync('./dijnet-bot.js', minified);
});
```

A v2.1.0 verziótól kezdve a Díjnet Bot-hoz generálok egy ilyen bundle-t is.

A BitDefender-es fonalat lehet, hogy felveszem még, hátha sikerül valahogy megoldani vagy többet megtudni a problémáról. Emellett a GUI témán is agyalok, hogyan tudom megoldani, Electron-nal vagy anélkül.
