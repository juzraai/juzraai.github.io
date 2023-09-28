---
description: Néhány konfigurációs lépés és tapasztalat, különböző szituációkhoz Heritrix 3-mal történő weboldal archiváláshoz.
lang: hu_HU
tags: automation config crawling heritrix
title: Heritrix 3 konfig receptkönyv
---

Gondoltam megosztom a tapasztalatokat, hátha akad olyan "elvetemült", aki szintén [Heritrix][heritrix]-szel akar nekiállni site-okat archiválni. 🤪 Az alábbiakban leírom azokat a beállítási lehetőségeket, amelyek munkám során előjöttek, fontosak voltak.

A konfigurációt Heritrix-ben job-onként lehet elvégezni, a `crawler-beans.cxml` fájl módosításával.

## 1. Kezdő lépések

### 1.1. URL-ek hozzáadása

A legfontosabb dolog egy job-nál a forrás URL-ek hozzáadása, vagyis: honnan induljon a letöltés? A CXML-ben keressük meg ezt a részt:

```xml
<bean id="longerOverrides" class="org.springframework.beans.factory.config.PropertyOverrideConfigurer">
  <property name="properties">
    <props>
      <prop key="seeds.textSource.value">

        # URLS HERE

      </prop>
    </props>
  </property>
</bean>
```

Itt az URL-eket soronként írhatjuk be.



### 1.2. Operátor kontakt címe

A Heritrix **megköveteli, hogy beírjunk egy URL-t,** ami a letöltést végző egyén/szervezet honlapjára mutat. Ez az URL hozzá lesz adva a `User-agent` paraméterhez. (Lesz még szó róla a 2.6.-os bekezdésben.) Nyilván ez a felelősség miatt kell, hogy ha leterheljük valakinek a szerverét egy izmos crawl futammal, és az nemtetszést vált ki, akkor vissza lehessen keresni minket.

Keressünk rá az alábbira, hogy megtaláljuk, hova kell írni ezt a címet:

```
metadata.operatorContactUrl=
```



## 2. Testreszabás

### 2.1. Tárolási mód

A Heritrix 3 alapesetben [WARC][warc] fájlokba írja a letöltött adatokat. Előfordulhatnak esetek, amikor nekünk nem erre van szükségünk, hanem esetleg konkrétan a fájlokra, vagy esetleg WARC helyett [ARC][arc] fájlokra.

Ehhez a `warcWriter` bean class paraméterét kell megfelelően beállítanunk:

```xml
<bean id="warcWriter" class="org.archive.modules.writer.WARCWriterProcessor">
```

Lehetőségek (a package ugyanaz):

* `WARCWriterProcessor`
* `ARCWriterProcessor`
* `MirrorWriterProcessor` - ez tükrözi a mappaszerkezetet



### 2.2. Domain-en belül maradás

Ha egy site-ot archiválunk, általában nem akarjuk követni az összes linket a végtelenségig rekurzívan, mert végtelen időnk és tárkapacitásunk nincs. Az lenne a cél, hogy a rekurzív bejárás az adott **kiinduális domain-re szorítkozzon, ne lépjen ki onnan.**

Ezt egy Heritrix 3 job esetén úgy tehetjük meg, hogy az alábbi bean-t konkrétan kitöröljük/kikommentezzük a config CXML-ből:

```xml
<!--
  <bean class="org.archive.modules.deciderules.TransclusionDecideRule">
    ...
  </bean>
-->
```



### 2.3. Bizonyos URL minták tiltása

Azon túl, hogy domain-en maradunk, site-on belül is lehetnek olyan részek, amik minket nem érdekelnek, esetleg fájltípusok, vagy akár **crawler csapdák** (pl. egy végtelen calendar, ami ráadásul minden aloldalról elérhető különböző URL-en).

Ezeket **reguláris kifejezések** formájában mondhatjuk meg a Heritrix-nek, hogy kerülje el:

```xml
<bean id="scope" class="org.archive.modules.deciderules.DecideRuleSequence">
  ...
  <property name="rules">
    <list>

      ...

      <bean class="org.archive.modules.deciderules.MatchesListRegexDecideRule">
        <property name="decision" value="REJECT"/>
        <property name="regexList">
          <list>
            <value>regexp1</value>
              ...
            <value>regexpN</value>
          </list>
        </property>
      </bean>
    </list>
  </property>
</bean>
```



### 2.4. Gyorsítás

A Heritrix alapból nagyon komótosan tölt, akár másodperceket is vár URL-enként. A konfigban én 2 helyet találtam, ahol fel lehet turbózni a dolgot:

```xml
<bean id="disposition" class="org.archive.crawler.postprocessor.DispositionProcessor">
  <property name="delayFactor" value="1.0" />
  <property name="minDelayMs" value="100" />
  <property name="respectCrawlDelayUpToSeconds" value="1" />
  <property name="maxDelayMs" value="100" />
</bean>
```

Illetve:

```xml
<bean id='veryPolite' class='org.archive.spring.Sheet'>
  <property name='map'>
    <map>
      <entry key='disposition.delayFactor' value='1'/>
      <entry key='disposition.minDelayMs' value='100'/>
      <entry key='disposition.maxDelayMs' value='1000'/>
      <entry key='disposition.respectCrawlDelayUpToSeconds' value='1'/>
    </map>
  </property>
</bean>
```

Az egyes property-k értékeinek magyarázatához lásd a [doksit][docs].



### 2.5. robots.txt figyelmen kívül hagyása

A [robots.txt][robots-txt]-ben a webszerverek bizonyos robotokat, böngészőket (vagy akár mindenféle programot) tilthatnak el bizonyos mappáktól, illetve crawl delay-t is megszabhatnak. Persze ezek **csak információk, ajánlások a programoknak,** az már egy másik kérdés, hogy be is akarják-e ezt tartani. A Heritrix persze alapvetően illedelmes robot, betartja, amit e szabályzatban megszabnak neki, de szerencsére tartalmaz konfigurálási lehetőséget a `robots.txt` ignorálására.

```xml
<bean id="metadata" class="org.archive.modules.CrawlMetadata" autowire="byName">
  ...
  <property name="robotsPolicyName" value="ignore"/>
  ...
</bean>
```



### 2.6. Saját User-agent megadása

Vannak olyan site-ok, ahol akár `robots.txt` szabályokkal, akár egy szerveroldali szkript segítségével szűrik, hogy milyen böngészővel lehet őket meglátogatni. A [User-agent][user-agent] HTTP paraméter szolgál arra, hogy megnevezze a HTTP kérést küldő programot és annak verzióját, illetve esetleg a platformot, amin fut. Az ilyen szűréseket nagyon egyszerű kikerülni: beállítjuk ennek a paraméternek az értékét mondjuk egy népszerű böngészőére.

Heritrix-ben is beállítható ez természetesen, viszont annyi megkötés van, hogy **a Heritrix verziószámának és az operátor URL-nek (lásd 1.2) szerepelnie kell benne.** A konfigfájlban egy template string-et kell megadni, amiben szerepel egyrészt a `@VERSION@`, másrészt a `+@OPERATOR_CONTACT_URL@` karakterlánc. Felhívom a figyelmet, hogy a `+` jel is kell, különben hibát jelez a Heritrix a job build-elésekor.

```xml
<bean id="metadata" class="org.archive.modules.CrawlMetadata" autowire="byName">
  ...
  <property name="userAgentTemplate" value="Mozilla/5.0 (compatible; heritrix/@VERSION@ +@OPERATOR_CONTACT_URL@)"/>
  ...
</bean>
```



### 2.7. Auto pause kikapcsolása

A Heritrix-nek van egy olyan érdekessége, hogy alapértelmezésben ha egy job-ot elindítasz, rögtön lepauzálja. Külön rá kell menned az unpause gombra, hogy ténylegesen meginduljon a letöltés. (Érdekes dolog, én még nem jöttem rá mire jó ez... ha elindítok egy job-ot, akkor azért indítom el, hogy töltsön, nem? 😃) De ezt is ki lehet kapcsolni, itt:

```xml
<bean id="crawlController" class="org.archive.crawler.framework.CrawlController">
  <property name="pauseAtStart" value="false" />
</bean>
```



## 3. Megfigyelések

### 3.1. Memóriaigény

A doksi azt írja, hogy az alapértelmezett 256MB heap memória több száz oldal letöltéséhez jó. Tapasztalatom szerint 8-10 **párhuzamosan futó job**-tól konkrétan meghal az egész `OutOfMemoryException`-nel, szóval az `Xmx` paramétert érdemes megadni, és **GB-okban kell gondolkodni.** Én speciel 3GB-ot adok neki, ez elég arra, hogy 10 job fusson párhuzamosan.

```xml
export HERITRIX_HOME=/path/to/heritrix-3.1.1
export JAVA_HOME=/path/to/jre
export JAVA_OPTS=-Xmx3G
$HERITRIX_HOME/bin/heritrix -a admin:admin
```

Amit még érdemes megtenni: az épp nem futó **job-okat teardown-olni**, ha sok van.



### 3.2. URL problémák

A `MirrorWriter`-rel az a tapasztalat, hogy érdekes dolgokat produkál. **Bizonyos URL-ekből én azt látom, hogy nem képes (valid) fájlnevet generálni,** tehát az a letöltött bájthalmaz elveszik az éterben. Konkrétan én ezt `/?a=b/c` alakú relatív linkeknél tapasztaltam.

Ami nagy probléma, hogy a parszere elég érdekes felfogás mentén lett implementálva. A Heritrix **mindenhonnan ki akar parszolni URL-t,** onnan is, ahol nincs. Kutat a CSS-ekben, JS-ben, és gazdagon kapok olyan fájlokat, amelyek neve egy stíluslapon használt szelektor, vagy egy szkriptben használt feltétel egyik fele. 😃

A forráskódban azt láttam, hogy ilyen *"likely-URL"*-eket keres, tehát ami *"olyasmi, mint egy URL"*... Találkoztam olyan mappanévvel is, ami egy komplett `<iframe>` tag volt.

Itt nyilván felmerül az emberben, hogy esetleg nem ez a "smart crawler" a hibás, hanem az adott oldal forráskódja... de egyrészt ezt nem egy oldalnál csinálja, másrészt pedig ezeket az adott oldalakat a [WGET][wget] hibamentesen leszedte.

Azt olvastam, hogy érdemes kikapcsolni a job konfigban az `ExtractorJS` és `ExtractorCSS` modulokat, mert így megszabadulok ezektől a felesleges fájloktól (amelyek egyébként növelik az idő- és tárigényt, valamint redundáns adatot tartalmaznak!) - de még nem próbáltam ki. 🙂

További észrevétel a közelmúltból: Drupal-os oldalt nem tud jól kezelni, kaptam egy ilyen URL-t a crawl log-ban:

```
http://***/calendar/month/2013-06/field/theme/sites/all/modules/ctools/css/sites/all/modules/ctools/css/modules/user/user.css
```

...amiben én egy ciklust vélek felfedezni. Természetesen a letöltött fájl sem egy stíluslap lett, hanem egy HTML, valószínűleg a Drupal rendszer olyan jószívű, hogy 404 hibalap helyett visszadobja a leghosszabb valid prefix-hez tartozó lapot. Bár talán pont azzal jártunk volna jobban, ha hibát ad vissza, mert akkor nem keletkezik redundáns adat... no mindegy. 🙂



[arc]: https://en.wikipedia.org/wiki/ARC_(file_format)
[docs]: https://webarchive.jira.com/wiki/spaces/Heritrix/pages/5407381/Heritrix+3.0+and+3.1+User+Guide
[heritrix]: https://webarchive.jira.com/wiki/spaces/Heritrix/overview
[robots-txt]: https://support.google.com/webmasters/answer/6062608?hl=hu
[user-agent]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
[warc]: https://en.wikipedia.org/wiki/Web_ARChive
[wget]: https://www.gnu.org/software/wget/