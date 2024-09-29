const users = {};

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // HEAD requests don't get a body with their response.
  // Similarly, 204 status codes are "no content" responses
  // so they also do not get a response body.
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

// get user object (200 response)
const getUsers = (request, response) => {
  // json object to send
  const responseJSON = {
    users,
  };

  // return 200 with message
  return respondJSON(request, response, 200, responseJSON);
};

// function to add a user from a POST body
const addUser = (request, response) => {
  // default json message
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // grab name and age out of request.body for convenience
  // If either name or age do not exist in the request,
  // they will be set to undefined
  const { name, age } = request.body;

  // check to make sure we have both fields
  // We might want more validation than just checking if they exist
  // This could easily be abused with invalid types (such as booleans, numbers, etc)
  // If either are missing, send back an error message as a 400 badRequest
  if (!name || !age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  // If the user doesn't exist yet
  if (!users[name]) {
    // Set the status code to 201 (created) and create an empty user
    responseCode = 201;
    users[name] = {
      name,
    };
  }

  // add or update fields for this user name

  users[name].age = age;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // When we send back a 204 status code, it will not send response
  // body. However, if we didn't pass in an object as the 4th param
  // to our respondJSON function it would break. So we send in an
  // empty object, which will stringify to an empty string.
  return respondJSON(request, response, responseCode, {});
};

// function for 404 not found requests with message
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

// set public modules
module.exports = {
  getUsers,
  addUser,
  notFound,
};
