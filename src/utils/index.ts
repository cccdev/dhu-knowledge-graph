import { GraphPoint, TreeNode, SearchGraphNode, myTreeSeriesOption } from '@/types'
import { TreeSeriesOption } from 'echarts'
import { TreemapSeriesOption } from 'echarts/charts'

export const point2TreeNode = (
    data: GraphPoint,
    type: string
): TreeNode => {
    const obj = {} as TreeNode
    obj.name = data.point.pointName
    obj.value = data.count
    obj.children = [];
    obj.point = data.point

    for (let i = 0; i < data.children.length; i++) {
        const e = data.children[i];
        e.path = obj.path + '/' + e.point.pointName
        obj.children.push(point2TreeNode(e, type));
    }

    return obj
}

export const point2GraphNode = (data: GraphPoint[]) => {
    const res: SearchGraphNode[] = [];
    data.forEach((e) => {
        res.push({ id: e.pointId, name: e.pointName })
    })
    return res
}

export const getTreeSeries = (data: TreeNode[], { fold, layout, edgeShape }: myTreeSeriesOption): TreeSeriesOption[] => [
    {
        type: 'tree',
        data,
        top: '0',
        left: '10%',
        bottom: '0',
        right: '20%',
        zoom: 1,
        center: layout === 'radial' ? ['0', '0'] : ['35%', '50%'],
        symbolSize: 10,
        edgeShape,
        layout,
        symbol: 'emptyCircle',
        initialTreeDepth: fold ? 2 : 100,
        roam: true,
        label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 13,
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
