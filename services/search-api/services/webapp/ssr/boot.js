/**
 * This server setup uses hooks:
 * https://marcopeg.com/hooks/
 *
 * It's going to be a breeze to develop interconnected features!
 * Forget about messy code and huge routing folders, learn how
 * to think in features and organize your codebase around your real
 * business requirements instead ;-)
 */
import { registerAction, SETTINGS, FINISH } from '@forrestjs/hooks'
import { createHookApp, logBoot } from '@forrestjs/hooks'


/**
 * polyfill "fetch" in NodeJS
 * this is used by your client app to make requests while rendering on the server
 * */
require('es6-promise').polyfill()
require('isomorphic-fetch')


/**
 * App's Configuration
 * -------------------
 *
 * Most of the available services and features have default values that suit
 * the general needs (at least for me) and you may just like things the way they are.
 *
 * Anyway, this is the hook where you should grab any environment defined setting
 * and import into your application's context.
 *
 * Take a look at the `.env` file where I wrote some basic configuration that
 * many modules are able to read, and feel free to extend the `settings` object
 * with custom informations.
 *
 * Any new hook that you may need to register will receive those settings.
 */
registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ setConfig, getEnv }) => {
        // setConfig('expressSSR', {
        //     // multilanguage cache policy
        //     shouldCache: (req) => (req.query.locale === undefined),
        //     getCacheKey: (req) => ({ value: [ req.url, req.locale.language, req.locale.region ] }),
        // })

        // setConfig('hash.rounds', getEnv('HASH_ROUNDS'))

        setConfig('elasticsearch', {
            clusters: ['wilder'],
            'wilder': {
                nodes: getEnv('ELASTICSEARCH_WILDER_NODES'),
                indexes: getEnv('ELASTICSEARCH_WILDER_INDEXES'),
            },
        })

        setConfig('postgres.connections', [{
            connectionName: 'searchapi',
            host: getEnv('PG_HOST'),
            port: getEnv('PG_PORT'),
            database: getEnv('PG_DATABASE'),
            username: getEnv('PG_USERNAME'),
            password: getEnv('PG_PASSWORD'),
            maxAttempts: Number(getEnv('PG_MAX_CONN_ATTEMPTS', 25)),
            attemptDelay: Number(getEnv('PG_CONN_ATTEMPTS_DELAY', 5000)),
            models: [],
        }])

        setConfig('postgresPubSub', [{
            host: getEnv('PG_HOST'),
            port: getEnv('PG_PORT'),
            database: getEnv('PG_DATABASE'),
            username: getEnv('PG_USERNAME'),
            password: getEnv('PG_PASSWORD'),
        }])

        setConfig('jwt', {
            secret: getEnv('JWT_SECRET'),
            duration: getEnv('JWT_DURATION'),
        })

    },
})


/**
 * Log hooks' boot tree in development
 * take a look at your console to visualize how each hook connects
 * with the rest of the application.
 */
process.env.NODE_ENV === 'development' && registerAction({
    hook: FINISH,
    name: '♦ boot',
    handler: () => logBoot(),
})


/**
 * App's Capabilities
 * ------------------
 *
 * Here is where you define all that your app can do:
 *
 * SERVICES are very generic and **business unaware** modules. They offer
 * capabilities that you generally need across very different applications,
 * like an Express app or a GraphQL endpoint.
 *
 * FEATURES are **business aware** modules that make sense only for this specific
 * application. Usually you write your data store models, routes or GraphQL
 * queries in a feature implementing one or more hooks.
 */
export default createHookApp({
    services: [
        require('@forrestjs/service-env'),
        require('@forrestjs/service-logger'),
        require('@forrestjs/service-express'),
        require('@forrestjs/service-express-cookies'),
        require('@forrestjs/service-express-graphql'),
        require('@forrestjs/service-express-graphql-test'),
        // require('@forrestjs/service-hash'),
        require('@forrestjs/service-jwt'),
        require('@forrestjs/service-postgres'),
        require('@forrestjs/service-postgres-pubsub'),
        require('./services/service-express-session'),
        require('./services/service-express-device'),
        require('./services/service-elasticsearch'),
        // require('@forrestjs/service-express-ssr'),
        // require('@forrestjs/feature-locale'),
    ],
    features: [
        // require('./features/pages'),
        require('./features/feature-pg-auth'),
        require('./features/feature-pg-session'),
        require('./features/feature-pg-session-info'),
        require('./features/feature-pg-settings'),
        require('./features/feature-pg-memcached'),
    ],
})
