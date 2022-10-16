export interface CustomResponse<T = any> {
    code: number
    msg: string
    data: T
}
