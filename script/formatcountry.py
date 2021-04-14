# !/usr/bin/env python
# -*- coding: utf-8 -*-

import geopandas as gpd
import json
import copy

cInfoFile = open("../src/static/resource/countries.json", 'r')
cInfo = json.load(cInfoFile)
cInfoFile.close()
cInfoIso2List = [i['countryInfo']['iso2'] for i in cInfo]
# cInfoIso2List.sort()

cShp = gpd.read_file("../src/static/resource/World_Countries__Generalized_.json")
outCShp = copy.deepcopy(cShp)

outCShp['id'] = outCShp['ISO']
# outCShp.set_index(['id'])
outCShp = outCShp.drop(columns=['ISO', 'SHAPE_Leng', 'SHAPE_Area'], axis=1)
outCShp['population'] = outCShp['FID']
outCShp['lat'] = outCShp['FID']
outCShp['lng'] = outCShp['FID']

for i in cInfo:
    outCShp.loc[outCShp['id'] == i['countryInfo']['iso2'], ['population']] = i['population']
    outCShp.loc[outCShp['id'] == i['countryInfo']['iso2'], ['lat']] = i['countryInfo']['lat']
    outCShp.loc[outCShp['id'] == i['countryInfo']['iso2'], ['lng']] = i['countryInfo']['long']
    # oMask = outCShp[outCShp['id'] == i['countryInfo']['iso2']]
    # oMask['population'] = i['population']
    # oMask['lat'] = i['countryInfo']['lat']
    # oMask['lng'] = i['countryInfo']['long']

outCShp = outCShp[outCShp['population'] > 250]
outCShp.to_file("../src/static/resource/World_Countries.json", driver="GeoJSON")
outCShp.to_file("../src/static/resource/World_Countries.shp")
