---
alt:
  en_US: /blog/2013/about-pubsearch/
description: Ez volt az egyetemi szakdolgozatom. Publikációs adatbázisokban lehet vele keresni, és az idézéseket is leszedi. 2013-ban a Softpedia is felkapta.
lang: hu_HU
lightbox: true
tags: crawling project pubsearch
title: A PubSearch-ről
---

A bejegyzés nagyobb része 2013. februárjában írodott, 2018-ban aktualizáltam.



## Történet

Ez a program volt a szakdolgozatom az egyetemen és egyben az első interneten publikált projektem. Létrehoztam hozzá egy [SourceForge projektet][sourceforge], hogy SVN-t tudjak használni, meg legyen wiki-m, ahol a terveket szövöm.

Egy évvel a projekt elkezdése után, amikor már jó pár hónapja megvolt az v1.0, 2013 első heteiben kaptam egy levelet a Softpedia-tól, melyben arról tájékoztattak, hogy a programomat [felvették a szoftveradatbázisukba][softpedia].

4 órán belül 14-en letöltötték, ez akkor egy kis löketet adott, hogy továbbfejlesszem a programot. Nagy vonalakban megterveztem a PubSearch 2-t, de az implementáció sajnos elsikkadt a többi teendőm között.

A Softpedia-ról pár évvel később lekerült a programom, talán azért, mert időközben haszontalanná vált a frissítéseim nélkül.



## Mi is ez?

Ez egy Java program, amivel több publikációs adatbázisban kereshetsz (mint például Google Scholar, CiteSeerX, ACM, SpringerLink). Beírod a szerző nevét és a PubSearch összegyűjti ezen szerző publikációinak alapvető információit. Képes letölteni tranzitívan a hivatkozó publikációk listáját is, tehát egy kutató használhatja a programot impakt faktorának kiszámításához.

[![PubSearch keresési eredmények]({{ '/assets/pubsearch/screenshot-3-new.jpg' | relative_url }})]({{ '/assets/pubsearch/screenshot-3-new.jpg' | relative_url }})

A program proxy listát használ a weboldalak elérésére, hogy elkerülje a sorozatos lekérdezésekből adódó esetleges tiltást. Az adatbázisok bejárási módját a program definíciós fájlokból olvassa ki, melyet egyszerű szövegszerkesztővel lehet készíteni vagy módosítani. A publikációk adatait exportálhatod könyvtári formátumokban.

[![PubSearch BibTeX]({{ '/assets/pubsearch/pubtab-bibtex.jpg' | relative_url }})]({{ '/assets/pubsearch/pubtab-bibtex.jpg' | relative_url }})

JRE, MySQL és egy proxy lista szükséges a futtatásához.



## Funkciók

> Mivel a publikációs adatbázisok weboldalai megváltoztak mióta utoljára ezzel foglalkoztam, a program jelenleg nem sok eredményt tud listázni.

* a következő publikációs adatbázisokban keres:
	* [ACM Digital Library](https://dl.acm.org/)
	* [CiteSeerX](http://citeseerx.ist.psu.edu/)
	* [Computer Science Bibliography Collection](https://liinwww.ira.uka.de/bibliography/)
	* [DBLP](https://dblp.uni-trier.de/)
	* [Google Scholar](https://scholar.google.com/)
	* [Mendeley](https://www.mendeley.com/)
	* [MetaPress](http://www.metapress.com/)
	* [SpringerLink](https://link.springer.com/)
* hozzáadhatsz/módosíthatod az adatbázis definíciós fájlokat
* automatikus proxy lista letöltés
* hivatkozó publikációk listájának tranzitív bejárása (ahol lehetséges)
* az adatokat MySQL adatbázisban tárolja
* az eredmény táblázat exportálható CSV vagy könyvtári formátumban
* az egyes publikációk adatai exportálhatóak könyvtári formátumban
* hozzáadhatsz/módosíthatod a könyvtári formátum sablonokat
* magyar és angol grafikus felület



## Linkek

* [SourceForge projekt](https://sourceforge.net/projects/pubsearch/)
* [Forráskód](https://github.com/juzraai/PubSearch)



## Továbbfejlesztési ötletek

* Még 2013 év elején nagy vonalakban megterveztem a PubSearch 2-t, melynek lényege a modularitás. A cél az, hogy univerzálisabb legyen a program. A publikációs adatbázisok oldalai folyamatosan változnak, és habár a PubSearch 1.x definíciós fájljait könnyű aktualizálni, bizonyos adatokat, funkciókat ezeken a site-okon már nem lehet a beégetett, egységes algoritmussal elérni. Ezért lehetőséget kéne biztosítani moduláris bővítésre, egy Java interfészen keresztül. Így specializált crawlereket lehetne hozzáadni a programhoz, JAR fájlokban, amiket a program betöltene induláskor. És persze magát a PubSearch 1.x-et egy beégetett crawlerként továbbra is lehetne használni.
[![PubSearch 2 terv]({{ '/assets/pubsearch/v6-structure-logi.png' | relative_url }})]({{ '/assets/pubsearch/v6-structure-logi.png' | relative_url }})
* Több beállítási lehetőség is jól jönne a programba, pl. publikációs adatbázisok kiválasztása, konfigurálható proxy kezelés.
* A HTML parszolást is elegánsabbá kéne tenni. Anno jobb ötlet híján reguláris kifejezésekkel parszoltam, ami [mint tudjuk][html-regex], nem egészséges.
* Jó lenne publikáció merge funkció is, amennyire lehet automatizáltan.



[html-regex]: https://stackoverflow.com/a/1732454/2418224
[softpedia]: http://www.softpedia.com/get/Internet/Servers/Database-Utils/PubSearch.shtml
[sourceforge]: http://pubsearch.sf.net/