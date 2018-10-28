/*****************************************************************************
* Appearantly it is near impossible to animate the grid such that the coins  *
* fall behind the grid, but before the 'holes' (which aren't real holes,     *
* since they're just circles filled with background color). We need a        *
* different approach; looking into both CSS grid layout and SVG elements.    *
******************************************************************************/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TweenMax from 'gsap/TweenMax';
// import Anime from 'react-anime';
// import anime from 'animejs';
// import TweenLite from 'gsap/TweenLite';
// import 'gsap/CSSPlugin';


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

// class Cell extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       cellClass: '',
//       coin: null,
//     };
//   }

//   showCoin() {
//     let cellClass;
//     if (this.props.redIsNext)
//       cellClass = 'cell red next';
//     else cellClass = 'cell yellow next';
//     //console.log('cellClass = ', cellClass);
//     this.setState({coin:
//                     <Anime
//                       delay={(el, index) => index * 10}
//                       easing='easeOutSine'
//                       duration={1000}
//                       direction={'normal'}
//                       translateY={'13rem'}
//                     >
//                       <div className={cellClass}/>
//                     </Anime>
//                   });
//   }

//   render() {
//     console.log('Render');
//     let cellClass = 'cell ' + this.props.color;
//     this.state.cellClass = cellClass;
//     return (
//       <div
//         className={this.state.cellClass}
//         onMouseEnter={() => this.showCoin()}
//         onMouseLeave={() => this.setState({coin: null})}
//         onClick={this.props.onClick}
//       >
//       {this.state.coin}
//       </div>
//     );
//   }
// }


// class Cell extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       cellClass: '',
//       coin: null,
//     };
//   }

//   showCoin() {
//     let cellClass;
//     if (this.props.redIsNext)
//       cellClass = 'cell red next';
//     else cellClass = 'cell yellow next';
//     //console.log('cellClass = ', cellClass);
//     this.setState({coin: <div className={cellClass}/>});
//     console.log('cellClass = ', cellClass);
//     anime({
//       targets: '.next',
//       translateY: '27.5rem', // Animate all divs translateX property to 250px
//       duration: 600,
//       loop: false,
//       direction: 'normal',
//       easing: 'easeOutCubic',
//     });
//   }

//   render() {
//     console.log('Render');
//     let cellClass = 'cell ' + this.props.color;
//     this.state.cellClass = cellClass;
//     anime({
//       targets: '.next',
//       translateY: '27.5rem', // Animate all divs translateX property to 250px
//       duration: 600,
//       loop: false,
//       direction: 'normal',
//       easing: 'easeOutSine',
//     });
//     return (
//       <div
//         className={this.state.cellClass}
//         onMouseEnter={() => this.showCoin()}
//         onMouseLeave={() => this.setState({coin: null})}
//         onClick={this.props.onClick}
//       >
//       {this.state.coin}
//       </div>
//     );
//   }
// }
// eslint-disable-next-line
class Cell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cellClass: '',
      coin: null,
    };
  }

  showCoin() {
    let cellClass;
    if (this.props.redIsNext)
      cellClass = 'cell red next';
    else cellClass = 'cell yellow next';
    //console.log('cellClass = ', cellClass);
    this.setState({coin: <Coin className={cellClass}/>});

  }

  render() {
    // console.log('Render');
    let cellClass = 'cell ' + this.props.color;
    // eslint-disable-next-line
    this.state.cellClass = cellClass;
    return (
      <div
        className={this.state.cellClass}
        onMouseEnter={() => this.showCoin()}
        onMouseLeave={() => this.setState({coin: null})}
        onClick={this.props.onClick}
      >
      {this.state.coin}
      </div>
    );
  }
}

class Coin extends React.Component {
  constructor(props){
    super(props);
    // reference to the DOM node
    this.myElement = null;
    // reference to the animation
    this.myTween = null;
  }

  componentDidMount(){
    // use the node ref to create the animation
    // this.myTween = TweenLite.to(this.myElement, 1, {y: '27.5rem'});
    this.myTween = TweenMax.fromTo(this.myElement, 1,
      {x: '-45rem'}, {x:'-45rem', y: '550rem', ease: 'easeOutBounce'});
  }

  render(){
    // console.log('cellClass = ', this.props.className);
    return <div className={this.props.className} ref={div => this.myElement = div} />;
  }
}

// function Cell(props) {
//   let classValue= "cell " + props.color;
//   return (
//     <div className={classValue} onClick={props.onClick} />
//   );
// }

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
      let row = [];
      for (let c = 0; c < this.state.cols; c++) {
        row.push('empty');
      }
      grid.push(row);
    }

    // this.setState({grid: grid}) is a no-op if the component
    // is not yet fully mounted => nasty bug!!!
    // eslint-disable-next-line
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

/*****************************************************************************
* Appearantly it is near impossible to animate the grid such that the coins  *
* fall behind the grid, but before the 'holes' (which aren't real holes,     *
* since they're just circles filled with background color). We need a        *
* different approach; looking into both CSS grid layout and SVG elements.    *
******************************************************************************/
  renderCell(r, c) {
    // return (<svg width="3.5rem" height="3.5rem" xmlns="http://www.w3.org/2000/svg" key={c}>
    //           <circle cx="1.75rem" cy="1.75rem" r="1.75rem" fill="red" />
    //         </svg>);
    return <Cell
              color={this.state.grid[r][c]}
              key={c}
              redIsNext={this.state.redIsNext}
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
    const winner = this.checkForWinner();

    return (
      <div>
        <Status winner={winner} redIsNext={this.state.redIsNext} />
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
