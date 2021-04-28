#!/usr/bin/env bash

LOC=$(readlink -f "$0")
DIR=$(dirname "$LOC")

echo "$DIR"
mkdir "$DIR/../dist/data"
curl -X GET https://disease.sh/v3/covid-19/all -o "$DIR/../dist/data/all.json"
curl -X GET https://graphics.thomsonreuters.com/data/2020/coronavirus/tracking/global/data.json -o "$DIR/../dist/data/data.json"
curl -X GET https://disease.sh/v3/covid-19/countries -o "$DIR/../dist/data/countries.json"
curl -X GET https://disease.sh/v3/covid-19/vaccine/coverage/countries\?lastdays\=1 -o "$DIR/../dist/data/vaccine.json"
