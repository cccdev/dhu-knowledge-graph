import { EChartsOption } from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { useEffect } from 'react'

function useChart(chartRef: any, options: EChartsOption) {
    let myChart: echarts.ECharts | null = null

    function renderChart() {
        const chart = echarts.getInstanceByDom(chartRef.current)

        if (chart) {
            myChart = chart
        } else {
            myChart = echarts.init(chartRef.current)
        }
        myChart.setOption(options)
    }

    useEffect(() => {
        renderChart()
    }, [options])

    useEffect(() => {
        return () => {
            myChart && myChart.dispose()
        }
    }, [])
    return
}

export default useChart
