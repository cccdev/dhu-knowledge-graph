export interface CustomResponse<T = any> {
    code: number
    msg: string
    data: T
}

export interface GraphPoint {
    pointId: string
    pointName: string
}

export type TreeNode = {
    name: string
    children?: TreeNode[]
    pointId?: string
    value?: string
}
