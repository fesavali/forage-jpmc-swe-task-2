import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
interface PerspectiveViewerElement {
  load: (table: Table) => void,
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element to attach the table from the DOM.
    const elem: PerspectiveViewerElement = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;
  
    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };
  
    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      // Configure the PerspectiveViewerElement separately
      const elem: HTMLElement = document.getElementsByTagName('perspective-viewer')[0];

      elem.setAttribute('row-pivots', JSON.stringify(['stock'])); // Allow pivoting rows by 'stock'.
      elem.setAttribute('sort', JSON.stringify([['timestamp', 'desc']])); // Sort data by 'timestamp' in descending order.
      elem.setAttribute('columns', JSON.stringify(['stock', 'top_ask_price', 'top_bid_price', 'timestamp'])); // Display only specified columns.
      elem.setAttribute('editable', 'false'); // Disable editing cells in the table.

      // Load the table into the PerspectiveViewerElement
      elem.load(this.table);
    }
  }

  componentDidUpdate(prevProps: IProps) {
    // Every time the data props is updated, insert the data into the Perspective table
    if (this.table && this.props.data !== prevProps.data) {
      // Create a set to store unique keys based on 'stock' and 'timestamp'
      const uniqueKeys = new Set<string>();
  
      // Filter the incoming data to include only unique entries
      const filteredData = this.props.data.filter((el) => {
        const key = `${el.stock}_${el.timestamp}`;
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
          return true;
        }
        return false;
      });
  
      // Format the data and update the Perspective table
      this.table.update(filteredData.map((el: any) => ({
        stock: el.stock,
        top_ask_price: el.top_ask && el.top_ask.price || 0,
        top_bid_price: el.top_bid && el.top_bid.price || 0,
        timestamp: el.timestamp,
      })));
    }
  }
  

export default Graph;