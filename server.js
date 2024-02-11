const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');
const uuid = require('uuid');

const app = new Koa();

app.use(koaBody({
    urlencoded: true,
    multipart: true,
}));

app.use(cors());

let ticketsAll = [];

let tickets = [];

function generator() {
    const id = Math.round(Math.random()*10000); 
    tickets.forEach((ticket) => {
        if (ticket.id == id) {
            generator();
        };
    });
    return id.toString();
};

app.use(async ctx => {
    const method = ctx.request.query.method;
    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets;
            return;
        case 'createTicket':
            const id = generator();
            const date = new Date().toLocaleString()
            const ticket = {
                id: id,
                name: ctx.request.body.name,
                status: false,
                created: date
            };
            const ticketAll = {
                id: id,
                name: ctx.request.body.name,
                description: ctx.request.body.description,
                status: false,
                created: date
            };
            tickets.push(ticket);
            ticketsAll.push(ticketAll)
            ctx.response.body = 'Ticket created';
            return;
        case 'changeStatusTicket':
            tickets.forEach((ticket) => {
                if (ticket.id == ctx.request.query.id) {
                    if (ticket.status) {ticket.status = false}
                    else {ticket.status = true};
                };
            });
            ticketsAll.forEach((ticket) => {
                if (ticket.id == ctx.request.query.id) {
                    if (ticket.status) {ticket.status = false}
                    else {ticket.status = true};
                };
            });
            ctx.response.body = 'Ticket status changed';
            return;
        case 'deleteTicket':
            tickets = tickets.filter(ticket => ticket.id != ctx.request.query.id);
            ticketsAll = ticketsAll.filter(ticket => ticket.id != ctx.request.query.id);
            ctx.response.body = 'Ticket deleted';
            return;
        case 'ticketById':
            ctx.response.body = ticketsAll.filter(ticket => ticket.id == ctx.request.query.id)[0];
            return;
        case 'changeTicket':
            tickets.forEach((ticket) => {
                if (ticket.id == ctx.request.query.id) {
                    ticket.name = ctx.request.body.name;
                    ticket.description = ctx.request.body.description;
                }
            });
            ticketsAll.forEach((ticket) => {
                if (ticket.id == ctx.request.query.id) {
                    ticket.name = ctx.request.body.name;
                    ticket.description = ctx.request.body.description;
                }
            });
            ctx.response.body = 'Ticket changed';
            return;
        default:
            ctx.response.status = 404;
            return;
    }
});

const server = http.createServer(app.callback());
const port = process.env.PORT || 7070;

server.listen(port, (err) => {
    if (err) {
        console.log(err);
    
        return;
      }
    
      console.log('Server is listening to ' + port);
});

