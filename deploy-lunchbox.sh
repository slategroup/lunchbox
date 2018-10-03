#!/usr/bin/env bash

fab render
cd ../
cd lunchbox-gh-pages
git checkout gh-pages
cd ../
cp -r ./lunchbox/www/* lunchbox-gh-pages/
cd lunchbox-gh-pages
git status


