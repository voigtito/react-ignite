import { createServer, Model } from 'miragejs';

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