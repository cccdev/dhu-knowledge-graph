/**
 * @author 陆劲涛
 * @description 知识图谱主页
 */
import { kgData } from '@/data/graph'
import { CustomResponse, GraphPoint, TreeNode } from '@/types'
import { point2TreeNode } from '@/utils'
import { request } from '@/utils/request'
import { Button } from 'antd'
import ReactECharts from 'echarts-for-react'
import { TreeChart, TreeSeriesOption } from 'echarts/charts'
import { TooltipComponent, TooltipComponentOption } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import React, { useRef, useState } from 'react'

echarts.use([TooltipComponent, TreeChart, CanvasRenderer])

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | TreeSeriesOption
>

export class GraphProps {}

const Graph: React.FC = () => {
    const [data, setData] = useState<TreeNode>()
    const chartRef = useRef(null)

    const handleClick = () => {
        request<CustomResponse>({
            url: '/home/toHome',
            method: 'get',
        }).then((res) => {
            const treeData = point2TreeNode(res.data as unknown as GraphPoint[])
            setData(treeData)
        })
    }

    const option: EChartsOption = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
        },
        series: [
            {
                type: 'tree',
                data: [kgData],
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
    // useChart(chartRef, option)

    return (
        <>
            <Button onClick={handleClick}>请求</Button>
            <ReactECharts
                option={option}
                // ref={chartRef}
                style={{ height: '700px', width: '100%' }}
            />
        </>
    )
}

Graph.defaultProps = new GraphProps()
export default Graph
