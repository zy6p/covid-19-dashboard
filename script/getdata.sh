#!/usr/bin/env bash

curl -X GET https://disease.sh/v3/covid-19/all -o ../src/static/resource/all.json
curl -X GET https://graphics.thomsonreuters.com/data/2020/coronavirus/tracking/global/data.json -o ../src/static/resource/data.json
curl -X GET https://disease.sh/v3/covid-19/countries -o ../src/static/resource/countries.json
curl -X GET https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1 -o ../src/static/resource/vaccine.json
