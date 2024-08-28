import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(html()) 
    .use(swagger())
    .get('/', () => (
        <html lang="en">
            <head>
                <title>Hello World</title>
            </head>
            <body>
                <h1>Hello World</h1>
            </body>
        </html>
    ))
    .listen(3000)