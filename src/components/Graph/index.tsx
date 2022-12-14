/**
 * @author 陆劲涛
 * @description 知识图谱主页
 */
import { darkModeAtom, treeTypeAtom, userDataAtom } from '@/App'
import { GraphPoint, myTreeSeriesOption, TreeNode } from '@/types'
import { getTreeMapSeries, getTreeSeries, point2TreeNode } from '@/utils'
import { request } from '@/utils/request'
import { SettingOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, Menu, message, Modal, Tooltip } from 'antd'
import { TreeSeriesOption } from 'echarts'
import ReactECharts, { EChartsInstance } from 'echarts-for-react'
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
    TooltipComponentOption | TreemapSeriesOption | TreeSeriesOption
>

export class GraphProps { }
export const contextMenuStyleAtom = atom({
    top: '',
    left: '',
    visibility: 'hidden',
} as any)
const Graph: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<TreeNode[]>([])
    const navigate = useNavigate()
    const [modalTitle, setModalTitle] = useState('首页')
    const [tempPoint, setTempPoint] = useState({
        pointName: '',
        beforePointId: '0',
    })
    const [inputValue, setInputValue] = useState('')
    const [chartInstance, setChartInstance] = useState<EChartsInstance>(null);
    const [treeType, setTreeType] = useAtom(treeTypeAtom)
    const [userData, setUserdata] = useAtom(userDataAtom)
    const [treeOption, setTreeOption] = useState<myTreeSeriesOption>({
        fold: true,
        layout: 'orthogonal', // radial
        edgeShape: 'curve', // polyline
    })
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
    // 格式化数据，适配echarts
    const initData = () => {
        request<GraphPoint>({
            url: '/home/getAllChildren',
            params: { pointId: 0 },
        }).then((res) => {
            if (res.code === 0) {
                if (res.data.point) {
                    res.data.point.pointName = '知识图谱'
                }
                setData([point2TreeNode(res.data, treeType)])
            } else {
                message.error(res.msg)
                if (res.code === 500502) {
                    logOut()
                }
            }
        }).catch(() => {
            message.warn('请稍等，系统更新维护中...')
        }).finally(() => {
            setLoading(false);
        })
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
            if (res.every(e => e.code === 0)) {
                message.success('添加成功')
            } else {
                message.error('添加失败')
            }
            setInputValue('')
            setLoading(true)
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
                setLoading(true)
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
        visibleMin: 300,
        title: {
            text: 'DHU-专业实习',
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
        series:
            treeType === 'tree' ? getTreeSeries(data, treeOption) : getTreeMapSeries(data),
        darkMode: dark,
    }
    const handleChartReady = (chart: any) => {
        setChartInstance(chart);
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
                pointName: params.data.point.pointName,
                beforePointId: params.data.point.pointId,
            })
            setModalTitle(params.data.point.pointName)
        })
    }

    // 菜单栏style
    const [contextMenuStyle, setContextMenuStyle] =
        useAtom(contextMenuStyleAtom)

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

    // 改变树的形态
    const transformTree = () => {
        const type = treeType === 'tree' ? 'treemap' : 'tree'
        localStorage.setItem('treeType', type)
        setTreeType(type)
    }
    // 到详情页
    const showDetail = () => {
        // navigate(
        //     '/detail?name=' +
        //     tempPoint.pointName +
        //     '&id=' +
        //     tempPoint.beforePointId
        // )
        window.open(
            '/detail?name=' +
            tempPoint.pointName +
            '&id=' +
            tempPoint.beforePointId
        )
    }

    // 设置
    const menu = (
        <Menu
            items={[
                {
                    key: '展开',
                    label: (
                        <a onClick={() => {
                            chartInstance.clear();
                            setTreeOption({ ...treeOption, fold: !treeOption.fold })
                        }}
                        >
                            {treeOption.fold ? '展开' : '折叠'}
                        </a>
                    ),
                },
                {
                    key: '环形',
                    label: (
                        <a onClick={() => {
                            if (treeOption.edgeShape === 'polyline' && treeOption.layout === 'orthogonal') {
                                message.warn('放射状只能使用曲线')
                                return;
                            }
                            chartInstance.clear();
                            setTreeOption({
                                ...treeOption,
                                layout: treeOption.layout === 'orthogonal' ? 'radial' : 'orthogonal'
                            })
                        }}>
                            {treeOption.layout === 'orthogonal' ? '放射' : '正交'}
                        </a>
                    ),
                },
                {
                    key: '正交',
                    label: (
                        <a onClick={() => {
                            if (treeOption.edgeShape === 'curve' && treeOption.layout === 'radial') {
                                message.warn('放射状只能使用曲线')
                                return;
                            }
                            chartInstance.clear();
                            setTreeOption({
                                ...treeOption,
                                edgeShape: treeOption.edgeShape === 'polyline' ? 'curve' : 'polyline'
                            })
                        }}>
                            {treeOption.edgeShape === 'curve' ? '直线' : '曲线'}
                        </a>
                    ),
                }
            ]}
        />
    )
    return (
        <>
            <div id="charts">
                <ReactECharts
                    notMerge={true}
                    showLoading={loading}
                    option={option}
                    style={{ height: (treeOption.fold || treeType === 'treemap' || treeOption.layout === 'radial') ? '90vh' : '3000px', width: '100%' }}
                    onChartReady={handleChartReady}
                />
            </div>
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
            <ContextMenu
                showModal={showModal}
                showDeleteModal={showDeleteModal}
                showDetail={showDetail}
            ></ContextMenu>
            <Tooltip title="切换形态" className="transformBtn">
                <Button
                    onClick={transformTree}
                    shape="circle"
                    size="large"
                    icon={<SyncOutlined />}
                />
            </Tooltip>
            {treeType === 'tree' && <Dropdown overlay={menu} placement="top">
                <Button
                    className="settingsBtn"
                    shape="circle"
                    size="large"
                    icon={<SettingOutlined />}
                />
            </Dropdown>}


        </>
    )
}

Graph.defaultProps = new GraphProps()
export default Graph
