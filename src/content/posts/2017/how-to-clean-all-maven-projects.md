---
alt:
    hu_HU: /blog/2017/hogyan-tisztitsuk-meg-az-osszes-maven-projektet
date: 2017-06-16
description: There are cases when cleaning all Maven projects in a directory is necessary. Here's a Bash one-liner to do it. :)
lang: en_US
tags: automation bash cleanup maven script
title: How to clean all Maven projects
---

My "dev" folder usually contains dozens of current projects and I don't clean them regularly. But when I backup my directory, it's needless to archive the `target` folders because they can be regenerated at any time. So `mvn clean` needs to be called on every project, this is how I automatize it with _Bash_:

```bash
find . -name "target" -type d \
  | sed s/target/pom.xml/ \
  | tee /dev/stderr \
  | xargs -I {} mvn -q clean -f {}
```

-   `find` lists all `target` folders,
-   with `sed` I transform the path to the POM's path,
-   `tee` just prints out the path to inform me about which project is being cleaned,
-   and finally `xargs` passes the path as argument to the Maven command.

Since `find` walks the directory tree recursively, I can call the above script from the root of my "dev" folder or even from the root of my drive, and all of my projects will be cleaned. 😎

(Developing on Windows? [Git for Windows](https://git-for-windows.github.io/) contains a _Bash_ terminal or you can use the [Linux subsystem](https://msdn.microsoft.com/en-us/commandline/wsl/about))
