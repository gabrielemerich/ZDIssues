var client = ZAFClient.init();

const config = {
  baseURL: 'https://api.github.com/repos/gabrielemerich/WebSiteSC/',
  headers: {'Authorization': 'token 78c6ed35b87d9426b01bf6feb815b612f886ae7a'}
};

const instance = axios.create({
  baseURL: 'https://emerichhelp.zendesk.com/api/v2/',
 
  headers: {'Authorization': 'Basic Z2FicmllbC1jb21wcmFzQGxpdmUuY29tOmdnMTIzMzIx'}
});

function optionsRequest(typeRequest,url, data = null){
    return {
      url: `${config.baseURL}${url}`, 
      type: typeRequest, 
      httpCompleteResponse: true, 
      headers: config.headers,
      data: data && JSON.stringify(data),
      contentType: 'application/json'
  };
}

new Vue({
  el: '#app',
  data: {
    isLoading: false,
    isUpdate: false,
    message: 'Hello Vue.js!',
    created_at: '10/11/2020',
    updated_at: '13/11/2020',
    issue: {}
  },
  created: function () {
   
   // this.issueAlreadyExists();
  
  },
  methods: {
    issueAlreadyExists: async function(){
      const ticket = await client.get('ticket');
        if(ticket.ticket.externalId) {
          const exists = await client.request(optionsRequest('GET', `issues/${ticket.ticket.externalId}`))
          if(exists.status === 200){
            this.isUpdate = true;
          }
        }
    },

    saveTicket: async function () {
         this.isLoading = true;
         const ticket = await client.get('ticket');

         this.issue = {
             title: ticket.subject, 
             body: ticket.description
         
           };
           const issueCreated = await client.request(optionsRequest('POST', 'issues', this.issue));
           client.set('ticket.externalId', issueCreated.responseJSON.number)

             const updatedTicket = await  client.request({
                url: 'https://emerichhelp.zendesk.com/api/v2/tickets/1', 
                type: 'PUT', 
                httpCompleteResponse: true,
                data: JSON.stringify({ticket: {external_id: res.responseJSON.number}}),
                headers: {'Authorization': 'Basic Z2FicmllbC1jb21wcmFzQGxpdmUuY29tOmdnMTIzMzIx'},
                contentType: 'application/json'
            })

            if(updatedTicket.status === 200){
              this.isLoading = false;
              this.isUpdate = true;
            }

    }
  }
})



client.on('ticket.save', async (e) => {
  console.log('salvou o ticket', e)
});

client.on('*.changed', function(e) {
  console.log('changed ticket', e)
});

client.on('ticket.updated', function(user) {
  console.log('alterou o ticket', user)
});

client.context().then(async function(context) {
  const ticket = await client.get('ticket');
  
  console.log('context', ticket)
  if(!ticket.ticket.externalId){
 
    const issue = {
      title: ticket.ticket.subject, 
      body: ticket.ticket.description

    };
      const issueCreated = await client.request(optionsRequest('POST', 'issues', issue));
      client.set('ticket.externalId', issueCreated.responseJSON.number)

      await  client.request({
          url: `https://emerichhelp.zendesk.com/api/v2/tickets/${ticket.ticket.id}`, 
          type: 'PUT', 
          httpCompleteResponse: true,
          data: JSON.stringify({ticket: {external_id: issueCreated.responseJSON.number}}),
          headers: {'Authorization': 'Basic Z2FicmllbC1jb21wcmFzQGxpdmUuY29tOmdnMTIzMzIx'},
          contentType: 'application/json'
      })
    }
});

//Carrega o aplicativo f5
client.on('app.registered', function(e) {
 
  })


//Quando o app é exibido na tela
client.on('app.activated', async function appRegistered(e) {
  const ticket = await client.get('ticket');
  console.log('activated', ticket)
});