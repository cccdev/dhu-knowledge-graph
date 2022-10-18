export interface CustomResponse<T = any> {
    code: number
    msg: string
    data: T
}
/**
 * 后端传来的知识结点model
 */
export interface GraphPoint {
    pointId: string
    pointName: string
    count: number
}

export type TreeNode = {
    name: string
    children?: TreeNode[]
    pointId?: string
    value?: string
    point?: GraphPoint
}
