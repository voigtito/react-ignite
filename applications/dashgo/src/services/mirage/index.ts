import { createServer, Factory, Model, Response, ActiveModelSerializer } from 'miragejs';
import faker from 'faker';

type User = {
    name: string;
    email: string;
    created_at: string;
}

export function makeServer() {
    const server = createServer({

        serializers: {
            application: ActiveModelSerializer
        },

        models: {
            // Partial is to make to fields from User optional
            user: Model.extend<Partial<User>>({})
        },

        factories: {
            user: Factory.extend({
                name(i: number){
                    return `User ${i + 1}`
                },
                email(){
                    return faker.internet.email().toLowerCase();
                },
                createdAt(){
                    return faker.date.recent(10);
                }
            })
        },

        seeds(server) {
            server.createList('user', 200);
        },

        // Shorthands
        routes() {
            // All routes will needed to be called as /api/_name_
            this.namespace = 'api';
            // Important to test the loadings in the application.
            this.timing = 750;

            this.get('/users', function (schema, request) {

                const { page = 1, per_page = 10 } = request.queryParams;
                const total = schema.all('user').length;
                // offset
                const pageStart = (Number(page) - 1) * Number(per_page);
                // limit
                const pageEnd = pageStart + Number(per_page);

                const users = this.serialize(schema.all('user')).users.slice(pageStart, pageEnd);

                return new Response(
                    200, 
                    {'x-total-count': String(total)}, 
                    {users}
                )
            });
            this.post('/users');
            this.post('/users/:id');

            // After define the routes it will set to empty because of Nextjs apis.
            this.namespace = '';
            // All routes will pass through here and if it is not from mirage it will go one to another api.
            this.passthrough();
        }
    })

    return server;
}