import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';


function Checker(props) {
  // PROPS: - color
  //        - rowID: the row of the checker; with '0' being the invisible top row,
  //                 '1' = the top row, '2' the second from the top, etc.
  //        (- key: Each child in an array or iterator should have a unique "key" prop;
  //                this is a requirement because of the Array construct we used to
  //                'loop' the checkers.)
  let cy = (props.rowID * 100 + 50).toString();
  return <circle cx='50' cy={cy} r='42'
                  className={props.color}
                  fill={'url(#' + props.color + ')'} />;
}

class Column extends React.Component {
  // PROPS: (- key)
  //        - colID
  //        - gameOver
  //        - p1Next
  //        - p1Color
  //        - p2Color
  //        - onColumnClick: onClick-handler that executes within the Game
  //          component's context, and returns colData when necessary.
  constructor(props) {
    super(props);
    this.state = {
      colData: [],
      showChecker: false,
      fullColumn: false,
    };
  }

  // ES6 Arrow functions are a more concise syntax for writing JavaScript
  // functions; we avoid having to type the 'function' and 'return' keyword.
  // On top of that, arrow functions are anonymous and change the way
  // 'this' binds in functions; this is why we don't need
  // 'this.mouseEnter = this.mouseEnter.bind(this);' in the constructor.
  mouseEnter = () => {
    this.setState({ showChecker: true });
  }
  mouseLeave = () => {
    this.setState({ showChecker: false });
  }

  handleClick = () => {
    // Guard against changing colData after gameOver or fullColumn:
    if (this.state.fullColumn || this.props.gameOver)
      return;
    let setGet_colData = this.props.onColumnClick;
    let colData = setGet_colData(this.props.colID);

    //this.mouseLeave();

    if (colData === 'fullColumn')
      this.setState({ fullColumn: true });
    else if (Array.isArray(colData))
      this.setState({ colData });
  }

  render() {
    let id = 'column' + this.props.colID;
    let x = (98 * this.props.colID).toString();
    let color = this.props.p1Next ? this.props.p1Color : this.props.p2Color;

    let className = 'colNoFocus';
    let colFocus = false;
    if (this.state.showChecker && !this.props.gameOver && !this.state.fullColumn) {
      // In these conditions, enable a column to be focussed on,
      // and hovered over with a checker.
      className = 'colInFocus';
      colFocus = true;
    }

    return (
      <React.Fragment>
        <svg x={x} y='0'
              id={id}
              className={className}
              onMouseEnter={this.mouseEnter}
              onMouseLeave={this.mouseLeave}
              onClick={this.handleClick}>
          {/* Any checkers in the column should come at the start of the svg,
              so they're effectively BEHIND the column! So checkers go here: */}
          {
            colFocus ? // Hover checker in invisible top row:
                <Checker color={color} rowID='0' /> : null
          }

          {
            this.state.colData.map((color, i) => {
              if (color)
                  return <Checker
                            key={i}
                            // Invert rowID order because svg orders top down
                            // and the colData array is ordered bottom up!
                            rowID={Math.abs(i - 6)}
                            color={color} />;
              return null;
            })
          }
          {/* Invisible top cell: */}
          <rect x='0' y='0' width='100' height='100' fill='none' />
          {/* Actual visible column: */}
          <rect x='0' y='100'
                width='100'
                height='600'
                fill='url(#blackGreyBlack)'
                mask='url(#cell-mask)' />
        </svg>
      </React.Fragment>
    );
  }
}

class Grid extends React.Component {
  // This may seem like a nasty wall of code, but it is entirely
  // inline-svg; it does nothing than set the visuals of the grid
  // and its checkers. The magic happens in its <Column/> child
  // components, and its parent component, <Game/>.
  render() {
    let className;
    if (this.props.gameOver)
      className = 'gridNoFocus'
    return (
      <div id='grid'>
        <svg id='svg-container' width='100%' viewBox='0 0 800 780' xmlns='http://www.w3.org/2000/svg'>
          {/* This is the container svg, which holds the left and right 'pillars', the bottom padding,
              and an extra invisible top row, which will show the checkers that are about to drop,
              when hovering. Turn on the $LSD bool in css to visualise this. */}
          <defs>
            {/* Gradients to make checkers look all fancy */}
            <radialGradient id='yellow' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
              <stop offset='63%' stopColor='rgb(251, 255, 0)' stopOpacity='0.9' />
              <stop offset='100%' stopColor='rgb(255, 174, 0)' stopOpacity='1' />
            </radialGradient>
            <radialGradient id='orange' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
                <stop offset='65%' stopColor='rgb(253, 156, 0)' stopOpacity='0.65' />
                <stop offset='100%' stopColor='rgb(253, 101, 0)' stopOpacity='0.95' />
            </radialGradient>
            <radialGradient id='red' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
                <stop offset='60%' stopColor='rgb(246, 75, 7)' stopOpacity='0.8' />
                <stop offset='100%' stopColor='rgb(209, 0, 7)' stopOpacity='1' />
            </radialGradient>
            <radialGradient id='green' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
                <stop offset='65%' stopColor='rgb(134, 246, 7)' stopOpacity='0.8' />
                <stop offset='100%' stopColor='rgb(21, 139, 0)' stopOpacity='1' />
            </radialGradient>
            <radialGradient id='cyan' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
                <stop offset='65%' stopColor='rgb(66, 255, 182)' stopOpacity='1' />
                <stop offset='100%' stopColor='rgb(15, 119, 145)' stopOpacity='1' />
            </radialGradient>
            <radialGradient id='blue' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
                <stop offset='60%' stopColor='rgb(7, 210, 246)' stopOpacity='0.8' />
                <stop offset='100%' stopColor='rgb(0, 79, 251)' stopOpacity='1' />
            </radialGradient>
            <radialGradient id='purple' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
                <stop offset='60%' stopColor='rgb(255, 84, 190)' stopOpacity='0.8' />
                <stop offset='100%' stopColor='rgb(159, 0, 251)' stopOpacity='1' />
            </radialGradient>

            {/* Gradients to make board look more realistic */}
            <linearGradient id='blackBottom' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='30%' stopColor='rgb(10, 10, 10)' stopOpacity='0.8' />
                <stop offset='50%' stopColor='rgb(0, 0, 0)' stopOpacity='0.9' />
                <stop offset='85%' stopColor='rgb(54, 51, 51)' stopOpacity='1' /> 
            </linearGradient>
            <linearGradient id='blackPillars' x1='0' y1='0' x2='1' y2='0'>
                <stop offset='0%' stopColor='rgb(0, 0, 0)' stopOpacity='1' />
                <stop offset='20%' stopColor='rgb(25, 25, 25)' stopOpacity='1' />
                <stop offset='35%' stopColor='rgb(40, 40, 40)' stopOpacity='1' />
                <stop offset='50%' stopColor='rgb(60, 60, 60)' stopOpacity='1' />
                <stop offset='65%' stopColor='rgb(40, 40, 40)' stopOpacity='1' />
                <stop offset='80%' stopColor='rgb(25, 25, 25)' stopOpacity='1' />
                <stop offset='100%' stopColor='rgb(0, 0, 0)' stopOpacity='1' />
            </linearGradient>
            <linearGradient id='blackGreyBlack' x1='0' y1='0' x2='1' y2='0'>
                <stop offset='0%' stopColor='rgb(0, 0, 0)' stopOpacity='1' />
                <stop offset='12%' stopColor='rgb(25, 25, 25)' stopOpacity='0.95' />
                <stop offset='35%' stopColor='rgb(25, 25, 25)' stopOpacity='0.9' />
                <stop offset='50%' stopColor='rgb(30, 30, 30)' stopOpacity='0.85' />
                <stop offset='65%' stopColor='rgb(25, 25, 25)' stopOpacity='0.9' />
                <stop offset='88%' stopColor='rgb(25, 25, 25)' stopOpacity='0.95' />
                <stop offset='100%' stopColor='rgb(0, 0, 0)' stopOpacity='1' />
            </linearGradient>

            {/* pattern and mask to punch the holes in the grid */}
            <pattern id='hole' patternUnits='userSpaceOnUse' width='100' height='100'>
              {/* The <pattern> matches the size of a cell, 100x100, and contains a <circle>,
                  representing the hole, that matches the size of the checker.
                  The <circle> gets a fill color of 'black'; in the context of a <mask>, this
                  means the absence of space, or full transparency, as opposed to literal black. */}
              <circle cx='50' cy='50' r='42' fill='black'></circle>
            </pattern>
            <mask id='cell-mask'>
              {/* The <mask> is composed of two <rect> elements that match the grid column size;
                  the first gets a fill color of 'white' (opposite of 'black' in a mask) to represent
                  the part of the column we want to be opaque/visible.
                  The second <rect> sits on top of the first and has a fill of url(#hole) which refers
                  to the pattern we created above. */}
              <rect width='100' height='700' fill='white'></rect>
              <rect width='100' height='700' fill='url(#hole)'></rect>
              {/* Now, we can set the mask attribute for our grid column <rect>, by referencing
                  the <mask> element by id: 'url(#cell-mask)'. A nice feature of the <pattern> element
                  is that it repeats itself, based on the height/width attributes we've provided.
                  This means we can reveal the 6 rows of a single column without adding each
                  circular hole to the DOM explicitly. To build multiple columns, we simply add
                  a nested <svg> element at the correct x position to wrap each masked <rect>! */}
            </mask>

            {/* Filter for generating red svg tags for LSD */}
            <filter id='redtags' x='-0.25' y='-0.25' width='1.5' height='1.6'>
              <feFlood floodColor='red'/>
              <feComposite in='SourceGraphic'/>
            </filter>
          </defs>

          <svg id='svg-grid' className={className} width='700' height='700' x='54' y='0' xmlns='http://www.w3.org/2000/svg'>
            {/* This is the actual grid svg consisting of 7 column svg's;
                each column is 700px high by 100px wide, with the top cell an invisible one,
                to show pending checkers. */}
            {
              // Since regular looping is not available inside JSX code,
              // we use an array construct to 'loop' to create
              // the columns of the grid!
              [...Array(this.props.cols)].map((el, i) => {
                return <Column
                          key={i}
                          colID={i}
                          gameOver={this.props.gameOver}
                          p1Next={this.props.p1Next}
                          p1Color={this.props.p1Color}
                          p2Color={this.props.p2Color}
                          onColumnClick={this.props.onColumnClick}
                       />;
              })
            }
          </svg>

          <g className={className}>
            <rect id='bottom-padding' width='688' height='20' x='54' y='695' fill='url(#blackBottom)' />
            <rect id='left-pillar' width='60' height='680' fill='url(#blackPillars)' x='0' y='100' rx='10' ry='10' />
            <rect id='right-pillar' width='60' height='680' fill='url(#blackPillars)' x='736' y='100' rx='10' ry='10' />
            
            {/* Svg tags for LSD; only visible when '$LSD: true;' in css */}
            <text className='svg-tags' filter='url(#redtags)' x='22' y='15' fontSize='0.9rem' fill='white'>#svg-container</text>
            <text className='svg-tags' filter='url(#redtags)' x='73' y='89' fontSize='0.9rem' fill='white'>#svg-grid</text>
            <text className='svg-tags' filter='url(#redtags)' x='250' y='50' fontSize='0.9rem' fill='white'>Invisible top row for checkers about to drop</text>
          </g>
        </svg>
      </div>
    );
  }
}

class Game extends React.Component {
  // The <Game/> component functions as a container component for the
  // <Status/>, <Settings/> and <Grid/> presenter components.
  constructor(props) {
    super(props);
    this.state = {
      rows: 6,
      cols: 7,
      grid: [],
      gameOver: false,
      p1Next: true,
      p1Color: 'red',
      p2Color: 'yellow',
    };
  }

  componentWillMount() {
    this.initGrid();
  }

  initGrid() {
    // Create grid data structure to keep track of which grid cells
    // contain checkers of which color:
    // 'grid' = array of COLUMN arrays!
    let grid = [];
    for (let c = 0; c < this.state.cols; c++) {
      let column = [];
      for (let r = 0; r < this.state.rows; r++) {
        column.push(null);
      }
      grid.push(column);
    }

    this.setState({grid: grid});
  }

  setGet_colData = (colID) => {
    // This method is called on every click on a column, to modify the
    // grid data structure. It needs to be passed to <Column/> through
    // props, where it will receive its 'colID' argument (the ID of the
    // Column its executing in). It then executes within the <Game/>
    // component's context (since this is an ES6 arrow function), and
    // sets the bottom cell of the grid data structure to the relevant
    // color. Finally, it either returns its modified colData array to the
    // <Column/> component, which is then used to render individual
    // checkers in that column, or it returns a string indicating 'fullColumn'.
    let bottomCell = this.findBottomCell(colID);

    const grid = this.state.grid.slice();
    grid[colID][bottomCell] = this.state.p1Next ? this.state.p1Color : this.state.p2Color;
    this.setState({
      grid: grid,
      p1Next: !this.state.p1Next,
    });

    bottomCell = this.findBottomCell(colID);
    if (bottomCell === null) return 'fullColumn';

    if (this.checkForWinner()) {
      this.setState({ gameOver: true });
    }

    let colData = grid[colID];
    return colData;
  }

  findBottomCell(col) {
    // Finds the bottom empty cell in a column, where the checker should drop to.
    // The bottom of the column is defined here as the START of the array!
    for (let r = 0; r < this.state.rows; r++) {
      if (this.state.grid[col][r] === null) {
        return r;
      }
    }
    return null;
  }

  checkForWinner() {
    // The idea of this function is to basically limit the checks to those that make sense.
    // For example, when checking cells bottom to top (see the first loop),
    // you only need to check the bottom 3 rows (r = 0, 1, 2) in each column (c = 0, 1, 2, 3, 4, 5, 6).
    // That's because starting higher would run off the top of the board
    // before finding a possible win. In other words, row sets {0,1,2,3}, {1,2,3,4} and {2,3,4,5}
    // would be valid but {3,4,5,6} would not, because the six valid rows are 0-5.
    const grid = this.state.grid;

    // Check bottom to top
    for (let c = 0; c < this.state.cols; c++) {
        for (let r = 0; r < this.state.rows - 3; r++) {
            if (grid[c][r] === null)
                // if the bottom of the column is empty, continue with next column ...
                break;
            if (this.checkLine(grid[c][r], grid[c][r+1], grid[c][r+2], grid[c][r+3]))
                return grid[c][r];
        }
    }

    // Check left to right
    for (let c = 0; c < this.state.cols - 3; c++) {
        for (let r = 0; r < this.state.rows; r++) {
            if (grid[c][r] === null)
                // if the left of the row is empty, continue with next column ...
                break;
            if (this.checkLine(grid[c][r], grid[c+1][r], grid[c+2][r], grid[c+3][r]))
                return grid[c][r];
        }
    }

    // Check down-left to top-right
    for (let c = 0; c < this.state.cols - 3; c++) {
        for (let r = 0; r < this.state.rows - 3; r++) {
            if (grid[c][r] === null)
                // if the left of the line is empty, continue with next column ...
                break;
            if (this.checkLine(grid[c][r], grid[c+1][r+1], grid[c+2][r+2], grid[c+3][r+3]))
                return grid[c][r];
        }
    }
  
    // Check down-right to top-left
    for (let c = this.state.cols - 1; c >= 3; c--) {
        for (let r = 0; r < this.state.rows - 3; r++) {
            if (grid[c][r] === null)
                // if the right of the line is empty, continue with next column on the left ...
                break;
            if (this.checkLine(grid[c][r], grid[c-1][r+1], grid[c-2][r+2], grid[c-3][r+3]))
                return grid[c][r];
        }
    }

    return null;
  }
  
  checkLine(color, a, b, c) {
    // Check if all cells have the same color
    // NOTE: Calling function needs to make sure
    //       first argument is a color, and not null.
    return ((color === a) && (color === b) && (color === c));
  }

  render() {
    return (
      <div id='game'>
        {/* 'game' is a css grid containing the <Status/>, <Settings/> and <Grid/> components */}
        <Status
            winner={this.checkForWinner()}
            p1Next={this.state.p1Next}
        />
        <Grid
            cols={this.state.cols}
            gameOver={this.state.gameOver}
            p1Next={this.state.p1Next}
            p1Color={this.state.p1Color}
            p2Color={this.state.p2Color}
            onColumnClick={this.setGet_colData}
        />
      </div>
    );
  }
}


function Status(props) {
  let status;
  if (props.winner) {
    status = 'Winner: ' + props.winner + '!!!';
    if (props.winner === 'red')
      return (<div id='status'><h3 className='winner red'>{status}</h3></div>);
    else
      return (<div id='status'><h3 className='winner yellow'>{status}</h3></div>);
  } else {
    status = 'Next player: ' + (props.p1Next ? 'red' : 'yellow');
    if (props.p1Next)
      return (<div id='status'><p className='status red'>{status}</p></div>);
    else
      return (<div id='status'><p className='status yellow'>{status}</p></div>);
  }
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
