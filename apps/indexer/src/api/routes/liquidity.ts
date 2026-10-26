import type {FastifyInstance} from 'fastify'
import {LiquidityEvent} from '../../model/index.js'
import {apiDatabase} from '../database.js'
import {paginationSchema} from '../schemas/pagination.js'
import {
    eventOrder,
    getPagination,
    type PaginationQuery
} from '../utils/pagination.js'

export async function liquidityRoutes(app: FastifyInstance) {
    app.get<{Querystring: PaginationQuery}>(
        '/events/liquidity',
        {schema: {querystring: paginationSchema}},
        async (request) => {
            return apiDatabase.getRepository(LiquidityEvent).find({
                order: eventOrder,
                ...getPagination(request.query)
            })
        }
    )
}
