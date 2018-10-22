import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Refactored to function component!
// class Cell extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       row: this.props.row,
//       col: this.props.col,
//       cellClass: '',
//     };
//   }
//   render() {
//     let cellClass = 'cell ' + this.props.color;
//     this.state.cellClass = cellClass;
//     return (
//       <div
//         className={this.state.cellClass}
//         data-row={this.state.row}
//         data-col={this.state.col}
//         onClick={this.props.onClick}
//       />
//     );
//   }
// }

function Cell(props) {
  let classValue= "cell " + props.color;
  return (
    <div className={classValue} onClick={props.onClick} />
  );
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 6,
      cols: 7,
      grid: [],
      redIsNext: true,
    };
    this.initGrid();
  }


  initGrid() {
    let grid = [];
    for (let r = 0; r < this.state.rows; r++) {
      var row = [];
      for (let c = 0; c < this.state.cols; c++) {
        row.push('empty');
      }
      grid.push(row);
    }

    // this.setState({grid: grid}) is a no-op if the component
    // is not yet fully mounted => nasty bug!!!
    this.state.grid = grid;
    // console.log('grid = ', grid);
    // console.log('this.state.grid = ', this.state.grid);
  }


  renderRow(r) {
    return (
      <div className="gridRow" key={r}>
        {
          [...Array(this.state.cols)].map((el, i) => {
            return this.renderCell(r, i);
          })
        }
      </div>
    );
  }

  renderCell(r, c) {
    return <Cell
              color={this.state.grid[r][c]}
              row={r}
              col={c}
              key={c}
              //onMouseEnter={() => this.showCoin()}
              //onMouseLeave={() => this.setState({coin: null})}
              onClick={() => this.handleClick(r, c)}
            />;
  }

  handleClick(r, c) {
    const grid = this.state.grid.slice();
    // if (checkForWinner(cells) || cells[i]) {
    //   return;
    // }
    grid[r][c] = this.state.redIsNext ? 'red' : 'yellow';
    this.setState({
      grid: grid,
      redIsNext: !this.state.redIsNext,
    });
  }

  render() {
    const winner = checkForWinner(this.state.grid);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.redIsNext ? 'red' : 'yellow');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div id="gameGrid">
          {
            [...Array(this.state.rows)].map((el, i) => {
              return this.renderRow(i);
            })
          }
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div>
        <Grid />
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function checkForWinner(grid) {

}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
