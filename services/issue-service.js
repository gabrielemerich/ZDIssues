function createIssue(issue){
  return client.request({
    url: `${config.baseURL}issues`, 
    type: 'POST', 
    httpCompleteResponse: true, 
    headers: config.headers,
    data: issue
});
}