import { GraphPoint, TreeNode } from '@/types'

export const point2TreeNode = (pointData: GraphPoint[]): TreeNode => {
    const obj = {};
    if (!data) return
    obj.name = data.point.pointName
    obj.value = data.count
    obj.children = data.children
    obj.children.forEach((e) => {
        e.point.beforePointId = obj.point?.pointId
        e.path = obj.path + '/' + e.point.pointName
        point2TreeNode(e)
    })
    return obj;
}
