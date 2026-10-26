import type {FastifyInstance} from 'fastify'
import {PoolCreatedEvent} from '../../model/index.js'
import {apiDatabase} from '../database.js'
import {paginationSchema} from '../schemas/pagination.js'
import {
    eventOrder,
    getPagination,
    type PaginationQuery
} from '../utils/pagination.js'

export async function poolCreatedRoutes(app: FastifyInstance) {
    app.get<{Querystring: PaginationQuery}>(
        '/events/pool-created',
        {schema: {querystring: paginationSchema}},
        async (request) => {
            return apiDatabase.getRepository(PoolCreatedEvent).find({
                order: eventOrder,
                ...getPagination(request.query)
            })
        }
    )
}
