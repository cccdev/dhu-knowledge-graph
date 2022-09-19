/**
 * @author 陆劲涛
 * @description 知识图谱主页
 */
import { webkitDep } from '@/data/webkit-dep'
import ReactECharts from 'echarts-for-react'
import React from 'react'

export class KnowledgeGraphProps {}

type NodeType = {
    name: string
    value: number
    category: number
    id?: number
}

const KnowledgeGraph: React.FC = () => {
    const option = {
        legend: {
            data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other'],
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                animation: false,
                label: {
                    normal: {
                        position: 'right',
                        formatter: '{b}',
                    },
                },
                draggable: true,
                data: webkitDep.nodes.map((node: NodeType, idx) => {
                    node.id = idx
                    return node
                }),
                categories: webkitDep.categories,
                force: {
                    // initLayout: 'circular'
                    // repulsion: 20,
                    edgeLength: 5,
                    repulsion: 20,
                    gravity: 0.2,
                },
                edges: webkitDep.links,
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

KnowledgeGraph.defaultProps = new KnowledgeGraphProps()
export default KnowledgeGraph
