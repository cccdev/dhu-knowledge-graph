/**
 * @author 陆劲涛
 * @description 知识图谱主页
 */
import { TreeNode } from '@/types'
import { request } from '@/utils/request'
import { Input, message, Modal } from 'antd'
import ReactECharts from 'echarts-for-react'
import { TreemapChart, TreemapSeriesOption } from 'echarts/charts'
import { TooltipComponent, TooltipComponentOption } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { atom, useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ContextMenu from '../ContextMenu'
import './index.less'

echarts.use([TooltipComponent, TreemapChart, CanvasRenderer])

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | TreemapSeriesOption
>

export class GraphProps { }
export const contextMenuStyleAtom = atom({
    top: '',
    left: '',
    visibility: 'hidden',
})

const Graph: React.FC = () => {
    const [data, setData] = useState<TreeNode[]>()
    const navigate = useNavigate()
    const [modalTitle, setModalTitle] = useState('首页')
    const [tempPoint] = useState({
        pointName: '',
        beforePointId: '0',
    })

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
        request<TreeNode>({
            url: '/home/getAllChildren',
            params: { pointId: 0 },
        }).then((res) => {
            res.data.path = ''
            formatData(res.data)
            setData(res.data.children)
        })
    }

    //Api相关
    /**
     * 添加节点
     */
    const addNode = () => {
        request({
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
        tempPoint.pointName = e.target.value
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
                        borderColor: '#aaa',
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
        // toolbox: {
        //     show: true
        // },
        visibleMin: 300,
        title: {
            text: 'DHU-专业实习',
            subtext: '2022/10',
            left: 'center',
        },
        tooltip: {
            show: true,
            trigger: 'item',
            triggerOn: 'mousemove',
            // formatter: (params, ticket, callback) => params.data.path,
            formatter: '{b}',
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        },
        series: [
            {
                name: '',
                type: 'treemap',
                drillDownIcon: '▶',
                leafDepth: 3,
                squareRatio: 1,
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
                data,
            },
        ],
    }
    const handleChartReady = (chart: any) => {
        chart.on('contextmenu', (params: any) => {
            if (params.name === undefined) return;
            params.event.event.stopPropagation() // 阻止冒泡
            params.event.event.preventDefault() // 阻止默认右键菜单
            setContextMenuStyle({
                left: params.event.event.clientX + 'px',
                top: params.event.event.clientY + 'px',
                visibility: 'visible',
            })
            tempPoint.pointName = params.data.point.pointName
            tempPoint.beforePointId = params.data.point.pointId
            setModalTitle(params.data.point.pointName)
        })
    }

    // 菜单栏style
    const [contextMenuStyle, setContextMenuStyle] =
        useAtom(contextMenuStyleAtom)

    useEffect(() => {
        initData()
        document.addEventListener('click', (e) => {
            setContextMenuStyle({ ...contextMenuStyle, visibility: 'hidden' })
        })
        // document.addEventListener('scroll', (e) => {
        //     setContextMenuStyle({ ...contextMenuStyle, visibility: 'hidden' })
        // })
    }, [])

    const showDetail = () => {
        navigate(
            '/detail?name=' +
            tempPoint.pointName +
            '&id=' +
            tempPoint.beforePointId
        )
        // window.open('/detail?name=' + tempPoint.pointName + '&id=' + tempPoint.beforePointId)
    }
    return (
        <>
            <ReactECharts
                option={option}
                style={{ height: '80vh', width: '100%' }}
                onChartReady={handleChartReady}
            />
            <Modal
                title={'添加'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>{'在【' + modalTitle + '】下添加结点'}</p>
                <Input placeholder="请输入知识点名称" onChange={handleChange} />
            </Modal>
            <Modal
                title={'删除'}
                open={isDeleteModalOpen}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
            >
                <p>{'确定删除【' + modalTitle + '】结点？'}</p>
            </Modal>
            <ContextMenu
                showModal={showModal}
                showDeleteModal={showDeleteModal}
                showDetail={showDetail}
            ></ContextMenu>
        </>
    )
}

Graph.defaultProps = new GraphProps()
export default Graph
