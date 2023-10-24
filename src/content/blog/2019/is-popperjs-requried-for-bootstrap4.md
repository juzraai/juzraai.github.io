---
alt:
    hu: /blog/2019/tenyleg-kell-popperjs-bootstrap4-hez/
date: 2019-05-12
description: Several months ago I answered a topic on StackOverflow to find out which parts of Bootstrap 4 requires Popper.js and whether importing Popper.js is necessary.
lang: en
tags: bootstrap optimization popperjs stackoverflow
title: Is Popper.js required for Bootstrap 4?
---

Several months ago I saw this [question on StackOverflow][q]:

> I wanted to ask if Popper.js is absolutely necessary or not if I don't use dropdown menus. Are there any other parts of Bootstrap 4 driven by Popper.js that would not work without the library?

I made a little research and posted [my answer][a]. I'm revisiting this now because from time to time I get upvotes and currently this is my highest voted answer. (I know, 15 upvotes is ridiculous if we compare it to posts of [Stack Overflow ninjas][n], but I'm happy with it now. 🤓) This blog post is here to spread the knowledge by mirroring my answer, and also to add some minor thoughts to it.

## Which parts of Bootstrap 4 uses Popper.js?

To answer this part of the original question, the easiest we can do is to open the documentation and use its search box.

If we search for `popper` in [Bootstrap 4's documentation][d], the following results will come up:

> Tooltips rely on the 3rd party library **Popper.js** for positioning.
>
> Popovers rely on the 3rd party library **Popper.js** for positioning.
>
> Dropdowns are built on a third party library, **Popper.js**, which provides dynamic positioning and viewport detection.

(These quotes are from the Beta documentation. Currently the phrasing is different but the results are the same.)

**So these are the Bootstrap 4 components that need Popper.js:**

-   dropdowns
-   popovers
-   tooltips

(According to my answer on StackOverflow, Bootstrap 4 Beta needed Popper.js for modals as well, which is not true for the current 4.3.1 version.)

## Do I need Popper.js if I don't use these components?

Popper.js is stated as required in the documentation:

> Many of our components require the use of JavaScript to function. Specifically, they require jQuery, Popper.js, and our own JavaScript plugins. Place the following scripts near the end of your pages, right before the closing `</body>` tag, to enable them. jQuery must come first, then Popper.js, and then our JavaScript plugins.

And Bootstrap 4 JS (Beta version at least) logs an error if it can't find Popper.js:

```
Uncaught Error: Bootstrap dropdown require Popper.js (https://popper.js.org)
    at bootstrap.min.js:6
    at bootstrap.min.js:6
    at bootstrap.min.js:6
```

However, **Bootstrap 4 can be used without Popper.js, if we don't use tooltips, popovers nor dropdowns.** For example, navbar's JS functionality (mobile menu on the right) [works well without Popper.js][a].

## ...but there's a bundle!

More answers on the same topic mention that there's a bundle version of Bootstrap 4 JS, which **includes Popper.js,** therefore there's no need to bother including Popper.js by hand.

In my opinion, or at least for me, the whole point of not importing Popper.js is to reduce loading time of a webpage by **importing only what is required.** In this case, the bundle doesn't help.

[a]: https://stackoverflow.com/a/46155285/2418224
[d]: https://getbootstrap.com/docs/4.3/getting-started/introduction/
[n]: https://stackoverflow.com/users?tab=Reputation&filter=all
[q]: https://stackoverflow.com/questions/46155017/bootstrap-4-beta-is-popper-js-required/46155285
