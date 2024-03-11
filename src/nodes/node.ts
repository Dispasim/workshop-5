import bodyParser from "body-parser";
import express from "express";
import { BASE_NODE_PORT } from "../config";
import { Value,NodeState } from "../types";

export async function node(
  nodeId: number, // the ID of the node
  N: number, // total number of nodes in the network
  F: number, // number of faulty nodes in the network
  initialValue: Value, // initial value of the node
  isFaulty: boolean, // true if the node is faulty, false otherwise
  nodesAreReady: () => boolean, // used to know if all nodes are ready to receive requests
  setNodeIsReady: (index: number) => void // this should be called when the node is started and ready to receive requests
) {
  const node = express();
  node.use(express.json());
  node.use(bodyParser.json());

  let consensusValue: Value = initialValue;
  let decided: boolean | null = null;
  let k: number | null = null;

  

  // TODO implement this
  // this route allows retrieving the current status of the node
  // node.get("/status", (req, res) => {});
  node.get("/status", (req, res) => {
    if (isFaulty) {
      res.status(500).send('faulty');
    } else {
      res.status(200).send('live');
    }
  });
  

  // TODO implement this
  // this route allows the node to receive messages from other nodes
  // node.post("/message", (req, res) => {});
  node.post("/message", (req, res) => {
    const { message, senderId } = req.body;
    // Handle the received message from other nodes
    // Update consensusValue, decided, and k based on the algorithm
  
    // Example implementation: Update consensusValue with the received message
    consensusValue = message;
  
    // Check if the majority is reached
    const majorityThreshold = Math.floor((N + F) / 2) + 1;
    if (k === null) {
      k = 1;
    } else {
      k++;
    }
    if (k >= majorityThreshold) {
      decided = true;
    }
  
    res.sendStatus(200);
  });
  

  // TODO implement this
  // this route is used to start the consensus algorithm
  // node.get("/start", async (req, res) => {});
  node.get("/start", async (req, res) => {
    // Start the consensus algorithm
    if (decided !== null) {
      res.status(400).json({ message: "Consensus algorithm already started" });
      return;
    }

    // Perform the necessary steps as per the Ben-Or algorithm
    // Update consensusValue, decided, and k based on the algorithm

    // Example implementation: Set decided to false and k to 0 to start the algorithm
    decided = false;
    k = 0;

    res.sendStatus(200);
  });

  // TODO implement this
  // this route is used to stop the consensus algorithm
  // node.get("/stop", async (req, res) => {});
  node.get("/stop", async (req, res) => {
    // Stop the consensus algorithm
    // Set any necessary flags or variables to stop the algorithm

    // Example implementation: Set decided and k to null to stop the algorithm
    decided = null;
    k = null;

    res.sendStatus(200);
  });

  // TODO implement this
  // get the current state of a node
  // node.get("/getState", (req, res) => {});
  node.get("/getState", (req, res) => {
    const nodeState: NodeState = {
      killed: false, // Assuming this information is not relevant for the current state
      x: consensusValue,
      decided: decided,
      k: k,
    };
    res.json(nodeState);
  });

  // start the server
  const server = node.listen(BASE_NODE_PORT + nodeId, async () => {
    console.log(
      `Node ${nodeId} is listening on port ${BASE_NODE_PORT + nodeId}`
    );

    // the node is ready
    setNodeIsReady(nodeId);
  });

  return server;
}
