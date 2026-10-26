export interface PaginationQuery {
    limit: number
    offset: number
}

export const eventOrder = {
    slot: 'DESC',
    logIndex: 'DESC',
    id: 'DESC'
} as const

export function getPagination(query: PaginationQuery) {
    return {
        take: query.limit,
        skip: query.offset
    }
}
