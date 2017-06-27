var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;//use native mongoose promises

//connect to the database
//mongoose.connect('mongodb://test:test@ds147069.mlab.com:47069/project');
mongoose.connect('s-bng-opseng-01.juniper.net:27017/manideep', function(err,db){
if(err)
  throw err;
else {
  console.log("SUCCESS");
}
});
//create a schema - blue print
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);

//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'tiffin box'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){
  app.get('/todo', function(req, res){
    //get data from mongo db and pass it to the view
    Todo.find({}, function(err, data){
      if(err) throw err;
      res.render('todo', {todos: data});
    });
  });

  app.post('/todo', urlencodedParser, function(req, res){
    //get data from the view and add it to the db
    var newTodo = Todo(req.body).save(function(err, data){
      if(err) throw err;
      res.json(data);
    });

  });

  app.delete('/todo/:item', function(req, res){
    // delte the requested item from db
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
      if(err) throw err;
      res.json(data);
    });

  });

};
