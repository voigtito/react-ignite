import { createServer, Factory, Model } from 'miragejs';
import faker from 'faker';

type User = {
    name: string;
    email: string;
    created_at: string;
}

export function makeServer() {
    const server = createServer({
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
            server.createList('user', 10);
        },

        // Shorthands
        routes() {
            // All routes will needed to be called as /api/_name_
            this.namespace = 'api';
            // Important to test the loadings in the application.
            this.timing = 750;

            this.get('/users');
            this.post('/users');

            // After define the routes it will set to empty because of Nextjs apis.
            this.namespace = '';
            // All routes will pass through here and if it is not from mirage it will go one to another api.
            this.passthrough();
        }
    })

    return server;
}