<template>
  <img :alt="c.countryInfo.iso2" :src="c.countryInfo.flag">
  <strong>{{ c.country }}: </strong>
  <p>累计确诊: {{ c.cases }}</p>
  <p>今日确诊: {{ c.todayCases }}</p>
  <p>累计死亡: {{ c.deaths }}</p>
  <p>今日死亡: {{ c.todayDeaths }}</p>
  <p>累计康复: {{ c.recovered }}</p>
  <p>今日康复: {{ c.todayRecovered }}</p>
  <p>现存患者: {{ c.active }}</p>
</template>

<script>
export default {
  name: "CountryPopup",
  props: {
    c: {
      "updated": 1617897397662,
      "country": "Afghanistan",
      "countryInfo": {
        "_id": 4,
        "iso2": "AF",
        "iso3": "AFG",
        "lat": 33,
        "long": 65,
        "flag": "https://disease.sh/assets/img/flags/af.png"
      },
      "cases": 57019,
      "todayCases": 76,
      "deaths": 2521,
      "todayDeaths": 5,
      "recovered": 51956,
      "todayRecovered": 16,
      "active": 2542,
      "critical": 1120,
      "casesPerOneMillion": 1440,
      "deathsPerOneMillion": 64,
      "tests": 364078,
      "testsPerOneMillion": 9195,
      "population": 39595345,
      "continent": "Asia",
      "oneCasePerPeople": 694,
      "oneDeathPerPeople": 15706,
      "oneTestPerPeople": 109,
      "activePerOneMillion": 64.2,
      "recoveredPerOneMillion": 1312.17,
      "criticalPerOneMillion": 28.29
    }

  }
}
</script>

<style scoped>

</style>
