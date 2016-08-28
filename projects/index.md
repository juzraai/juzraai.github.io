---
layout:  page
title:   Projects
excerpt: List and short description of my selected projects. Crawlers, utilities and more here! ;)
---

{% for project in site.data.projects %}
**[{{ project.title }}]({{ project.url }})** {{ project.description }}
{% endfor %}
