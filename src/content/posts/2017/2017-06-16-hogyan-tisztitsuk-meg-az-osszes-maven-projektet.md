---
alt:
    en_US: /blog/2017/how-to-clean-all-maven-projects
date: 2017-06-16
description: Bizonyos szituációkban szükségessé válik, hogy egy mappán belül az összes Maven projektet megpucoljuk. Itt egy Bash egysoros megoldás rá. :)
lang: hu_HU
tags: automation bash cleanup maven script
title: Hogyan tisztítsuk meg az összes Maven projektet
---

A "dev" mappámban rendszerint több tucat aktuális projektet tartok, és nemigen szoktam kézzel hívogatni a `mvn clean`-t. Viszont amikor például backup-olnám a mappámat, totál fölösleges a `target` mappákat is eltenni, ha azok legenerálhatóak bármikor. Tehát meg kell hívni az `mvn clean`-t minden projektre, amit így automatizáltam _Bash_ segítségével:

```bash
find . -name "target" -type d \
  | sed s/target/pom.xml/ \
  | tee /dev/stderr \
  | xargs -I {} mvn -q clean -f {}
```

-   A `find`-al leszűröm az összes `target` mappát,
-   `sed`-el a mappa elérési útját az adott projekt `pom.xml`-jének útvonalára cserélem,
-   a `tee`-vel csak kiíratom az elérési utat, hogy tudjam, melyik projekt tisztul épp,
-   végül az `xargs` segít átadni az értéket a Maven parancsának.

Mivel a `find` rekurzívan lemászik mindenhová, a szkriptet a "dev" mappám gyökeréből, vagy akár a vinyó gyökeréből hívva minden egyes projektem megtisztul. 😎

(Windows-on fejlesztesz? Pl. a [Git for Windows](https://git-for-windows.github.io/) pakkban van _Bash_ terminál is, vagy használhatod a [Linux alrendszert](https://msdn.microsoft.com/en-us/commandline/wsl/about))
