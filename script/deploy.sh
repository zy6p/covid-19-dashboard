#!/usr/bin/env bash

curl https://disease.sh/v3/covid-19/countries -O src/static/resource/countries.json
npm run build
trash-put ./_deploy/*
cp -r ./dist/* ./_deploy
cp -r ./src/static/resource ./_deploy/data
