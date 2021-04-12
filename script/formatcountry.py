#!/usr/bin/env python
# -*- coding: utf-8 -*-

import geopandas as gpd
import json
import copy

cInfoFile = open("src/static/resource/countries.json", 'r')
cInfo = json.load(cInfoFile)
cInfoFile.close()
print(cInfo)

cShp = gpd.read_file("src/static/resource/World_Countries__Generalized_.json")
outCShp = copy.deepcopy(cShp)

outCShp['id'] = outCShp['ISO']
outCShp.drop('ISO', axis=1)
outCShp.drop('SHAPE_Leng', axis=1)
outCShp.drop('SHAPE_Area', axis=1)

for i in outCShp:
    if 1 == 1:
        print(1)
