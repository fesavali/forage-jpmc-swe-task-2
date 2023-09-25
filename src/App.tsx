import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

interface IState {
  data: ServerRespond[];
}

class App extends Component<{}, IState> {
  // Define a variable to hold the interval ID
  private intervalId: NodeJS.Timeout | undefined;

  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    // Start the data streaming when the component is mounted
    this.startDataStreaming();
  }

  componentWillUnmount() {
    // Stop the data streaming when the component is unmounted
    this.stopDataStreaming();
  }

  startDataStreaming() {
    // Use setInterval to fetch data every 100 milliseconds
    this.intervalId = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state with the new data
        this.setState((prevState) => ({
          data: [...prevState.data, ...serverResponds],
        }));
      });
    }, 100);
  }

  stopDataStreaming() {
    // Clear the interval to stop data fetching when the component is unmounted
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  renderGraph() {
    return <Graph data={this.state.data} />;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">Bank & Merge Co Task 2</header>
        <div className="App-content">
          <div className="Graph">{this.renderGraph()}</div>
        </div>
      </div>
    );
  }
}

export default App;
