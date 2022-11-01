/**
 * @author 陆劲涛
 * @description 知识图谱主页
 */
import { darkModeAtom } from '@/App'
import { GraphPoint, SearchGraphNode } from '@/types'
import {
    point2GraphNode,
} from '@/utils'
import { request } from '@/utils/request'
import { Input, message, Modal } from 'antd'
import ReactECharts, { EChartsInstance } from 'echarts-for-react'
import { GraphChart, GraphSeriesOption } from 'echarts/charts'
import { TooltipComponent, TooltipComponentOption } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import ContextMenu from '../ContextMenu'
import { contextMenuStyleAtom } from '../Graph'
import './index.less'

echarts.use([TooltipComponent, GraphChart, CanvasRenderer])

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | GraphSeriesOption
>

type SearchGraphProps = {
    keyword: string
}
const Graph: React.FC<SearchGraphProps> = (props) => {
    const [data, setData] = useState<SearchGraphNode[]>([])
    const [modalTitle, setModalTitle] = useState('首页')
    const [tempPoint, setTempPoint] = useState({
        pointName: '',
        beforePointId: '0',
    })
    const { keyword } = props
    const [inputValue, setInputValue] = useState('')
    const [dark] = useAtom(darkModeAtom)
    const [contextMenuStyle, setContextMenuStyle] =
        useAtom(contextMenuStyleAtom)

    // 格式化数据，适配echarts
    const initData = () => {
        request<GraphPoint[]>({
            url: '/search/point',
            params: { pointName: keyword },
        }).then((res) => {
            if (res.code === 0) {
                setData(point2GraphNode(res.data))
            } else {
                message.error(res.msg)
            }
        })
    }

    // echarts配置
    const option: EChartsOption = {
        title: {
            text: keyword + ' 的搜索结果',
            subtext: '2022/10',
            left: 'left',
        },
        tooltip: {
            show: true,
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter: '{b}',
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        },
        series: {
            type: 'graph',
            layout: 'force',
            symbolSize: 40,
            animation: true,
            data: data,
            width: '100%',
            height: '100%',
            label: {
                show: true,
                position: 'right',
                formatter: '{b}',
            },
            labelLayout: {
                hideOverlap: true,
            },
            scaleLimit: {
                min: 0.4,
                max: 2,
            },
            roam: true,
            force: {
                repulsion: 100,
                edgeLength: 30,
            },
            edges: [],
        },
        darkMode: dark,
    }
    const handleChartReady = (chart: EChartsInstance) => {
        chart.on('contextmenu', (params: any) => {
            if (params.name === undefined) return
            params.event.event.stopPropagation() // 阻止冒泡
            params.event.event.preventDefault() // 阻止默认右键菜单
            setContextMenuStyle({
                left: params.event.event.clientX + 'px',
                top: params.event.event.clientY + 'px',
                visibility: 'visible',
            })
            setTempPoint({
                pointName: params.data.name,
                beforePointId: params.data.id,
            })
            setModalTitle(params.data.name)
        })
    }

    // 详情页跳转
    const showDetail = () => {
        window.open(
            '/detail?name=' +
            tempPoint.pointName +
            '&id=' +
            tempPoint.beforePointId
        )
    }

    //Api相关
    /**
     * 添加节点
     */
    const addNode = () => {
        const reqs = inputValue
            .split(' ')
            .filter((e) => e !== '')
            .map((e) =>
                request({
                    url: '/home/addPoint',
                    method: 'post',
                    data: {
                        beforePointId: tempPoint.beforePointId,
                        pointName: e,
                    },
                })
            )
        Promise.all(reqs).then((res) => {
            res.forEach((e) => {
                if (e.code === 0) {
                    message.success(e.msg)
                } else {
                    message.error(e.msg)
                }
            })
            setInputValue('')
            initData()
        })
    }
    /**
     * 删除节点
     */
    const deleteNode = () => {
        request({
            url: '/home/deletePoint',
            method: 'post',
            data: {
                pointId: tempPoint.beforePointId,
            },
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
    const handleChange = (e: any) => {
        setInputValue(e.target.value)
    }

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const showDeleteModal = () => {
        setIsDeleteModalOpen(true)
    }
    const handleDeleteOk = () => {
        deleteNode()
        setIsDeleteModalOpen(false)
    }
    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false)
    }

    useEffect(() => {
        initData()
        const handleClick = () => {
            setContextMenuStyle({ ...contextMenuStyle, visibility: 'hidden' })
        }
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    return (
        <>
            <ReactECharts
                option={option}
                style={{ height: '90vh', width: '100%' }}
                onChartReady={handleChartReady}
            />
            <ContextMenu
                showModal={showModal}
                showDeleteModal={showDeleteModal}
                showDetail={showDetail}
            ></ContextMenu>
            <Modal
                title={'添加'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>{'在【' + modalTitle + '】下添加结点'}</p>
                <Input
                    value={inputValue}
                    placeholder="请输入知识点名称（多个结点以空格分开）"
                    onChange={handleChange}
                    onPressEnter={handleOk}
                    allowClear
                />
            </Modal>
            <Modal
                title={'删除'}
                open={isDeleteModalOpen}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
            >
                <p>{'确定删除【' + modalTitle + '】结点？'}</p>
            </Modal>
        </>
    )
}

export default Graph
