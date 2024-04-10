<template>
  <div class="search-div">
    <el-form label-width="90px" size="small">
      <el-row>
        <el-col :span="22">
          <el-form-item label="Order date">
            <el-date-picker
              v-model="createTimes"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="fetchData()">
            Search
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div ref="chart" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { GetOrderStatisticsData } from '@/api/orderInfo.js'

const chart = ref()
const searchObj = ref({
  createTimeBegin: '',
  createTimeEnd: '',
})
const createTimes = ref([])

onMounted(async () => {
  fetchData()
})

const fetchData = async () => {
  if (createTimes.value.length == 2) {
    searchObj.value.createTimeBegin = createTimes.value[0]
    searchObj.value.createTimeEnd = createTimes.value[1]
  }
  const { data } = await GetOrderStatisticsData(searchObj.value)
  setChartOption(data.dateList, data.amountList)
}

const setChartOption = (dateList, amountList) => {
  const myChart = echarts.init(chart.value)
  // Specify the configuration options and data for the chart
  const option = {
    title: {
      text: 'Order amount statistics',
    },
    tooltip: {},
    legend: {
      data: ['Total order amount ($)'],
    },
    xAxis: {
      data: dateList,
    },
    yAxis: {},
    series: [
      {
        name: 'Total order amount ($)',
        type: 'bar',
        data: amountList,
      },
    ],
  }
  // Display the chart using the specified configuration options and data
  myChart.setOption(option)
}
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
