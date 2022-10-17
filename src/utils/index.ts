import { GraphPoint, TreeNode } from '@/types'

export const point2TreeNode = (pointData: GraphPoint[]): TreeNode => {
    const children = pointData.map((item) => {
        return {
            name: item.pointName,
            pointId: item.pointId,
        }
    })
    return {
        name: '根',
        children: children,
    }
}
