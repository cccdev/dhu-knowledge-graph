import { GraphPoint, TreeNode } from '@/types'
import { TreemapSeriesOption } from 'echarts/charts'

export const point2TreeNode = (
    data: GraphPoint,
    type: string
): TreeNode | undefined => {
    const obj = {} as TreeNode
    if (!data) return
    obj.name = data.point.pointName
    obj.value = data.count
    obj.children = data.children
    obj.point = data.point

    if (obj.children) {
        for (let i = 0; i < obj.children.length; i++) {
            const e = obj.children[i]
            e.point ? (e.point.beforePointId = obj.point?.pointId) : e
            e.path = obj.path + '/' + e.point.pointName
            obj.children[i] = point2TreeNode(e, type)
        }
    }

    return obj
}

export const point2GraphNode = (data) => {
    const res = []
    data.forEach((e) => {
        res.push({ id: e.pointId, name: e.pointName })
    })
    return res
}

export const getTreeSeries = (data: TreeNode[]): TreemapSeriesOption[] => [
    {
        type: 'tree',
        data,
        top: '10%',
        left: '10%',
        bottom: '10%',
        right: '20%',
        symbolSize: 14,
        initialTreeDepth: 2,
        roam: true,
        label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 15,
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
]

export const getTreeMapSeries = (data: TreeNode[]): TreemapSeriesOption[] => [
    {
        name: '',
        type: 'treemap',
        data: data[0]?.children,
        drillDownIcon: '▶',
        leafDepth: 3,
        squareRatio: 1,
        visibleMin: 300,
        label: {
            show: true,
            formatter: '{b}',
        },
        upperLabel: {
            show: true,
            height: 30,
        },
        itemStyle: {
            borderColor: '#444',
            borderWidth: 1,
        },
        levels: [
            {
                itemStyle: {
                    borderColor: '#666',
                    borderWidth: 0,
                    gapWidth: 1,
                },
                upperLabel: {
                    show: false,
                },
            },
            {
                itemStyle: {
                    // borderColor: '#555',
                    borderWidth: 5,
                    gapWidth: 1,
                },
                emphasis: {
                    itemStyle: {
                        // borderColor: '#aaa',
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
        ],
    },
]
