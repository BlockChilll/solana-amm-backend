import type {FastifyInstance} from 'fastify'
import {SwapEvent} from '../../model/index.js'
import {apiDatabase} from '../database.js'
import {paginationSchema} from '../schemas/pagination.js'
import {
    eventOrder,
    getPagination,
    type PaginationQuery
} from '../utils/pagination.js'

export async function swapRoutes(app: FastifyInstance) {
    app.get<{Querystring: PaginationQuery}>(
        '/events/swaps',
        {schema: {querystring: paginationSchema}},
        async (request) => {
            return apiDatabase.getRepository(SwapEvent).find({
                order: eventOrder,
                ...getPagination(request.query)
            })
        }
    )
}
