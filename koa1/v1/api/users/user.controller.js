'use strict';

const { Readable } = require('stream');
const generateId = require('../../utils/generateId.util');
const users = require('../../db/users.json');
const db = {users};
const fs = require('fs');


exports.getAll = async ctx => {  
  const phone = encodeURIComponent(ctx.query.masking).replace('%20', '+')
  ctx.status = 200;
  
  const clone = JSON.parse(JSON.stringify(db));
  if(phone)
  {
    /* const dbStream = new Readable({ objectMode: true });
    dbStream.on('error', ctx.onerror);
    dbStream.read() */
    ctx.body = clone.users.filter((item) => {
      if(item.phone == phone)
      {
        let cc = item.phone.substring(0,2);
        let masked = item.phone.substring(cc.length+2, item.phone.length-3).replace(new RegExp("[0-9]", "g"), "*");
        let nums = item.phone.substring(masked.length+3, item.phone.length)
        item.phone = cc+masked+nums;
        return true;
      }  
    })
  }
  else
    ctx.body = db.users;
};


exports.getOne = ctx => {
  const { userId } = ctx.params;
  const user = db.users.find(user => user.id === userId);
  ctx.assert(user, 404, "The requested user doesn't exist");
  ctx.status = 200;
  ctx.body = user;
};


exports.createOne = async ctx => {
  const { name } = ctx.request.body;
  ctx.assert(name, 400, 'The user info is malformed!');
  const id = generateId();
  const newUser = {
    id,
    name,
    timestamp: Date.now(),
  };
  db.users.push(newUser);
  const createdUser = db.users.find(user => user.id === id);
  ctx.status = 201;
  ctx.body = createdUser;
};
