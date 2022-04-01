const express = require('express');
const app = express();
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const data = require('./fakeData.json');

app.use(express.json());
app.use(cors());

// refresh server
app.get('/', async (req, res) => {
  data.posts.pop();
  fs.writeFile('fakeData.json', JSON.stringify(data), 'utf-8', function(err) {
    if(err) throw err;
    console.log('File updated...');
  })
  res.send(data.posts);
});

// Get todos
app.get('/api/posts', (req, res) => {
  if(data.posts.length === 0) {
    return res.status(200).json({
      success: true,
      msg: 'posts empty'
    });
  }
  res.status(200).json({
    success: true,
    data: data.posts,
  });
});

// Get a todo
app.get('/api/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = data.posts.find(post => post.id == id);
  if(typeof post == 'undefined') {
    return res.status(404).json({
      success: false,
      msg: 'Post Not found',
    })
  }
  res.status(200).json({
    success: true,
    data: post,
  });
})

// Create a todo
app.post('/api/posts', async (req, res) => {
  const { title, body } = req.body;
  const errors = [];
  console.log('req.body: ', req.body);

  if(!title) {
    errors.push({ msg: "Please insert post title"})
  }
  if(!body) {
    errors.push({ msg: "Please insert post body"})
  }

  if(errors.length > 0) {
    return res.status(400).json({
      success: false,
      data: errors,
    });
  }

  data.posts.push({
    id: data.posts[data.posts.length - 1].id + 1,
    title,
    body,
  });

  fs.writeFile('fakeData.json', JSON.stringify(data), 'utf-8', function(err) {
    if(err) throw err;
    console.log('File updated...');
  })

  return res.status(201).json({
    success: true,
    msg: "Post created successfully..."
  });
})

app.put('/api/posts/:id', async (req, res) => {
  const { title, body } = req.body;
  const id = req.params.id;

  data.posts.map((post, index) => {
    if(post.id == id) {
      data.posts[index] = {
        ...data.posts[index],
        title: title ? title: data.posts[index].title,
        body: body ? body: data.posts[index].body
      };
    }
  });

  fs.writeFile('fakeData.json', JSON.stringify(data), 'utf-8', function(err) {
    if(err) throw err;
    console.log('File updated...');
  })

  return res.status(201).json({
    success: true,
    msg: "Post Updated successfully..."
  });
});

// Delete a todo
app.delete('/api/posts/:id', async (req, res) => {
  const id = req.params.id;
  if(!id) {
    return res.status(404).json({
      success: false,
      msg: "Unable to delete this post"
    })
  }
  const post = data.posts.find(post => post.id == id);
  if(typeof post == 'undefined') {
    return res.status(404).json({
      success: false,
      msg: 'Post Not found',
    })
  };
  data.posts.splice(id - 1, 1);

  fs.writeFile('fakeData.json', JSON.stringify(data), 'utf-8', function(err) {
    if(err) throw err;
    console.log('File updated...');
  });

  return res.status(200).json({
    success: true,
    msg: "Post deleted successfully..."
  });
});


app.listen(process.env.PORT || 5000, () => console.log('Server Running...5000'));