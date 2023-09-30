---
date: 2018-12-15
description: Összetákoltam egy szkriptet, amivel egy puritán changelog-ot tudok generálni. Aztán rájöttem, hogy egyáltalán nem követtem a jó changelog irányelveit.
lang: hu_HU
tags: automation bash changelog commit generator git markdown log script
title: Git changelog generálás
---

## Bevezetés

Böngészgettem GitHub-on, és felfigyeltem rá, hogy sok repóban van **changelog fájl** vagy fejezet a readme-ben. A changelog egy **hasznos dolog, tájékoztatja** a felhasználót (vagy fejlesztőt) az egyes verziók különbségeiről, a **bekövetkezett változásokról.** Ha elég ügyesek vagyunk, ezt a naplót megfelelő tool segítségével le is tudjuk generálni. A jó changelog irányelveit a [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) oldal írja le, szem előtt tartva úgy a napló olvashatóságát és értelmét, mint pedig a generálhatóságát (ld. commit message prefixek).

Namost a linken írtakat most olvastam el, miután a posztom vázlatát megírtam... és a helyzet az, hogy **a bejegyzés további része szembemegy az irányelvekkel.** Ez kissé talán lelomboz, viszont ettől még nem haszontalan megosztanom a ~~mai szenvedésem~~ ma szerzett tapasztalataimat a `git log` paranccsal.

## Célkitűzés

A dolog ott indul, hogy a [Díjnet bothoz](/blog/2018/dijnet-bot/) gondoltam changelog-ot generálni. A [repóról](https://github.com/juzraai/dijnet-bot) azt kell most tudni, hogy a commit message-eket kivételesen magyarul írom. **A célom pedig az, hogy a changelog tartalmazza az összes commit-ot, release-enként csoportosítva.** (vö. a fentebb linkelt irányelvekkel)

Keresgéltem létező generátorokat, kettőt emelnék ki:

-   [github-changelog-generator](https://github.com/github-changelog-generator/github-changelog-generator) - Ennek van a legtöbb csillaga, viszont nekem (most) nem megfelelő, mert **GitHub Issues-ból dolgozik,** amit nem használok a fent említett repóban.
-   [git-chglog](https://github.com/git-chglog/git-chglog/) - Ez kevésbé népszerű, viszont nagyon szimpatikus, mert a **git history-ból dolgozik,** egyetlen binárisból áll, könnyen **testreszabható** és config generátora is van. Ugyanakkor kipróbáltam, és nem azt kapom, amit várok. Ha kikapcsolom a commit type detektálást (message első szava alapján csoportosítás), akkor konkrétan üres lesz a generált napló.

Szóval nekiültem saját szkriptet írni.

## Kísérletezés

Először nézzük, mivel állunk szemben. Így néz ki a teljes log:

```
$ git log --oneline
b323e7d (HEAD -> master, single-inst) Lint
73a4bcd Csak egy instance maradhat
bf4a37f Szkriptek src mappába (átláthatóság++)
7c1fdb0 (tag: 1.0.1, origin/master, origin/HEAD) Logger konfig itt jobb helyen van
e724f7e Globális install működik
c8d7518 (tag: 1.0.0) Dependency update
e7e9abb Kép URL fix
f4a4114 Feladatok, ötletek
3655263 Doksi
51c3039 Sleep konfigban, exit code
2f6669e Fájlba mentés opcionális, log level állítható
80d90db Lint
285f280 Iteráció működik
f929777 Számla fájlok letöltése
d207817 Letöltő linkek parszolása
39d0ae8 Számla kiválasztás, fájlba mentés
f463a50 Számla alapadatok parszolása
cd4e40e szamla_search_submit
2ebca86 Login, szamla_search
ff608c9 Logger
5fa1938 Initial commit
```

Kipróbáltam a `git log` parancsot, és a `<since>...<until>` paramétert. Az unreleased commit-okat így tudom kilistázni:

```
$ git log --oneline 1.0.1...HEAD
b323e7d (HEAD -> master, single-inst) Lint
73a4bcd Csak egy instance maradhat
bf4a37f Szkriptek src mappába (átláthatóság++)
```

Az utolsó release adatait hasonlóan egyszerűen:

```
$ git log --oneline 1.0.0...1.0.1
7c1fdb0 (tag: 1.0.1, origin/master, origin/HEAD) Logger konfig itt jobb helyen van
e724f7e Globális install működik
```

Azonban a legelső release history-ját trükkösebb lekérdezni - mit kell megadni a `<since>`-nek? Semmit? Nem:

```
$ git log --oneline ...1.0.0
b323e7d (HEAD -> master, single-inst) Lint
73a4bcd Csak egy instance maradhat
bf4a37f Szkriptek src mappába (átláthatóság++)
7c1fdb0 (tag: 1.0.1, origin/master, origin/HEAD) Logger konfig itt jobb helyen van
e724f7e Globális install működik
```

A `HEAD` és az első release közti commit-okat kaptam vissza, vagyis pont az ellenkezőjét annak, amit szerettem volna.

Rengeteget keresgéltem, de nem találtam szebb megoldást annál, minthogy lekérem a legelső commit hash-t, és azt adom meg `<since>`-nek.

A legelső commit lekérdezésére 2 módszert találtam:

-   `git log --oneline | tail -1 | cut -d' ' -f 1`
-   `git rev-list --max-parents=0 HEAD`

Behelyettesítve a korábbi parancsba már megkapom az első release commit-jait:

```
$ git log --oneline `git log --oneline | tail -1 | cut -d' ' -f 1`...1.0.0
c8d7518 (tag: 1.0.0) Dependency update
e7e9abb Kép URL fix
f4a4114 Feladatok, ötletek
3655263 Doksi
51c3039 Sleep konfigban, exit code
2f6669e Fájlba mentés opcionális, log level állítható
80d90db Lint
285f280 Iteráció működik
f929777 Számla fájlok letöltése
d207817 Letöltő linkek parszolása
39d0ae8 Számla kiválasztás, fájlba mentés
f463a50 Számla alapadatok parszolása
cd4e40e szamla_search_submit
2ebca86 Login, szamla_search
ff608c9 Logger
```

Legalábbis majdnem. Ugyanis az intervallum alul nyitott, az _"Initial commit"_ kimaradt. Ezt explicit módon kell majd kiíratnom a changelog végére:

```
$ git log --oneline | tail -1
5fa1938 Initial commit
```

A fentiek automatizálásához szükség van a release-ek listájára is. Ezt az alábbi paranccsal kérdezhetem le:

```
$ git tag | sort -r
1.0.1
1.0.0
```

A changelog akkor szép, ha némileg formázva van, erre egy tökéletes eszköz a Markdown nyelv. A _"Changelog"_ felirat egy egyes szintű címsor, míg a release-ek másodszintűek lesznek. Köztük a commit-ok pedig felsorolások. Utóbbihoz a `--oneline` helyett saját formátumot kell megadni a `git log`-nak:

```
$ git log --pretty="* %s" | tail -1
* Initial commit
```

A `pretty` paraméterben használható változókról [itt írnak részletesen](https://git-scm.com/docs/pretty-formats).

## Összekalapálás

Algoritmus:

-   UNTIL := "HEAD"
-   Végig a release-eken:
    -   SINCE := aktuális release
    -   Release fejléc kiírása (UNTIL)
    -   Commitok kiírása SINCE...UNTIL tartományban
    -   UNTIL := SINCE
-   FIRST := legelső commit
-   Commitok kiírása FIRST...UNTIL tartományban
-   FIRST commit kiírása

Bash implementáció:

```bash
#!/usr/bin/env bash

write-commits() {
	git log --pretty="* %s" $1
}

write-release() {
	SINCE=$1; UNTIL=$2
	printf "\n## $UNTIL\n"
	write-commits $SINCE...$UNTIL
}

main() {
	echo "# Changelog"
	UNTIL="HEAD"
	for SINCE in `git tag | sort -r`; do
		write-release $SINCE $UNTIL
		UNTIL=$SINCE
	done
	FIRST=`git log --oneline | tail -1 | cut -d' ' -f 1`
	write-release $FIRST $UNTIL
	write-commits $FIRST
}

main
```

Output:

```markdown
$ ./my-git-changelog.sh

# Changelog

## HEAD

-   Lint
-   Csak egy instance maradhat
-   Szkriptek src mappába (átláthatóság++)

## 1.0.1

-   Logger konfig itt jobb helyen van
-   Globális install működik

## 1.0.0

-   Dependency update
-   Kép URL fix
-   Feladatok, ötletek
-   Doksi
-   Sleep konfigban, exit code
-   Fájlba mentés opcionális, log level állítható
-   Lint
-   Iteráció működik
-   Számla fájlok letöltése
-   Letöltő linkek parszolása
-   Számla kiválasztás, fájlba mentés
-   Számla alapadatok parszolása
-   szamla_search_submit
-   Login, szamla_search
-   Logger
-   Initial commit
```

A fájlba írás pedig innen már pofon egyszerű: `./my-git-changelog.sh > CHANGELOG.md`.

## EpiLog

Lehetne még persze tuningolni azzal, hogy a release-ekhez dátumot is kiírok, de most ezt nem teszem meg.

Ahogy a bevezetőben is említettem, a **jó changelog NEM ez,** amit most tákoltam össze. Ugyanis nem, vagy csak nagyon **nehezen derül ki belőle,** hogy a felhasználónak mire kell figyelnie, mire számíthat - változott-e az API, bekerült-e új feaure, javítva lett-e a hiba, amitől kihullott a haja, etc. Ehelyett a fenti megoldás kiprinteli még a legeslegérdektelenebb commitot is, az _initial_-t... 🤓
