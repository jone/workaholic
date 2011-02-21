# Workaholic

*Work in progress*

Workaholic is an experiment for learning how to build iPhone web apps
based on [sencha touch](http://www.sencha.com/products/touch/).

**What it does:**

* Track your work time
* Track the tasks you're working

**Features:**

* Based on [sencha touch](http://www.sencha.com/products/touch/)
* Completly offline capable
* Stores data in local storage

**Demo:**

* [workaholic.jone.ch](http://workaholic.jone.ch/)

**Dependencies:**

* [sencha touch](http://www.sencha.com/products/touch/)
* [compass](http://compass-style.org/) / [sass](http://sass-lang.com/)

**Install:**

* checkout somewhere in a running apache htdocs
* run `rake install` for automatically downloading and installing sencha touch library
* run `rake build` for building CSS
* add `AddType text/cache-manifest .manifest` to your *httpd.conf*
* run `rake cacheon` for enabling caching (creates a .htaccess, mention
[AllowOverride](http://httpd.apache.org/docs/2.0/mod/core.html#allowoverride))
