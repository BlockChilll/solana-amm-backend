import Fastify from 'fastify'
import {apiDatabase} from './api/database.js'
import {poolCreatedRoutes} from './api/routes/pool-created.js'
import {swapRoutes} from './api/routes/swaps.js'
import {liquidityRoutes} from './api/routes/liquidity.js'
import {syncRoutes} from './api/routes/syncs.js'

const app = Fastify({logger: true})

app.get('/health', async () => {
    return {status: 'ok'}
})

async function main() {
    try {
        await apiDatabase.initialize()

        await app.register(poolCreatedRoutes)
        await app.register(swapRoutes)
        await app.register(liquidityRoutes)
        await app.register(syncRoutes)

        await app.listen({port: 3000, host: '127.0.0.1'})
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

void main()
