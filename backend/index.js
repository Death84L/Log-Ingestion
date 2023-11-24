

// index.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"]
    }
  });

app.use(cors());
app.use(bodyParser.json());


const DB_URI = 'mongodb+srv://kausstubhytmed:Kausstubh@cluster0.9kypvvt.mongodb.net/Log-Database?retryWrites=true&w=majority';


mongoose.connect(DB_URI)
.then(() => {
    console.log('Connected to the database');
})
.catch((error) => {
    console.error('Error connecting to the database:', error.message);
});

const logSchema = new mongoose.Schema({
    level: {
        type: String,
        required: true,
        text :true,
    },
    message: {
        type: String,
        required: true,
        text :true,
    },
    resourceId: {
        type: String,
        required: true,
        text :true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    traceId: {
        type: String,
        required: true,
        text :true,
    },
    spanId: {
        type: String,
        required: true,
        text :true,
    },
    commit: {
        type: String,
        required: true,
        text :true,
    },
    metadata: {
        parentResourceId: {
            type: String,
            required: true,
            text :true,
        },
    },
});





const Log = mongoose.model('Log', logSchema);
// Assuming Log is your Mongoose model




app.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});

app.post('/logs', async (req, res) => {
    try {
        const log = new Log(req.body);
        await log.save();
        io.emit('newLog', log);
        res.status(201).send(log);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/logs/search', async (req, res) => {
    try {
      // Extract filters from the request body
      const { level, searchText, message, resourceId, timestamp, traceId, spanId, commit, parentResourceId } = req.body;
  
      // Build the filter object
      const filter = {};

      // Set the values in the filter only if they are truthy
      if (level) filter.level = { $regex: new RegExp(level, 'i') };
      if (message) filter.message = { $regex: new RegExp(message, 'i') };
      if (resourceId) filter.resourceId = { $regex: new RegExp(resourceId, 'i') };
      if (traceId) filter.traceId = { $regex: new RegExp(traceId, 'i') };
      if (spanId) filter.spanId = { $regex: new RegExp(spanId, 'i') };
      if (commit) filter.commit = { $regex: new RegExp(commit, 'i') };
      if (parentResourceId) filter['metadata.parentResourceId'] = { $regex: new RegExp(parentResourceId, 'i') };
      
      // Add timestamp filter if both start and end are provided
      if (timestamp && timestamp.start && timestamp.end) {
        filter.timestamp = { $gte: timestamp.start, $lte: timestamp.end };
      }
  
      // Remove undefined/null/empty-string properties from the filter object
      Object.keys(filter).forEach((key) => {
        if (filter[key] === undefined || filter[key] === null || filter[key] === '') {
          delete filter[key];
        }
      });
      // Create the search query
      let aggregationPipeline = [];

    // Add full-text search stage
    if (searchText) {
      aggregationPipeline.push({
        $search: {
        index:'All_over',
        phrase: {
            query: searchText,
            path: {
              wildcard: "*"
            }
          }
        }
      });
    }

    // Add filter stage
    if (Object.keys(filter).length > 0) {
      aggregationPipeline.push({ $match: filter });
    }

    // Execute the aggregation pipeline
    const result = await Log.aggregate(aggregationPipeline);
  
      // Log additional information for debugging
    //   console.log('Request Body:', req.body);
    //   console.log('Filter:', filter);
    //   console.log('Search Query:', searchQuery);
    //   console.log('Combined Query:', combinedQuery);
    //   console.log('Logs:', logs);
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

server.listen(port, () => {
    console.log(`Log Ingestor Server is running on port ${port}`);
});
