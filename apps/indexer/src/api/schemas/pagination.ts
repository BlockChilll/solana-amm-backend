export const paginationSchema = {
    type: 'object',
    properties: {
        limit: {type: 'integer', minimum: 1, maximum: 100, default: 50},
        offset: {type: 'integer', minimum: 0, default: 0}
    },
    additionalProperties: false
} as const
