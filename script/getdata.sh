#!/usr/bin/env bash

wget https://disease.sh/v3/covid-19/historical/all?lastdays=all -O ../src/static/resource/all.json
wget https://graphics.thomsonreuters.com/data/2020/coronavirus/tracking/global/data.json -O ../src/static/resource/data.json
wget https://disease.sh/v3/covid-19/countries -O ../src/static/resource/countries.json
