---
date: 2018-11-04
description: Pár órát elmolyoltam, mire megtaláltam a megoldást, hogyan tudok könnyen Gitea-be költözni a repóimmal. A doksi nem valami segítőkész, az apróbetű a kulcs.
lang: hu
tags: config git gitea import migrate server web-ui
title: Lokális repók importálása Gitea-be
---

## Bevezetés

A Gitea komolyabb használata előtt érdemes **végigolvasni az [összes beállítási lehetőséget][conf]**, ugyanis ez a kulcs sokmindenhez, bizonyos dolgok sehol máshol nincsenek dokumentálva. A Gitea-s doksi nem valami segítőkész, nem ír külön a funkciókról és azok használatáról, megkötéseiről. Így van ez a repó importálással is.

Az alapszitu az, hogy a Gitea `gitea-repositories` mappájába sajnos nem elég és nem is célravezető csak simán bemásolni egy bare repository-t. Ugyanis a Gitea csak azokat a repókat kezeli, amiket ő nyilvántartásba vett az **adatbázisában,** és egyébként is **saját Git hook-okat** használ. Vagyis a Gitea UI-ról kell őket létrehozni, nincs mese.

## Migrálás

Szerencsére a felület biztosít egy migrálás opciót (fent a "+" ikon lenyíló menüjében). Ennek a funkciónak azonban vannak trükkjei.

Egyrészt, mint ahogy pár sikertelen próbálkozás után egy [GitHub issue][ssh]-ból megtudtam, az **SSH nem támogatott** ennél a funkciónál.

Másrészt, kínjában az ember kipróbálja már a **local path**-t is, amikre a rendszer szintén visszapofázik, miszerint ez **nem engedélyezett**.

A _Site Administration > User Accounts_ oldalon a saját **fiókom szerkesztésénél,** a lap alján van egy _May import local repositories_ jelölőnégyzet. Ha ezt bepipálom és elmentem, csak egy pillanatig érzem a remény édes ízét, mert amint újratöltődik a lap, a pipa eltűnik. És persze az importálás nem működik. Mindennek ellenére az adatbázisban (megnéztem), a megfelelő flag-et átbillentette 1-esre, tehát elmentette, csak nem jeleníti meg...

...mert van egy **globális tiltás is.** És ezt én egyetlen egy helyen láttam leírva (amit jóval azután néztem meg, hogy beletőrödtem a kudarcba), a [Config Cheat Sheet][conf]-en, ahol felsorolja az összes paramétert:

> `IMPORT_LOCAL_PATHS`: **false:** Prevent all users (including admin) from importing local path on server.

Vagyis:

1. A `custom/conf/app.ini` konfigfájlban engedélyezni kell globálisan a lokális importot:

```ini
[security]
IMPORT_LOCAL_PATHS = true
```

2. A felületen, a _Site Administration > User Accounts_ alatt a saját fiókunk szerkesztésénél (_Edit_) egyénileg is engedélyezni kell ezt, a _May import local repositories_ jelölőnégyzet bepipálásával tehetjük meg
3. Ezután már megadhatunk a migrálásnál helyi útvonalat, pl. `/home/me/bare-repos/repo1`

Migráláskor a Gitea gyakorlatilag csinál egy másolatot a megadott repóról a `gitea-repositories`-ba és regisztrálja az adatbázisba.

## Git módszer

Természetesen Git parancsokkal is migrálhatunk, kívülről:

```bash
git clone --mirror OLD_REPO_URL
cd OLD_REPO.git
git remote set-url origin http://GITEA_DOMAIN/GITEA_USER/NEW_REPO.git
git push --mirror origin
```

Viszont a push előtt a fentebb írtak miatt **előbb létre kell hozni a repót** a Gitea webes felületén.

[conf]: https://docs.gitea.io/en-us/config-cheat-sheet/
[ssh]: https://github.com/go-gitea/gitea/issues/1635
