---
alt:
    hu: /blog/2018/kontakt-form-ingyen
date: 2018-06-02
description: '[Updated in 2020] I searched for free solutions to process the contact form on my static website. In this post, I compare the services I found.'
lang: en
tags: comparison email form serverless
title: Contact form for free - looking around
---

[next]: /blog/2018/contact-form-using-basin

I updated data included in the post below in July, 2020.

## Problem

My blog and developer portfolio is a **static website**, which I host on [GitHub][gh-pages]. As contact information, I link my Facebook and LinkedIn profiles, but I don't want to publish my email address, because **I don't need spam.** Instead I'd place there a **contact form** which would help those who arrive at my website to reach me without logging in or navigating anywhere else.

Because of the site is static, processing of the form and sending data to my email address has to be done **without server-side script.** So I have to find a **third-party service** for this task. And since I've been saving money, I'd like to **keep the costs of this at zero too.**

## Possible solutions

I spent a day to search for potential solutions. I looked for services which can process a **custom HTML form** and can send me an email with the form data. I list them alphabetized.

Note: below when I write _AJAX_, it means a function which provides an endpoint that can be called via AJAX and responds with a text message, unlike the usual form sending methods that return with a page or a redirect.

[99inbound][99inbound] has a **100 email/month** limit, provides **spam filter, and Slack integration.** As a bonus it can build you HTML forms too if you need it. Their privacy policy looks fresh and GDPR-ready.

[Basin][basin] gives **100 email/month**, and it has a lot of features: **spam filter, redirect, file upload, AJAX, export, analytics, and Zapier integration** to some popular apps (e.g. Slack, Trello, Asana, Google Sheets). [Zapier][zapier] is also free if you use only 2-step (trigger+action) workflows. Basin looks professional and prepared, their GDPR notice is clear. They got positive reviews on [ProductHunt][ph-basin], and their developers are actively responding there too.

[elFormo][elFormo] gives **1500 emails/month, honeypot and redirect,** though they flash their logo to the users. Form data is stored and can be **exported.** Their website has style and is appealing, but it's hard to find a review and their last tweet is from 2015.

[enformed.io][enformed.io] gives **100 emails/month, custom subject, CC, BCC, honeypot, redirect, AJAX.** But they don't have any privacy policy and their sign up form is actually dead.

[formspree.io][formspree.io] looks familiar to me, I saw some website templates that recommended this service for the contact form. It gives **50 emails/month, custom subject, CC, redirect, captcha** and **Zapier integration.** It's been developed a lot in the past years, it has a nice documentation.

A [Google Form][g-forms] can also be used as a contact form backend. I found different limits for this, but most of them says **50-100 emails/day**. Form data is also inserted into a **spreadsheet** so there's no problem if email sending fails due to the limits.

This spreadsheet + email sending mechanism can also be achieved via a [Google Apps Script][g-script]. The quota is **100 emails/day** and it can be used via **AJAX** too. The script can be surely extended with honeypot and captcha.

[mailthis.to][mailthis.to] pricing is based on the usage. Initially you get **1000 emails for free**, then you can pay a few dollars for additional 1000 emails. They provide **custom subject, honeypot, redirect, file upload, AJAX and captcha.** They [seem to be nice](https://medium.com/@jamesfuthey/running-a-free-email-api-for-2-years-a39188e19985) for me, but they also lack the privacy policy.

[Pageclip][pageclip] gives **1000 submissions/month, custom subject, AJAX and data export** in JSON. They have both client and server-side JavaScript library. They highlight Slack integration on their front page, but the documentation doesn't mention it. They have a detailed privacy policy.

[SimpleForm][simpleform]'s site is very minimal. Does not mention limits, but it says it has **file upload** and **API** for downloading submission data. Though version number starts with 2018, copyright says 2012 and their blog is updated in 2014.

[Un-Static][unstatic] (formerly: BriskForms) has a **25 email/form/month** limit, but it provides **redirect, spam filter** and **captcha**.

Let's see them in a nice table:

| Service                      | Limit      | Spam     | Redirect | Stores? | Extra                              |
| ---------------------------- | ---------- | -------- | -------- | ------- | ---------------------------------- |
| [99inbound][99inbound]       | 100/month  | filter   | ?        | -       | Slack                              |
| [Basin][basin]               | 100/month  | filter   | yes      | yes     | file, captcha, Zapier              |
| [elFormo][elFormo]           | 1500/month | honeypot | yes      | yes     | -                                  |
| [enformed.io][enformed.io]   | 100/month  | honeypot | yes      | -       | subject, CC, BCC, AJAX             |
| [formspree.io][formspree.io] | 50/month   | honeypot | yes      | yes     | subject, CC, AJAX, captcha, Zapier |
| [G. Apps Script][g-script]   | 100/day    | -        | -        | yes     | subject, AJAX, ...                 |
| [G. Forms][g-forms]          | ~ 50/day   | -        | -        | yes     | -                                  |
| [mailthis.to][mailthis.to]   | 1000       | honeypot | yes      | -       | subject, file, AJAX, captcha       |
| [Pageclip][pageclip]         | 1000/month | -        | -        | yes     | subject, AJAX, API                 |
| [SimpleForm][simpleform]     | -          | -        | -        | yes     | file                               |
| [Un-Static][unstatic]        | 25/month   | filter   | yes      | -       | captcha                            |

## Summary

I narrow down the above list in the following way:

-   The 2 approach using Google services seems a bit hacky and not elegant, especially if we look at the other competitors.
-   [formspree.io][formspree.io]... couldn't hide my email address, at the time of writing this post, now it can.
-   [enformed.io][enformed.io] has more than one issue.
-   [mailthis.to][mailthis.to] seems nice, but the one-time 1000 email limit is worse than the rest where at least the quota is renewed every month.
-   [SimpleForm][simpleform] is not so informative and it seems to be old.
-   [elFormo][elFormo] seems nice too, but there are better choices in the list.
-   [Pageclip][pageclip] is the only one left which doesn't provide spam filter.
-   🥉 [Un-Static][unstatic] stops at the 3rd place, because... it replaces BriskForms which was the 3rd at the time of writing this post.
-   🥈 [99inbound][99inbound] gets the silver, because
-   🥇 [Basin][basin] seems more professional and flexible. (+ At the time of writing this post, it provided unlimited submissions in the free plan.)

I found out all of the above **without trying out** the services. In my [next post][next] I share my experiences with [Basin][basin] which seems to deserve my gold medal. 🤓

[99inbound]: https://www.99inbound.com/
[basin]: https://usebasin.com/
[elFormo]: https://www.elformo.com/
[enformed.io]: http://www.enformed.io/
[formspree.io]: https://formspree.io/
[g-forms]: https://github.com/toperkin/staticFormEmails
[g-script]: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server
[gh-pages]: https://pages.github.com/
[mailthis.to]: https://mailthis.to/
[pageclip]: https://pageclip.co/
[ph-basin]: https://www.producthunt.com/posts/basin
[simpleform]: https://getsimpleform.com/
[unstatic]: https://un-static.com/
[zapier]: https://zapier.com/
