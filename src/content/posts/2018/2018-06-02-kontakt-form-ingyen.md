---
alt:
    en_US: /blog/2018/contact-form-for-free
date: 2018-06-02
description: '[Frissítve: 2020] A statikus honlapomra keresgéltem ingyenes kontakt form megoldásokat. Ebben a posztban összehasonlítom a szolgáltatásokat, amiket találtam.'
lang: hu_HU
tags: comparison email form serverless
title: Kontakt form ingyen - körbenézés
---

[next]: {{ 'blog/2018/kontakt-form-basin-nel' | relative_url }}

A bejegyzésben szereplő adatokat 2020. júliusában frissítettem.

## A probléma

A blogom és egyben fejlesztői bemutatkozó oldalam egy **statikus honlap,** amit a [GitHub Pages][gh-pages]-en hosztolok. Elérhetőségként feltüntetem a Facebook és LinkedIn profilom, de az email címemet nem szeretném, mert a **spam nem hiányzik.** Kitennék viszont **kapcsolati űrlapot**, ami lehetőséget biztosítana az oldalamra tévedőknek, hogy mindenféle bejelentkezés és továbbkattintás nélkül el tudjanak engem érni.

Mivel azonban a honlap statikus, **szerveroldali szkript nélkül** kell megoldani a form feldolgozását, és a kapott adatok kiküldését az email címemre. Muszáj tehát erre a feladatra egy **külső szolgáltatást** keresni. És persze, ha már eddig is spóroltam, akkor itt is tartsuk a **költségeket zérón.**

## Lehetőségek

Egy napot töltöttem azzal, hogy körbenézzek, mik a lehetőségek. Csak olyan szolgáltatásokat kerestem, amelyek általam kreált **saját HTML form** adatait is tudják fogadni és email-ben kiküldeni. Ábécé sorrendben listázom, amiket találtam.

Megjegyzés: _"AJAX"_ alatt a továbbiakban azt a funkciót értem, hogy az endpoint AJAX-al hívható és szöveges választ ad, szemben a hagyományos form küldéssel, ami jellemzően egy teljes lapot ad vissza, vagy átirányít.

A [99inbound][99inbound] **100 email/hó** limittel rendelkezik, van benne **spam filter, illetve Slack integráció.** Ráadásként form builder is van hozzá, akinek kell. Friss, GDPR-os adatkezelési tájékoztatójuk van.

A [Basin][basin] új limitje **100 email/hónap**, emellett rengeteg funkciója van: **spam filter, redirect, fájl feltöltés, AJAX, export, analitika, valamint Zapier integráció** néhány népszerű alkalmazásba (pl. Slack, Trello, Asana, Google Sheets). A [Zapier][zapier]-ben pedig a 2-lépcsős (trigger+action) folyamatok ingyenesek. Professzionális és felkészült cuccnak tűnik, korrekt GDPR notice is van a honlapjukon. A [ProductHunt][ph-basin]-on pozitívak az értékelések és aktívak a fejlesztők.

Az [elFormo][elFormo] **1500 emailt ad havonta** és van benne **honeypot és redirect** lehetőség, bár átirányítás előtt felvillantja a logójukat. A beérkezett űrlapadatok böngészhetők és **exportálhatók.** Noha a honlapjuk stílusos és megnyerő, nem sok review-t találni hozzá, és minden médiumon 2015-ben szólaltak meg utoljára.

Az [enformed.io][enformed.io] **100 emailt ad havonta**. Funkciók: **egyéni levél tárgy, CC, BCC, honeypot, redirect, AJAX.** Viszont adatkezelési tájékoztatójuk nincs, a regisztrációs űrlapjuk meg konkrétan halott.

A [formspree.io][formspree.io]-val évekkel ezelőtt is találkoztam már, egy ingyenes honlap sablon is ezt a szolgáltatást ajánlotta a kontakt formhoz. Az ingyenes rész limitje **50 email/hó**, van **egyéni levél tárgy, CC, redirect, captcha,** még **Zapier integráció** is. Sokat fejlődött az elmúlt években, korrekt dokumentációja is van.

A kapcsolati űrlaphoz használható akár egy [Google Form][g-forms] is backend-ként. A limitre mindenhol más értéket találok, de **50-100 email/napot** írnak a legtöbb helyen. Viszont ha nem küldi ki az email-t, akkor sincs gond, mert az űrlap adatait beteszi egy **spreadsheet**-be.

Hasonlóan az előzőhöz, [Google Apps Script][g-script]-el is megoldható, hogy spreadsheet-be kerüljenek az adatok előbb, és aztán legyenek kiküldve email-ben. A kvóta **100 email/nap** és van **AJAX küldés.** A szkript nyilván kiegészíthető honeypot-tal és captcha-val is.

A [mailthis.to][mailthis.to]-nál picit más az üzleti koncepció, a használat szerint kell fizetni. Nem havi limitek vannak, hanem regisztrációkor kapsz **1000 ingyen emailt**, és további 1000 emailt vehetsz néhány dolcsiért. Van **egyéni levél tárgy, honeypot, redirect, fájl feltöltés, AJAX és captcha.** [E cikk](https://medium.com/@jamesfuthey/running-a-free-email-api-for-2-years-a39188e19985) alapján is szimpatikus ez a cucc, viszont itt sem találok privacy policy-t.

A [Pageclip][pageclip] **havi 1000 küldést** enged, van **egyéni levél tárgy és AJAX lehetőség, tárolja az adatokat** JSON formában. Van kliens és szerveroldali JavaScript könyvtár is hozzá. A főoldalon hirdetik a Slack integrációt, de a doksiban erről nincs infó. Elég részletes viszont az adatkezelési tájékoztatójuk.

A [SimpleForm][simpleform] honlapja elég szűkszavú. Nincs szó limitekről, de azt megtudjuk, hogy **fogad fájlokat** és az űrlapadatok lekérhetőek **API-n** át. A copyright 2012-es, a blogjuk 2014-ben frissült utoljára, habár a site-on a verziószám 2018-as.

Az [Un-Static][unstatic] (korábban: BriskForms) szűk **25 email/form/hó**-nál húzza meg a limitet, de biztosít **redirect, spam filter** és **captcha** funkciókat.

Lássuk mindezt táblázatban:

Szolgáltatás | Limit | Spam | Redirect | Tárol? | Extra

-                              |          |          |          |        |
    [99inbound][99inbound] | 100/hó | filter | ? | - | Slack
    [Basin][basin] | 100/hó | filter | van | igen | fájl, captcha, Zapier
    [elFormo][elFormo] | 1500/hó | honeypot | van | igen | -
    [enformed.io][enformed.io] | 100/hó | honeypot | van | - | tárgy, CC, BCC, AJAX
    [formspree.io][formspree.io] | 50/hó | honeypot | van | igen | tárgy, CC, AJAX, captcha, Zapier
    [G. Apps Script][g-script] | 100/nap | - | - | igen | tárgy, AJAX, ...
    [G. Forms][g-forms] | ~ 50/nap | - | - | igen | -
    [mailthis.to][mailthis.to] | 1000 | honeypot | van | - | tárgy, fájl, AJAX, captcha
    [Pageclip][pageclip] | 1000/hó | - | - | igen | tárgy, AJAX, API
    [SimpleForm][simpleform] | - | - | - | igen | fájl
    [Un-Static][unstatic] | 25/hó | filter | van | - | captcha
    {: .table.table-sm.table-responsive-md}

## Összegzés

A fenti listát a következőképp szűkítem:

-   A 2 Google megoldást kicsit macerásabb összerakni, illetve nem érzem igazán elegáns megoldásnak erre a feladatra, pláne látva a többi versenyzőt.
-   A [formspree.io][formspree.io]... a poszt megírásakor nem tudta elrejteni az email címemet, de most már tudja.
-   Az [enformed.io][enformed.io] több sebből vérzik.
-   A [mailthis.to][mailthis.to] szimpatikus lenne, de csak egyszeri 1000 emailt ad, ami az összes többinél korlátoltabb.
-   A [SimpleForm][simpleform] nem informatív, puritán és réginek tűnik.
-   Az [elFormo][elFormo] is szimpatikusnak tűnt, de ez is porosodik már, és vannak jobbak a mezőnyben.
-   A [Pageclip][pageclip]-en kívül az összes játékban maradt versenyző biztosít spam filtert.
-   🥉 A dobogó 3. fokán az [Un-Static][unstatic] áll meg, mert... ez a régi BriskForms, ami a 3. helyre került a poszt írásakor.
-   🥈 Az ezüstérmet a [99inbound][99inbound]-nak osztom, mert
-   🥇 a [Basin][basin] egy fokkal profibbnak és flexibilisebbnek tűnik. (+ A poszt írásakor korlátlan form küldést biztosított az ingyenes csomagban is.)

A fenti dolgokat persze **kipróbálás nélkül** írtam. A [következő posztban][next] leírom a tapasztalataimat a [Basin][basin]-nel, ugyanis az aranyérem jó helyre került. 🤓

[99inbound]: https://www.99inbound.com/
[basin]: https://usebasin.com/
[elFormo]: https://www.elformo.com/
[enformed.io]: http://www.enformed.io/
[formspree.io]: https://formspree.io/
[g-forms]: https://github.com/toperkin/staticFormEmails
[g-script]: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server
[gh-pages]: https://pages.github.com/
[mailthis.to]: https://mailthis.to/
[pageclip]: https://pageclip.co/
[ph-basin]: https://www.producthunt.com/posts/basin
[simpleform]: https://getsimpleform.com/
[unstatic]: https://un-static.com/
[zapier]: https://zapier.com/
