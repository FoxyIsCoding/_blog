#!/bin/bash
rm -rf site
uvx marmite . site
cp -r materialUI/static/. site/
cp -r content/media site/