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
}

/**
 * 知识节点详情model
 */
export interface PointDetail {
    addressId: string
    pointId: string
    pointName: string
    type: 'jpg' | 'png' | 'gif' | 'jpeg' | 'webp'
    fileName: string
    content: string
    uploader: string
    degree: string
    tag: string
    uploadTime: string
}

export type TreeNode = {
    name: string
    children?: TreeNode[]
    pointId?: string
    value?: string
    point?: GraphPoint
}
