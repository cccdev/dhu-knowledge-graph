/**
 * @author 陆劲涛
 * @description 知识图谱主页
 */
import { kgData } from '@/data/graph'
import useChart from '@/hooks/useChart'
import { CustomResponse, GraphPoint, TreeNode } from '@/types'
import { point2TreeNode } from '@/utils'
import { request } from '@/utils/request'
import { Button, Input, message, Modal } from 'antd'
import ReactECharts from 'echarts-for-react'
import { TreemapChart, TreemapSeriesOption } from 'echarts/charts'
import { TooltipComponent, TooltipComponentOption } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import React, { useEffect, useRef, useState } from 'react'

echarts.use([TooltipComponent, TreemapChart, CanvasRenderer])

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | TreemapSeriesOption
>

export class GraphProps {}

const Graph: React.FC = () => {
    const [data, setData] = useState<Array<TreeNode>>()
    const chartRef = useRef(null)
    const [modalTitle, setModalTitle] = useState('首页')
    // 格式化数据，适配echarts
    const formatData = (data: TreeNode) => {
        if (!data) return
        data.name = data.point.pointName
        data.value = data.count
        data.children.forEach((e) => {
            e.point.beforePointId = data.point?.pointId
            e.path = data.path + '/' + e.point.pointName
            formatData(e)
        })
    }
    const initData = () => {
        request({
            url: '/home/getAllChildren',
            params: { pointId: 0 },
        }).then((res) => {
            res.data.path = 'home'
            formatData(res.data, '')
            setData(res.data.children)
        })
    }
    const [tempPoint] = useState({
        pointName: '',
        beforePointId: '0',
    })
    // 添加结点
    const addNode = () => {
        request<CustomResponse>({
            url: '/home/addPoint',
            method: 'post',
            data: tempPoint,
        }).then((res) => {
            if (res.code === 0) {
                message.success(res.msg)
                tempPoint.pointName = ''
                initData()
            } else {
                message.error(res.msg)
            }
        })
    }
    useEffect(() => {
        initData()
    }, [])

    // modal相关
    const [isModalOpen, setIsModalOpen] = useState(false)
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleOk = () => {
        addNode()
        setIsModalOpen(false)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }
    const handleChange = (e) => {
        tempPoint.pointName = e.target.value
    }

    // echarts配置
    function getLevelOption() {
        return [
            {
                itemStyle: {
                    borderColor: '#777',
                    borderWidth: 0,
                    gapWidth: 1,
                },
                upperLabel: {
                    show: false,
                },
            },
            {
                itemStyle: {
                    borderColor: '#555',
                    borderWidth: 5,
                    gapWidth: 1,
                },
                emphasis: {
                    itemStyle: {
                        borderColor: '#ddd',
                    },
                },
            },
            {
                colorSaturation: [0.35, 0.5],
                itemStyle: {
                    borderWidth: 5,
                    gapWidth: 1,
                    borderColorSaturation: 0.6,
                },
            },
        ]
    }
    const option: EChartsOption = {
        title: {
            text: 'DHU-专业实习',
            subtext: '2022/10',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
        },
        series: [
            {
                name: '',
                type: 'treemap',
                visibleMin: 300,
                drillDownIcon: '▶',
                label: {
                    show: true,
                    formatter: '{b}',
                },
                upperLabel: {
                    show: true,
                    height: 30,
                },
                itemStyle: {
                    borderColor: '#fff',
                },
                levels: getLevelOption(),
                data: data,
            },
        ],
    }
    function convert(source, target, basePath) {
        for (const key in source) {
            const path = basePath ? basePath + '.' + key : key
            if (!key.match(/^\$/)) {
                target.children = target.children || []
                const child = {
                    name: path,
                }
                target.children.push(child)
                convert(source[key], child, path)
            }
        }
        if (!target.children) {
            target.value = source.$count || 1
        } else {
            target.children.push({
                name: basePath,
                value: source.$count,
            })
        }
    }
    // 处理echart元素的点击事件
    const handleEvents = {
        contextmenu: (params) => {
            params.event.event.preventDefault() // 阻止默认右键菜单
            tempPoint.beforePointId = params.data.point.pointId
            setModalTitle(params.data.point.pointName)
            showModal()
        },
    }

    return (
        <>
            {/* <Button onClick={handleClick}>请求</Button> */}
            <ReactECharts
                onEvents={handleEvents}
                option={option}
                ref={chartRef}
                style={{ height: '75vh', width: '100%' }}
            />
            <Modal
                title={'在【' + modalTitle + '】下添加结点'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>知识点名称</p>
                <Input placeholder="请输入知识点名称" onChange={handleChange} />
            </Modal>
        </>
    )
}

Graph.defaultProps = new GraphProps()
export default Graph
