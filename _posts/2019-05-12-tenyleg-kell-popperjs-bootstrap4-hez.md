---
alt:
  en_US: /blog/2019/is-popperjs-requried-for-bootstrap4/
description: Jó pár hónapja válaszoltam StackOverflow-n arra a kérdésre, hogy a Bootstrap 4 mely komponensei használnak Popper.js-t, és utóbbit muszáj-e importálni.
lang: hu_HU
tags: bootstrap popperjs stackoverflow
title: Tényleg kell Popper.js Bootstrap 4-hez?
---

Jó pár hónapja találtam [ezt a kérdést StackOverflow-n][q]:

> Azt szeretném kérdezni, hogy a Popper.js tényleg szükséges-e, ha nem használok dropdown menu-t\*? Vannak más Bootstrap 4 komponensek, amik a Popper.js-re épülnek és nem tudnak működni nélküle?

<small>\*: A komponenseket direkt nem fogom lefordítgatni, mert 1) nem tudom, mi lenne a korrekt magyar megfelelőjük, 2) mivel szakszavak, talán nem is kell őket fordítani.</small>

Utánanéztem kicsit a dolgoknak, és [válaszoltam a kérdésre][a]. Azért került most elő ez a téma, mert időnként kapok upvote-okat, és eddig ez a legmagasabb pontszámú válaszom. (Jó, hát a 15 pontjával nyilván nevetséges a [Stack Overflow nindzsák][n] posztjaihoz képest, de én ezzel is boldog vagyok. 🤓) Jelen bejegyzés azért születik, hogy terjesszem az infókat, illetve hogy még pár gondolatot hozzátoldjak a válaszomhoz.



## Mely Bootstrap 4 komponensek használják a Popper.js-t?

Ahhoz, hogy ezt megválaszoljuk, a legegyszerűbb, amit tehetünk, hogy megnyitjuk a dokumentációt és használjuk a keresődobozát.

Ha rákeresünk a `popper`-re a [Bootstrap 4 dokumentációban][d], az alábbi találatokat kapjuk:

> Tooltips rely on the 3rd party library **Popper.js** for positioning.
>
> Popovers rely on the 3rd party library **Popper.js** for positioning.
>
> Dropdowns are built on a third party library, **Popper.js**, which provides dynamic positioning and viewport detection.

(A fentiek a Beta doksiból vannak. A kurrens doksiban más a megfogalmazás, de az eredmény azonos.)

**Szóval ezek a Bootstrap 4 komponensek használnak Popper.js-t:**

* dropdown
* popover
* tooltip

(A StackOverflow-n olvasható válaszom tanúsága szerint a Bootstrap 4 Beta verziójának még a modal-hoz is kellett a Popper.js, de ez már nem igaz a kurrens 4.3.1 verzióra.)



## Szükséges a Popper.js, ha nem használom a fenti komponenseket?

A Popper.js követelményként van említve a dokumentációban:

> Many of our components require the use of JavaScript to function. Specifically, they require jQuery, Popper.js, and our own JavaScript plugins. Place the following scripts near the end of your pages, right before the closing `</body>` tag, to enable them. jQuery must come first, then Popper.js, and then our JavaScript plugins.

És a Bootstrap 4 JS (legalábbis a Beta verzió) hibaüzenetet ír a logba, ha nem találja a Popper.js-t:

```
Uncaught Error: Bootstrap dropdown require Popper.js (https://popper.js.org)
    at bootstrap.min.js:6
    at bootstrap.min.js:6
    at bootstrap.min.js:6
```

Ugyanakkor a **Bootstrap 4 használható Popper.js nélkül, ha nem használunk tooltip-eket, popover-eket vagy dropdown-okat.** Például a navbar JS funkcionalitása (mobil menu a jobb szélen) [kiválóan működik Popper.js nélkül][a].



## ...de hát van bundle!

Több válasz is említi a szóban forgó kérdés alatt, hogy a Bootstrap 4-nek van egy bundle verziója, ami **tartalmazza a Popper.js-t,** tehát nem kell görcsölni a Popper.js kézzel importálásán.

Az én véleményem viszont az, vagy legalábbis számomra a kérdésnek pont az az értelme, hogy azért nem importáljuk a Popper.js-t, mert csökkenteni szeretnénk a weboldalunk betöltési idejét azzal, hogy **csak a szükséges dolgokat importáljuk.** Ebben az esetben azonban a bundle nem segít.



[a]: https://stackoverflow.com/a/46155285/2418224
[d]: https://getbootstrap.com/docs/4.3/getting-started/introduction/
[n]: https://stackoverflow.com/users?tab=Reputation&filter=all
[q]: https://stackoverflow.com/questions/46155017/bootstrap-4-beta-is-popper-js-required/46155285