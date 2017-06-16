---
title: "mvn clean - minden projektre"
tags: bash maven script tool
excerpt: Egysoros Bash szkript, mellyel egy mappán belül az összes Maven projekt megpucolható :)
---

A "dev" mappámban rendszerint több tucat aktuális projektet tartok, és nemigen szoktam kézzel hívogatni a `mvn clean`-t. Viszont amikor például backup-olnám a mappámat, totál fölösleges a `target` mappákat is eltenni, ha azok legenerálhatóak bármikor. Szóval meg kéne hívni az `mvn clean`-t, de minden projektre... amit nyilván nem fogok kézzel. :) Ezt a megoldást dolgoztam ki:

```
find . -name "target" -type d \
  | sed s/target/pom.xml/ \
  | tee /dev/stderr \
  | xargs -I {} mvn -q clean -f {}
```

* A `find`-al leszűröm az összes `target` mappát,
* `sed`-el a mappa elérési útját az adott projekt `pom.xml`-jének útvonalára cserélem,
* a `tee`-vel csak kiíratom az elérési utat, hogy tudjam, melyik projekt tisztul épp,
* végül az `xargs` segít átadni az értéket a Maven parancsának.

Mivel a `find` rekurzívan lemászik mindenhová, a szkriptet a "dev" mappám gyökeréből, vagy akár a vinyó gyökeréből hívva minden egyes projektem megtisztul. :)

(Windows-on fejlesztesz? Pl. a [Git for Windows](https://git-for-windows.github.io/) pakkban van *Bash* terminál is, vagy használhatod a [Linux alrendszert](https://msdn.microsoft.com/en-us/commandline/wsl/about) ;))
