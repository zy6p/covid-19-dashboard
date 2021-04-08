#!/usr/bin/env bash

curl https://disease.sh/v3/covid-19/countries -O src/static/resource/countries.json
trash-put ./_deploy/*
cp -r ./dist/* ./_deploy
