/**
 * @author 陆劲涛
 * @description 知识图谱主页
 */
import { darkModeAtom, treeTypeAtom, userDataAtom } from '@/App'
import { TreeNode } from '@/types'
import {
    getTreeMapSeries,
    getTreeSeries,
    point2GraphNode,
    point2TreeNode,
} from '@/utils'
import { request } from '@/utils/request'
import { SyncOutlined } from '@ant-design/icons'
import { Button, Input, message, Modal, Tooltip } from 'antd'
import ReactECharts from 'echarts-for-react'
import { GraphChart, GraphSeriesOption } from 'echarts/charts'
import { TooltipComponent, TooltipComponentOption } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { atom, useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ContextMenu from '../ContextMenu'
import { contextMenuStyleAtom } from '../Graph'
import './index.less'

echarts.use([TooltipComponent, GraphChart, CanvasRenderer])

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | GraphSeriesOption
>

export class GraphProps {}
const Graph: React.FC = (props) => {
    const [data, setData] = useState<TreeNode[]>([])
    const navigate = useNavigate()
    const [modalTitle, setModalTitle] = useState('首页')
    const [tempPoint, setTempPoint] = useState({
        pointName: '',
        beforePointId: '0',
    })
    const { keyword } = props
    const [inputValue, setInputValue] = useState('')
    const [treeType, setTreeType] = useAtom(treeTypeAtom)
    const [userData, setUserdata] = useAtom(userDataAtom)
    const [dark] = useAtom(darkModeAtom)
    const logOut = () => {
        setUserdata({
            idLoggedIn: false,
            mobile: '',
        })
        localStorage.setItem(
            'userData',
            JSON.stringify({
                idLoggedIn: false,
                mobile: '',
            })
        )
        navigate('/login')
    }
    // 菜单栏style
    const [contextMenuStyle, setContextMenuStyle] =
        useAtom(contextMenuStyleAtom)

    // 格式化数据，适配echarts
    const initData = () => {
        request<TreeNode>({
            url: '/search/point',
            params: { pointName: keyword },
        }).then((res) => {
            if (res.code === 0) {
                // console.log(res)
                setData(point2GraphNode(res.data))
            } else {
                message.error(res.msg)
                // if (res.code === 500502) {
                //   logOut()
                // }
            }
        })
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
    const handleChartReady = (chart: any) => {
        chart.on('contextmenu', (params: any) => {
            console.log(params)
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

Graph.defaultProps = new GraphProps()
export default Graph