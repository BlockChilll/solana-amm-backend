import type {FastifyInstance} from 'fastify'
import {SyncEvent} from '../../model/index.js'
import {apiDatabase} from '../database.js'
import {paginationSchema} from '../schemas/pagination.js'
import {
    eventOrder,
    getPagination,
    type PaginationQuery
} from '../utils/pagination.js'

export async function syncRoutes(app: FastifyInstance) {
    app.get<{Querystring: PaginationQuery}>(
        '/events/syncs',
        {schema: {querystring: paginationSchema}},
        async (request) => {
            return apiDatabase.getRepository(SyncEvent).find({
                order: eventOrder,
                ...getPagination(request.query)
            })
        }
    )
}
