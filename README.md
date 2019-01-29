* [What is this?](#what-is-this)
* [Assumptions?](#assumptions)
* [What's in here?](#what-is-in-here)
* [Quick start](#quick-start)
* [Configuration](#configuration)
* [Deploy the desktop app](#deploy-the-desktop-app)
* [About](#about)

What is this?
-------------

**Lunchbox** is a suite of tools from [NPR](https://github.com/nprapps/lunchbox) to create images intended for social media sharing. The original Lunchbox includes Quotable, Factlist and Waterbug. This is Slate's version which only includes Quotable. 

Find the live version of Slate Quotable here: https://slategroup.github.io/lunchbox/. 

Assumptions
-------------

**Lunchbox** is a customizable toolset deployable as a web app. The following instructions are meant for developers setting up and customizing the app for their organization. For end-users of the tools, see [usage guidelines](http://blog.apps.npr.org/lunchbox).

The following things are assumed to be true in this documentation.

* You are running OSX.
* You are using Python 2.7. (Probably the version that came OSX.)
* You have [virtualenv](https://pypi.python.org/pypi/virtualenv) and [virtualenvwrapper](https://pypi.python.org/pypi/virtualenvwrapper) installed and working.

What's in here?
-------------

* ``fabfile`` -- [Fabric](http://docs.fabfile.org/en/latest/) commands for automating setup and deployment.
* ``less`` -- Application styles and [Bootstrap](http://getbootstrap.com/css/) less files.
* ``templates`` -- HTML ([Jinja2](http://jinja.pocoo.org/docs/)) templates, to be compiled locally.
* ``www`` -- App assets and rendered files.
* ``Lunchbox Setup.exe`` -- Lunchbox Demo installer for Windows.
* ``Lunchbox.dmg`` -- Lunchbox Demo installer for OSX.
* ``app.py`` -- A [Flask](http://flask.pocoo.org/) app for rendering the project locally.
* ``app_config.py`` -- Configuration variables for the Flask app.
* ``package.json`` -- Node dependencies and scripts for building [Electron](https://github.com/atom/electron) app.
* ``packager-config.json`` -- Configuration for create installers with [Electron](https://github.com/atom/electron).
* ``render_utils.py`` -- Helper functions for baking out Flask app.
* ``requirements.txt`` -- Python requirements.
* ``static.py`` -- Routes for static files in Flask app.


Quick Start
-------------

Bootstrap the project by forking this repo and installing the following:

```
mkvirtualenv lunchbox
cd lunchbox
pip install -r requirements.txt
npm install
```

Then run the app:

```
fab app
```
Visit [localhost:8000](http://127.0.0.1:8000/) in your browser to see the app.

Because this site is currently hosted w/ [Github Pages](https://pages.github.com/), you'll need to compile the files to the `/docs` folder before merging. Run this command to do so: 

```
fab gh_pages
```

Known Issues
-------------

- There is no CSS or JS minimization in this repo due to a compiling bug. 
- There are some issues w/ the image size on retina vs. non-retina screens. 

