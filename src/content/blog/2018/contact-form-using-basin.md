---
alt:
    hu: /blog/2018/kontakt-form-basin-nel
date: 2018-06-03
description: My previous post was about free contact form solutions that can be inserted into static sites and can send email. I tried out Basin which won my gold prize before based on its website only. Here are my experiences.
lang: en
lightbox: true
tags: basin captcha email form serverless
title: Free contact form using Basin
---

[prev]: {{ 'blog/2018/contact-form-for-free' | relative_url }}

My [previous post][prev] was about free contact form solutions that can send email. I tried out [Basin][basin] which was before my gold medal winner based on its website only. Here are my experiences. 🙂

## First steps

The sign up page is minimal, it only asks for my email address and my new password. Of course, email address needs to be confirmed before I can login.

After logging in, the dashboard is displayed. Before I created my form, I checked what's inside _Account settings_. Besides the email address and password change, there's only a button for complete removal.

At form creation, it asks 2 things: the name of the form (displayed on the dashboard), and the **redirect URL** where visitors will be sent after filling out the form. If we leave it blank, Basin will show its own page as a default.

After I created my form, it was opened in the interface with an empty _Submissions_ panel. There I already saw that incoming submissions can be **filtered, deleted and marked as spam.**

_Setup_ tabs **shows HTML code snippets** which helps to implement the form on a website just by copy-pasting. There are snippets for both the clickable and the invisible Google captcha.

_Edit_ tab provides additional settings of the form:

-   **multiple whitelisted domains** can be specified, from where form submissions are allowed
-   required captcha can be turned on
-   and also there's an opportunity to send GDPR compliant **data receipt to the sender**

On the _Email_ tab, the target email address can be modified, where form data should be sent. It's the registered email address by default. Also, there are options to specify **CC and custom sender name** (instead of _"Basin"_), and **subject is editable too.** Subject is the form's name + _"You've received a submission"_ by default.

## Testing

I turned on captcha and receipt sending and implemented the form with the invisible captcha. It's super cool that I can **test it from localhost.** I submitted the form and it correctly redirected to my URL. The email arrived a few seconds later to my address. The email is formatted nicely and contains every important detail:

[![Basin submission email]({{ '/assets/basin/basin-submission-email.png' | relative_url }})]({{ '/assets/basin/basin-submission-email.png' | relative_url }})

Reply-to is working properly too, I can answer to the email address typed in the form with a single click.

An email arrived also to the address I typed in the form. It **tells what data I sent to where,** and it provides a button where a data removal request can be filed:

[![Basin receipt email]({{ '/assets/basin/basin-receipt-email.png' | relative_url }})]({{ '/assets/basin/basin-receipt-email.png' | relative_url }})

Submitted information appeared also on the _Submissions_ tab as expected. Looking further, there's the _Export_ tab where I can **download form submissions in CSV or JSON** using an API key. Finally, [Zapier][zapier] connection can be set up on the _Integrations_ tab, but I didn't do this, I reached my goal.

**[Basin][basin] deserves my gold prize. It's a professional, easy-to-use, user friendly, GDPR-ready, free service.** 🏆

This is what I was looking for.

## Addition

A little addition is needed for [Google reCAPTCHA][recaptcha] to work properly. Code snippet provided by [Basin][basin] works in a way that submit button's click event is handled by reCAPTCHA and it **submits the form immediately.** This is a problem when you need **form validation**, either natively or via a JS library. I found a [solution here][so-recaptcha]:

```html
<form
	id="invisible-recaptcha-form"
	accept-charset="UTF-8"
	action="https://usebasin.com/f/..."
	method="POST"
>
	<!-- input fields -->

	<div
		class="g-recaptcha"
		data-sitekey="..."
		data-callback="onSubmit"
		data-badge="inline"
		data-size="invisible"
	></div>
	<button class="btn btn-primary">Submit</button>
</form>
<script
	src="https://www.google.com/recaptcha/api.js"
	async
	defer
></script>
<script>
	document.getElementById('invisible-recaptcha-form').addEventListener(
		'submit',
		function () {
			event.preventDefault();
			grecaptcha.reset();
			grecaptcha.execute();
		},
		false,
	);
	function onSubmit(token) {
		document.getElementById('invisible-recaptcha-form').submit();
	}
</script>
```

What did I do to [Basin][basin]'s snippet:

-   Removed `g-recaptcha` class from submit button, and placed it on a new `<div>` element.
-   Moved `data-*` attributes too from the button to the new element, and added a new one: `data-size="invisible"`.
-   I added an event handler to the script, which is triggered on form submit and calls the captcha.

When the user hits the submit button:

-   The browser's native validation will run first.
-   Then the event handler initializes the captcha.
-   Captcha inserts response in the form, and calls the callback, which submits the form.

[basin]: https://usebasin.com/
[recaptcha]: https://developers.google.com/recaptcha/
[so-recaptcha]: https://stackoverflow.com/a/41694352/2418224
[zapier]: https://zapier.com/
