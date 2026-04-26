#!/bin/bash
rm -rf _blog
uvx marmite . site
cp -r materialUI/static/. site/
cp -r content/media site/
mv site _blog