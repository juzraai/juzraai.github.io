---
date: 2018-12-14
description: A Díjnet csak bizonyos ideig őrzi meg a számlákat, a kézi lementés pedig fárasztó dolog. Szerencsére a feladat könnyen automatizálható, írtam rá egy szkriptet Node.js-ben. :)
image: /assets/dijnet-bot/dijnet-bot-run.png
lang: hu
lightbox: true
tags: automation backup bot crawler díjnet invoice nodejs project script
title: Díjnet bot
---

## A probléma

A közüzemi számlák befizetésének egyik legkényelmesebb módja a [Díjnet](https://www.dijnet.hu/). Emailt küld a számláról, ami webes felületről letölthető, és online bankkártyás fizetési lehetőséget biztosít, amellyel több számla is kiegyenlíthető egyetlen tranzakcióval.

**Az ingyenes szolgáltatás keretében a Díjnet az utolsó 18 hónap számláit tárolja.** Ha a fájlokat később is el akarjuk érni, akkor két választásunk van:

-   vagy lementjük a számlákat kézzel
-   vagy fizetünk a [SzámlaPlusz](https://www.dijnet.hu/ekonto/docs/hu/szamlaplusz_tajekoztato.pdf) nevű szolgáltatásért (évi ~1000 Ft)

A fizetős csomag - valljuk be - egyáltalán nem drága, az alább írtak ellenére én is előfizettem rá.

Van viszont úgy, hogy szeretnénk ezeket a fájlokat (mégis) a saját gépünkön tudni, hogy kéznél legyenek. Itt jönne az, hogy **kézzel lementjük őket** - viszont sok számlát eléggé időigényes és fárasztó lenne letöltögetni egyesével, érdemes a **feladatot automatizálni.**

Mielőtt belefogtam a projektbe, azért körbenéztem, és nem meglepő módon nem nekem jutott eszembe először egy Díjnet számla letöltő szkript megírása. GitHub-on 2-3 repót találtam, ezek közül a [wolandmaster/dijnet-dump](https://github.com/wolandmaster/dijnet-dump) megvalósítás ahogy látom, viszonylag frissen is van tartva. Én ezt nem próbáltam ki, mert kihívást éreztem abban, hogy magam is összerakjak egy ilyen programot nulláról, elsősorban saját célra, saját igények szerint.

## Megoldásom

Nekiültem tehát összerakni a saját crawler-emet. Először Bash-ban csináltam meg `curl`-el, de aztán Node.js-re váltottam, főként azért, mert ott kényelmesen tudok HTML-t is parszolni, illetve könnyebben futtatható lesz a szkript Windows-on is. Csak [Node.js](https://nodejs.org/en/)-t kell telepíteni hozzá.

Összeraktam a **Díjnet botot**, amely **automatikusan le tudja tölteni az összes Díjnet-en levő számlámat és azok minden fájlját**, vagyis így meglesz a gépen minden számla PDF és XML formátumban, illetve a terhelési összesítők is, ahol van ilyen. A **fájlokat mappázza szolgáltató, szolgáltatási azonosító és dátum szerint.**

Grafikus felületet nem csináltam neki, **parancssorból futtatható**. A beállításokat és a bejelentkezési adatokat fájlból olvassa, így ideális arra is, hogy **ütemezett feladatként** legyen futtatva.

**[A program részletesebb leírással együtt GitHub-on érhető el.](https://github.com/juzraai/dijnet-bot/)**

Nálam gyönyörűen működik, legalábbis UPC, FVM és FCSM számlákkal nincs gondja.

[![Díjnet bot futás](/assets/dijnet-bot/dijnet-bot-run.png)](/assets/dijnet-bot/dijnet-bot-run.png)

## Nehézségek

Fura volt, hogy a Díjneten meg kell nyitni a számla kereső űrlapot, mielőtt elküldeném az adatait, illetve a számla listához is vissza kell térni minden számla után, hogy a következőre rámehessek. Így sajnos jóval több request-be kerül az egész procedúra, mint egy átlagos weboldal esetében.

Figyelni kellett a HTTP header-ökre is, bizonyos URL-ekre kontent nélküli lapot dob a szerver, ha hiányzik az `Accept` és `Accept-Language`.

A karakterkódolás is elég fura, amit használnak. Na ennek a nyitjára még nem jöttem rá, próbáltam jobbra-balra konvertálni, de csak nem kaptam szép ő/ű betűket. Egyelőre úgy hidaltam át, hogy az ékezeteket leveszem (á &raquo; a), az ismeretlen karaktereket meg kidobálom.

## Tervek

Azért van még pár ötlet a tarsolyomban a Díjnet bot továbbfejlesztéséhez. Gondolkozom azon, hogy **valamiféle statisztikát** is generálhatna a számla infók alapján. Például átlagolhatná a havi kiadást, vagy tehetne javaslatot az **optimális számlafizetési napra,** amikor minél több számlát ki tudok fizetni egyetlen kattintással és tranzakcióval.
