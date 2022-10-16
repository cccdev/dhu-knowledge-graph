/**
 * @author 陆劲涛
 * @description 知识图谱主页
 */
import { data } from '@/data/graph'
import ReactECharts from 'echarts-for-react'
import { TreeChart, TreeSeriesOption } from 'echarts/charts'
import { TooltipComponent, TooltipComponentOption } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import React from 'react'

echarts.use([TooltipComponent, TreeChart, CanvasRenderer])

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | TreeSeriesOption
>

export class GraphProps {}

const Graph: React.FC = () => {
    const option: EChartsOption = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
        },
        series: [
            {
                type: 'tree',

                data: [data],

                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',

                symbolSize: 7,

                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 9,
                },

                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left',
                    },
                },

                emphasis: {
                    focus: 'descendant',
                },

                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750,
            },
        ],
    }

    return (
        <ReactECharts
            option={option}
            style={{ height: '700px', width: '100%' }}
        />
    )
}

Graph.defaultProps = new GraphProps()
export default Graph
