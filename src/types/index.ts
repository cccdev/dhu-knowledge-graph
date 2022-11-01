/**
 * 自定义Response泛型
 */
export interface IResponse<T = any> {
    code: number
    msg: string
    data: T
}
/**
 * 知识节点model
 */
export interface GraphPoint {
    pointId: string
    pointName: string
    count: number
    value: number
    point: {
        pointName: string,
        pointId: string
    }
    children: GraphPoint[]
    path?: string
}

/**
 * 知识节点详情model
 */
export interface PointDetail {
    addressId: string
    pointId: string
    pointName: string
    type: 'jpg' | 'png' | 'gif' | 'jpeg' | 'webp' | 'pdf' | 'mp4' | 'wav'
    fileName: string
    content: string
    uploader: string
    degree: string
    tag: string
    uploadTime: string
}

/**
 * ECharts节点
 */
export type TreeNode = {
    name: string
    children: TreeNode[]
    pointId?: string
    value?: number
    point: {
        pointName: string,
        pointId: string
    }
    path?: string
}

/**
 * ECharts搜索节点
 */
export type SearchGraphNode = {
    id: string;
    name: string
}

/**
 * ECharts搜索节点
 */
export type myTreeSeriesOption = {
    fold: boolean,
    layout: 'orthogonal' | 'radial'
    edgeShape: 'polyline' | 'curve'
}

