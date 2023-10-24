---
date: 2020-07-19
description: Interaktív megyetérképet érdemes lehet Leaflet-tel készíteni, ehhez viszont kellenek a megyék GeoJSON adatai, összefűzve. Ezt a feladatot automatizáltam egy Node.js szkripttel.
lang: hu
tags: automation choropleth geojson leaflet map nodejs script
title: GeoJSON összeállítása megyetérképhez
---

Adott a feladat, hogy egy weboldalon megjelenítsük **kis hazánk megyetérképét, valamilyen érték szerinti színezéssel.** Hogyan fogjunk neki?

Pár éve - jobb ötlet hiányában - én erre mindig rávágtam, hogy a Wikipédián fent van [Magyarország megyetérképe SVG-ben](https://hu.wikipedia.org/wiki/F%C3%A1jl:HU_counties_colored.svg), ahol az egyes megyéknek van `id` attribútuma. Utóbbi alapján egyszerű őket CSS és JS segítségével formázni és interaktívvá tenni (pl. hover, click). Persze ezzel az SVG-s megoldással macerás megoldani a zoom-ot, a dragging-et, illetve ha később kitaláljuk, hogy városokat is rá kéne dobálni, valószínűleg meg vagyunk lőve.

Itt jön képbe a [Leaflet.js](https://leafletjs.com/) library, amivel piszok egyszerűen lehet **interaktív térképeket kreálni webes környezetben.** SVG-t épít ő is, de a fenti funkciókat és még csillió más dolgot megvalósít nekünk. A drag mellett többféle zoom lehetőséget és könnyen hozzáadható vezérlőket, tooltip-eket, popup-okat biztosít, illetve több réteget tud kezelni egymásra pakolva.

Interaktív megyetérképhez van egy remek [útmutatójuk](https://leafletjs.com/examples/choropleth/) is, jelen posztommal ezt egészíteném ki. 🙂

Ez a Choropleth tutorial USA adatok bemutatásáról szól, az államokat **GeoJSON formában adagolja be a Leaflet-nek.** A GeoJSON földrajzi adatokat ír le, de kiegészíthető egyéb adatokkal is, melyeket a térkép testreszabásakor felhasználhatunk. A cikkben nem írják le, hogy az amerikai államokat tartalmazó GeoJSON-t hogyan állították össze, így kicsit kutatnom kellett, hogyan tehetem meg ugyanezt Magyarország megyéivel.

Rákerestem **Magyarország megyéire** OpenStreetMap viszonylatban, és ezt a [Boundaries](https://wiki.openstreetmap.org/wiki/Hungary/Boundaries#Megy.C3.A9k) oldalt találtam, ahol mind fel vannak sorolva egy-egy **OSM relation ID kíséretében.** Ezeket a relation-öket meg lehet tekinteni a térképen, amely mutatja a megye határvonalát.

Már csak az kell, hogy ezt a határvonalat megkapjuk GeoJSON formátumban. Felütöttem a guglit erre a kérdésre is, és [erre a cikkre](https://peteris.rocks/blog/openstreetmap-administrative-boundaries-in-geojson/) akadtam rá, mely megmondja az egyszerű megoldást. Az alábbi URL-ről **letölthető az X azonosítójú relation GeoJSON fájlja:**

> http://polygons.openstreetmap.fr/get_geojson.py?id=<span style="color:red">X</span>&params=0

Az ID-k és a hozzájuk tartozó GeoJSON-ök legyűjtése után persze utóbbiakat **össze kell fűzni egy darab GeoJSON-be** úgy, hogy a megyékhez kapott adatot becsomagoljuk `Feature` objektumokba, majd az összeset egy `FeatureCollection`-be.

Érdekesség, hogy a letöltött GeoJSON-ok nem teljesen validak, ugyanis `GeometryCollection`-t írnak le, de csak egyetlen elemmel, amire a [validátor](https://geojsonlint.com/) visszapofázik. A megoldás az, hogy ki kell bújtani azt az egyetlen elemet a collection-ből.

A fentieket természetesen nem bonyolult automatizálni. Íme egy Node.js szkript, ami legyűjti Magyarország megyéit és egyetlen GeoJSON-ba fűzi őket:

```js
// npm i cheerio got

const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');

async function getCountyOsmIds() {
	const res = await got('https://wiki.openstreetmap.org/wiki/Hungary/Boundaries');
	const $ = cheerio.load(res.body);
	return $('h2:contains("Megyék") + table tr')
		.toArray()
		.map((tr) => {
			return $('td a', tr)
				.toArray()
				.map((a) => $(a).text())[2];
		})
		.filter((id) => id);
}

async function downloadGeoJson(osmId) {
	const geoJsonUrlTemplate = 'http://polygons.openstreetmap.fr/get_geojson.py?id=X&params=0';
	const res = await got(geoJsonUrlTemplate.replace('X', osmId));
	return res.body;
}

async function getGeoJson(id) {
	const file = `${id}.json`;
	if (fs.existsSync(file)) return fs.readFileSync(file);
	const json = await downloadGeoJson(id);
	fs.writeFileSync(file, json);
	return json;
}

function fixGeometryCollection(geometry) {
	if (geometry.type === 'GeometryCollection' && geometry.geometries.length === 1) {
		return geometry.geometries[0];
	}
	return geometry;
}

function feature(geometry, id) {
	return {
		type: 'Feature',
		properties: { id }, // will be useful :)
		geometry: fixGeometryCollection(geometry),
	};
}

async function getFeature(id) {
	const geometryJson = await getGeoJson(id);
	const geometry = JSON.parse(geometryJson);
	return feature(geometry, id);
}

function featureCollection(features) {
	return { type: 'FeatureCollection', features };
}

async function generateFeatureCollection(ids, file) {
	const features = await Promise.all(ids.map(getFeature));
	fs.writeFileSync(file, JSON.stringify(featureCollection(features)));
}

(async () => {
	const ids = await getCountyOsmIds();
	await generateFeatureCollection(ids, 'counties.json');
})();
```

A fenti szkripttel kapott GeoJSON egy-az-egyben hozzáadható a Leaflet térképhez, ahogy a fentebb linkelt Choropleth tutorial-ban le van írva. Ott a megyei adatokat is beleapplikálták a GeoJSON fájlba, én inkább csak a megyéhez tartozó OSM relation ID-t tettem bele, így bármilyen projekthez jó lesz az összeállított `FeatureCollection`. Kliensoldalon nem lesz kunszt összekötni a `feature.properties.id`-t az épp aktuális adatokkal és a megyék nevével.

Hasonló módszerrel rá tudjuk dobni a térképünkre Budapest kerületeit, vagy akár a szomszédos országokat is.
