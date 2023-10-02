---
alt:
    en: /blog/2018/contact-form-using-basin
date: 2018-06-03
description: A minap írtam arról, milyen ingyenes lehetőségek vannak arra, hogy egy statikus honlapra kontakt formot illesszünk, amely emailt küld. Kipróbáltam a Basin-t, aminek látatlanban aranyérmet osztottam. Lássuk a tapasztalatokat!
lang: hu
lightbox: true
tags: basin captcha email form serverless
title: Kontakt form ingyen, Basin-nel
---

[prev]: /blog/2018/kontakt-form-ingyen

A [minap írtam][prev] arról, milyen ingyenes lehetőségek vannak arra, hogy egy statikus honlapra kontakt formot illesszünk, amely emailt küld. Kipróbáltam a [Basin][basin]-t, aminek látatlanban aranyérmet osztottam. Íme a tapasztalataim. 🙂

## Első lépések

A sign up oldal lényegretörő, csak az email címemet kéri és persze a leendő jelszavamat. Az email címet persze meg kell erősíteni, utána enged csak bejelentkezni.

Bejelentkezés után bejön az üres dashboard. Mielőtt létrehoztam az űrlapomat, megnéztem az _Account settings_ menüpontot. Az email címen és a jelszón kívül ott sincs semmi extra, csak egy lehetőség a maradéktalan törlésre.

Amikor létrehozunk egy új formot, először 2 dolgot kér be: a form nevét (amit a dashboard-on látunk majd), illetve a **redirect URL-t,** ahová a látogatókat küldi majd a rendszer a form elküldése után. Ha ezutóbbit üresen hagyjuk, a Basin a saját oldalára visz alapértelmezésként.

Amint létrehoztuk a formot, az megnyílik a felületen, egyből az üres _Submissions_ panelt kapjuk meg. Az már látszik, hogy a beérkezett üzeneteket **lehet szűrni, törölni, illetve spam-nek jelölni.**

A _Setup_ fülön **konkrét HTML kódokat mutat,** amivel tényleg csak copy-paste módon be lehet illeszteni a honlapba az űrlapot. Van snippet a kattintós Google captcha-hoz, és a láthatatlan verzióhoz is.

Az _Edit_ fülön további beállításokat találunk az űrlaphoz:

-   meg lehet adni **több whitelisted domaint**, ahonnan engedélyezzük a form küldést
-   be lehet kapcsolni a valid captcha válasz megkövetelését
-   illetve van lehetőség GDPR kompatibilis **nyugtát visszaküldeni az adatok fogadásáról** a küldőnek

Az _Email_ fülön átállíthatjuk a cél email címet, ahová az űrlapadatokat kérjük küldeni. Ez alapértelmezésként a regisztrációkor megadott email cím. Továbbá megadhatunk **CC-t, egyéni küldö nevet** (_"Basin"_ helyett) és a **tárgy is szerkeszthető.** A tárgy alapértelmezésként a form neve + _"You've received a submission_.

## Tesztelés

Bekapcsoltam a captcha-t és a receipt-et, és összeraktam a formot a láthatatlan captcha-val. Zseniális, hogy **tesztelhető localhost-ról is.** Elküldtem a formot, és a megadott URL-re irányított a rendszer. A levél pár másodperc múlva megérkezett arra email címemre, amivel a [Basin][basin]-be regisztráltam. Szépen formázva mutat minden fontos információt:

[![Basin submission email](/assets/basin/basin-submission-email.png)](/assets/basin/basin-submission-email.png)

A reply-to is korrektül be van állítva, egy kattintással tudok válaszolni a formon megadott email címre.

A formon beírt email címre is jött egy levél, ami **nyugtázza, hogy milyen adatokat küldtem és hova,** és még ezzel kapcsolatos kérelmekhez is biztosít lehetőséget:

[![Basin receipt email](/assets/basin/basin-receipt-email.png)](/assets/basin/basin-receipt-email.png)

A _Submissions_ panelen is megjelentek ezek az információk természetesen. Tovább nézve a funkciókat, az _Export_ panelen a beküldött form adatok **letölthetőek CSV-ben, illetve JSON-ban is** egy API key segítségével. Az _Integrations_ fülön lehet [Zapier][zapier]-hez kapcsolódni, de ezt most nem teszem meg, a célt elértük.

**Az aranyérem jogos volt! A [Basin][basin] professzionális, könnyen kezelhető, felhasználóbarát, GDPR-ready, ingyenes szolgáltatás.** 🏆

Pontosan erre volt szükségem.

## Kiegészítés

Egy apró kiegészítésre szükség van, a [Google reCAPTCHA][recaptcha] helyes működéséhez. A [Basin][basin] által adott code snippet úgy működik, hogy a küldés gomb kattintás eseményét a reCAPTCHA kezeli le, és **egyből elküldi** az űrlapot. Ez akkor okoz problémát, **ha szeretnénk validálni a formot,** akár natívan, akár saját JS kóddal. A **megoldást** [ez a válasz][so-recaptcha] adja meg, bemutatom:

```html
<form
	id="invisible-recaptcha-form"
	accept-charset="UTF-8"
	action="https://usebasin.com/f/..."
	method="POST"
>
	<!-- input elemek -->

	<div
		class="g-recaptcha"
		data-sitekey="..."
		data-callback="onSubmit"
		data-badge="inline"
		data-size="invisible"
	></div>
	<button class="btn btn-primary">Küldés</button>
</form>
<script
	src="https://www.google.com/recaptcha/api.js"
	async
	defer
></script>
<script>
	document.getElementById('invisible-recaptcha-form').addEventListener(
		'submit',
		function () {
			event.preventDefault();
			grecaptcha.reset();
			grecaptcha.execute();
		},
		false,
	);
	function onSubmit(token) {
		document.getElementById('invisible-recaptcha-form').submit();
	}
</script>
```

Mit csináltam a [Basin][basin] kódjához képest:

-   A `g-recaptcha` class-t levettem a küldés gombról, és egy új `<div>`-re raktam rá.
-   Ebbe a `<div>` elembe átvittem a `data-*` attribútumokat, illetve hozzá is adtam egyet: `data-size="invisible"`.
-   A szkripthez hozzáadtam egy eseménykezelőt, ami a form elküldésekor fut le, és meghívja a captcha-t.

Így a küldés gombra kattintáskor a következő fog történni:

-   Először a böngésző natív validálási mechanizmusa fut le.
-   Aztán az eseménykezelő inicializálja a captcha-t.
-   A captcha elhelyezi a választ a formban, majd meghívja a callback-et, ami elküldi a form-ot.

[basin]: https://usebasin.com/
[recaptcha]: https://developers.google.com/recaptcha/
[so-recaptcha]: https://stackoverflow.com/a/41694352/2418224
[zapier]: https://zapier.com/
