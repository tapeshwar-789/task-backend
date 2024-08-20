const express = require('express');
const app = express();
const cors =require('cors')
const port = 3000;
const mongoose = require('mongoose');
const Task = require('./task');

app.use(cors())
app.use(express.json()); 
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


mongoose.connect('mongodb://localhost:27017/taskapp').then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});



// Route to get tasks
app.get('/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  });

  // POST route to add a new task
app.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
  
    try {
      const newTask = new Task({ title, description });
      await newTask.save();
      res.status(201).json(newTask); // Respond with the saved task
    } catch (error) {
      res.status(500).json({ message: 'Error saving task' });
    }
  });

  app.delete('/tasks/:title', async (req, res) => {
    try {
      const taskTitle = req.params.title;
      const task = await Task.findOneAndDelete({ title: taskTitle });
      
      if (task) {
        res.status(200).json({ message: 'Task deleted successfully' });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task' });
    }
  });
  

  app.put('/tasks/:title', async (req,res)=>{
    const Title=req.params.title
    const {title,description}=req.body
    try {
        const task= await Task.findOne({ title:Title})
        console.log(task)
    if(task)
    {
      task.title=title || task.title
      task.description=description || task.description
      const updatedTask= await task.save()
      res.status(200).json({message:"Updated Successfully..."})
    }
    else{
        res.status(400).json({message:"Something went wrong.."})
    }
} catch{
    res.status(500).json({ message: 'Error Updating task' });
    
}

  })



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
