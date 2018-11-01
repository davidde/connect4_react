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
    // this.initGrid();
  }

  componentWillMount() {
    this.initGrid();
  }

  initGrid() {
    let grid = [];
    for (let r = 0; r < this.state.rows; r++) {
      let row = [];
      for (let c = 0; c < this.state.cols; c++) {
        row.push('empty');
      }
      grid.push(row);
    }

    this.setState({grid: grid});
    // this.setState({grid: grid}) is a no-op if the component
    // is not yet fully mounted => nasty bug!!!
    // this.state.grid = grid;
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
    let bottomCell = this.findBottomCell(c);
    if (this.checkForWinner() || bottomCell === null) return;
    grid[bottomCell][c] = this.state.redIsNext ? 'red' : 'yellow';
    this.setState({
      grid: grid,
      redIsNext: !this.state.redIsNext,
    });
  }

  findBottomCell(col) {
    // Finds the bottom empty cell in a column, where the coin should drop to.
    for (let r = this.state.rows - 1; r >= 0; r--) {
      for (let c = 0; c < this.state.cols; c++) {
        if (c === col && this.state.grid[r][c] === 'empty') {
          return r;
        }
      }
    }
    return null;
  }

  checkForWinner() {
    // The idea of this function is to basically limit the checks to those that make sense.
    // For example, when checking cells top down (see the first loop),
    // you only need to check the upper 3 rows (r = 0, 1, 2) in each column (c = 0, 1, 2, 3, 4, 5, 6).
    // That's because starting lower would run off the bottom of the board
    // before finding a possible win. In other words, row sets {0,1,2,3}, {1,2,3,4} and {2,3,4,5}
    // would be valid but {3,4,5,6} would not, because the six valid rows are 0-5.
    
    const grid = this.state.grid;

    // Check down
    for (let r = 0; r < this.state.rows - 3; r++)
        for (let c = 0; c < this.state.cols; c++)
            if (this.checkLine(grid[r][c], grid[r+1][c], grid[r+2][c], grid[r+3][c]))
                return grid[r][c];
  
    // Check right
    for (let r = 0; r < this.state.rows; r++)
        for (let c = 0; c < this.state.cols - 3; c++)
            if (this.checkLine(grid[r][c], grid[r][c+1], grid[r][c+2], grid[r][c+3]))
                return grid[r][c];
  
    // Check down-right
    for (let r = 0; r < this.state.rows - 3; r++)
        for (let c = 0; c < this.state.cols - 3; c++)
            if (this.checkLine(grid[r][c], grid[r+1][c+1], grid[r+2][c+2], grid[r+3][c+3]))
                return grid[r][c];
  
    // Check down-left
    for (let r = this.state.rows - 3; r < this.state.rows; r++)
        for (let c = 0; c < this.state.cols - 3; c++)
            if (this.checkLine(grid[r][c], grid[r-1][c+1], grid[r-2][c+2], grid[r-3][c+3]))
                return grid[r][c];
  
    return null;
  }
  
  checkLine(a, b, c, d) {
    // Check if the first cell is not 'empty' and the next cells match
    return ((a !== 'empty') && (a === b) && (a === c) && (a === d));
  }
  
  
  render() {
    return (
      <div>
        <Status winner={this.checkForWinner()} redIsNext={this.state.redIsNext} />
        <div id="gameGrid">
          {
            // This construct 'loops' to create the rows of the grid;
            // regular looping is not available inside JSX code!
            [...Array(this.state.rows)].map((el, i) => {
              return this.renderRow(i);
            })
          }
        </div>
      </div>
    );
  }
}

function Status(props) {
  let status;
  if (props.winner) {
    status = 'Winner: ' + props.winner + '!!!';
    if (props.winner === 'red')
      return (<h3 className="winner red">{status}</h3>);
    else
      return (<h3 className="winner yellow">{status}</h3>);
  } else {
    status = 'Next player: ' + (props.redIsNext ? 'red' : 'yellow');
    if (props.redIsNext)
      return (<h3 className="status red">{status}</h3>);
    else
      return (<h3 className="status yellow">{status}</h3>);
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
