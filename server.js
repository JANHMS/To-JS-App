let express = require("express")
let mongodb = require('mongodb')

let app = express()
let db

app.use(express.static('public'))

let connectString='mongodb+srv://Schultz:ZXCVBnm@cluster0-nvma5.mongodb.net/ToDoApp?retryWrites=true&w=majority'
mongodb.connect(connectString,{useNewUrlParser: true},function(err, client){
  db = client.db()
  app.listen(3002)
})
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', function (req,res){
  db.collection('items').find().toArray(function(err, items){
    res.send(`<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple To-Do App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
    <div class="container">
      <h1 class="display-4 text-center py-1">Jans: Not-To-Do-App</h1>

      <div class="jumbotron p-3 shadow-sm">
        <form id="create-form" action='/create-item' method='POST'>
          <div class="d-flex align-items-center">
            <input id="create-field" name='item' autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
            <button class="btn btn-primary">Add New Item</button>
          </div>
        </form>
      </div>

      <ul id="Item-list class="list-group pb-5">
       ${items.map(function(item){
         return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
           <span class="item-text">${item.text}</span>
           <div>
             <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
             <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
           </div>
         </li>`
       }).join('')}

      </ul>

    </div>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src='/browser.js'></script>
  </body>
  </html>`)
  })
})

app.post('/create-item', function(req,res){
  db.collection('items').insertOne({text: req.body.item}, function(){
    res.redirect('/')
  })
})

app.post('/update-item', function(req, res){
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: req.body.text}}, function() {
    res.send("Sucsess")
  })
})
app.post('/delete-item', function(req,res){
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function(){
    res.send("Sucsess")
  })
})
