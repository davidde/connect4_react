import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

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
  let classValue= 'cell ' + props.color;
  return (
    <div className={classValue} onClick={props.onClick} />
  );
}

class Grid_old extends React.Component {
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
  }


  renderRow(r) {
    return (
      <div className='gridRow' key={r}>
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
      <React.Fragment>
        <Status winner={this.checkForWinner()} redIsNext={this.state.redIsNext} />
        <div id='grid'>
          <svg id='svg-container' width='100%' viewBox='0 0 810 785' xmlns='http://www.w3.org/2000/svg'>
            {/* This is the container svg, which holds the left and right 'pillars', the top and bottom
                paddings, and an extra invisible top row, which will show the checkers that are about to drop,
                when hovering. Turn on the $LSD bool in css to visualise this. */}
                <defs>
                  <radialGradient id='yellow' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
                    <stop offset='63%' stopColor='rgb(251, 255, 0)' stopOpacity='0.9' />
                    <stop offset='100%' stopColor='rgb(255, 174, 0)' stopOpacity='1' />
                  </radialGradient>(235, 118, 10)
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

                  <linearGradient id='blackTop' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='20%' stopColor='rgb(54, 51, 51)' stopOpacity='0.95' />
                      <stop offset='50%' stopColor='rgb(0, 0, 0)' stopOpacity='1' />
                      <stop offset='90%' stopColor='rgb(54, 51, 51)' stopOpacity='0.9' /> 
                  </linearGradient>
                  <linearGradient id='blackBottom' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='30%' stopColor='rgb(10, 10, 10)' stopOpacity='0.8' />
                      <stop offset='50%' stopColor='rgb(0, 0, 0)' stopOpacity='0.9' />
                      <stop offset='85%' stopColor='rgb(54, 51, 51)' stopOpacity='1' /> 
                  </linearGradient>
                  <linearGradient id='blackPillars' x1='0' y1='0' x2='1' y2='0'>
                      <stop offset='0%' stopColor='rgb(0, 0, 0)' stopOpacity='1' />
                      <stop offset='20%' stopColor='rgb(37, 35, 35)' stopOpacity='1' />
                      <stop offset='35%' stopColor='rgb(54, 51, 51)' stopOpacity='1' />
                      <stop offset='50%' stopColor='rgb(77, 72, 72)' stopOpacity='1' />
                      <stop offset='65%' stopColor='rgb(54, 51, 51)' stopOpacity='1' />
                      <stop offset='80%' stopColor='rgb(37, 35, 35)' stopOpacity='1' />
                      <stop offset='100%' stopColor='rgb(0, 0, 0)' stopOpacity='1' />
                  </linearGradient>
                  <linearGradient id='blackGreyBlack' x1='0' y1='0' x2='1' y2='0'>
                      <stop offset='0%' stopColor='rgb(0, 0, 0)' stopOpacity='1' />
                      <stop offset='12%' stopColor='rgb(15, 15, 15)' stopOpacity='0.9' />
                      <stop offset='35%' stopColor='rgb(30, 30, 30)' stopOpacity='0.85' />
                      <stop offset='50%' stopColor='rgb(50, 50, 50)' stopOpacity='0.80' />
                      <stop offset='65%' stopColor='rgb(30, 30, 30)' stopOpacity='0.85' />
                      <stop offset='88%' stopColor='rgb(15, 15, 15)' stopOpacity='0.9' />
                      <stop offset='100%' stopColor='rgb(0, 0, 0)' stopOpacity='1' />
                  </linearGradient>
                  {/* Filter for generating red svg tags for LSD */}
                  <filter id='redtags' x='-0.25' y='-0.25' width='1.5' height='1.6'>
                    <feFlood flood-color='red'/>
                    <feComposite in='SourceGraphic'/>
                  </filter>
                </defs>
                
              <svg id='svg-grid' width='700' height='640' x='57' y='115' xmlns='http://www.w3.org/2000/svg'>
                 {/* This is the actual grid svg consisting of 6 rows x 7 columns of square 100px x 100px cells;
                    this means the board itself is 600px by 700px with each column being 600 by 100px. */}
                <defs>
                  <pattern id='hole' patternUnits='userSpaceOnUse' width='100' height='100'>
                    {/* The <pattern> matches the size of a cell, 100x100, and contains a <circle>,
                        representing the hole, that matches the size of the checker.
                        The <circle> gets a fill color of 'black'; in the context of a <mask>, this
                        means the absence of space, or full transparency, as opposed to literal black. */}
                    <circle cx='50' cy='50' r='40' fill='black'></circle>
                  </pattern>

                  <mask id='cell-mask'>
                    {/* The <mask> is composed of two <rect> elements that match the grid column size;
                        the first gets a fill color of 'white' (opposite of 'black' in a mask) to represent
                        the part of the column we want to be opaque/visible.
                        The second <rect> sits on top of the first and has a fill of url(#hole) which refers
                        to the pattern we created above. */}
                    <rect width='100' height='600' fill='white'></rect>
                    <rect width='100' height='600' fill='url(#hole)'></rect>
                  </mask>
                </defs>

                {/* Now, we can set the mask attribute for our grid column <rect>, by referencing
                    the <mask> element by id: 'url(#cell-mask)'. A nice feature of the <pattern> element
                    is that it repeats itself, based on the height/width attributes we've provided.
                    This means we can reveal the 6 rows of a single column without adding each
                    circular hole to the DOM explicitly. To build multiple columns, we simply add
                    a nested <svg> element at the correct x position to wrap each masked <rect>! */}
                <svg id='column1' x='0' y='0'>
                  <rect width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
                </svg>

                <svg id='column2' x='99' y='0'>
                  <rect width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
                </svg>

                <svg id='column3' x='198' y='0'>
                  <rect width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
                </svg>

                <svg id='column4' x='297' y='0'>
                  <rect width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
                </svg>

                <svg id='column5' x='396' y='0'>
                  <rect width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
                </svg>
                
                <svg id='column6' x='495' y='0'>
                  <rect width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
                </svg>

                <svg id='column7' x='594' y='0'>
                  <rect width='106' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
                </svg>

              </svg>
              
            <g>
              <rect id='bottom-padding' width='700' height='20' x='51' y='712' fill='url(#blackBottom)' />
              <rect id='left-pillar' width='60' height='685' fill='url(#blackPillars)' x='0' y='100' rx='10' ry='10' />
              <rect id='right-pillar' width='60' height='685' fill='url(#blackPillars)' x='750' y='100' rx='10' ry='10' />
              <rect id='top-padding' width='710' height='20' x='48' y='100' fill='url(#blackTop)' />
              
              <text class='svg-tags' filter='url(#redtags)' x='22' y='15' fontSize='0.9rem' fill='white'>#svg-container</text>
              <text class='svg-tags' filter='url(#redtags)' x='77' y='137' fontSize='0.9rem' fill='white'>#svg-grid</text>
              <text class='svg-tags' filter='url(#redtags)' x='250' y='50' fontSize='0.9rem' fill='white'>ROW 0: Invisible top row for checkers about to drop</text>
            </g>
          </svg>
        </div>
      </React.Fragment>
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
    status = 'Next player: ' + (props.redIsNext ? 'red' : 'yellow');
    if (props.redIsNext)
      return (<div id='status'><p className='status red'>{status}</p></div>);
    else
      return (<div id='status'><p className='status yellow'>{status}</p></div>);
  }
}

class Grid extends React.Component {
  floatChecker() {
    // Show checker in the invisible top cell of the column that is hoovered on.


  }

  render() {
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
              <feFlood flood-color='red'/>
              <feComposite in='SourceGraphic'/>
            </filter>
          </defs>

          <svg id='svg-grid' width='700' height='700' x='54' y='0' xmlns='http://www.w3.org/2000/svg'>
            {/* This is the actual grid svg consisting of 7 column svg's;
                each column is 700px high by 100px wide, with the top cell an invisible one,
                to show pending checkers. */}

            <svg id='column0' x='0' y='0'>
              {/* Any checkers in the column should come at the start: */}
              <circle class='yellow' cx='50' cy='50' r='42' fill='url(#yellow)'/>
              {/* Invisible top cell: */}
              <rect x='0' y='0' width='100' height='100' fill='none' />
              {/* Actual visible column: */}
              <rect x='0' y='100' width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
            </svg>

            <svg id='column1' x='98' y='0'>
              <rect x='0' y='0' width='100' height='100' fill='none' />
              <rect x='0' y='100' width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
            </svg>

            <svg id='column2' x='196' y='0'>
              <rect x='0' y='0' width='100' height='100' fill='none' />
              <rect x='0' y='100' width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
            </svg>

            <svg id='column3' x='294' y='0'>
              <rect x='0' y='0' width='100' height='100' fill='none' />
              <rect x='0' y='100' width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
            </svg>

            <svg id='column4' x='392' y='0'>
              <rect x='0' y='0' width='100' height='100' fill='none' />
              <rect x='0' y='100' width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
            </svg>
            
            <svg id='column5' x='490' y='0'>
              <rect x='0' y='0' width='100' height='100' fill='none' />
              <rect x='0' y='100' width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
            </svg>

            <svg id='column6' x='588' y='0'>
              <rect x='0' y='0' width='100' height='100' fill='none' />
              <rect x='0' y='100' width='100' height='600' fill='url(#blackGreyBlack)' mask='url(#cell-mask)' />
            </svg>

          </svg>
            
          <g>
            <rect id='bottom-padding' width='700' height='20' x='51' y='695' fill='url(#blackBottom)' />
            <rect id='left-pillar' width='60' height='680' fill='url(#blackPillars)' x='0' y='100' rx='10' ry='10' />
            <rect id='right-pillar' width='60' height='680' fill='url(#blackPillars)' x='736' y='100' rx='10' ry='10' />
            
            {/* Svg tags for LSD; only visible when '$LSD: true;' in css */}
            <text class='svg-tags' filter='url(#redtags)' x='22' y='15' fontSize='0.9rem' fill='white'>#svg-container</text>
            <text class='svg-tags' filter='url(#redtags)' x='73' y='89' fontSize='0.9rem' fill='white'>#svg-grid</text>
            <text class='svg-tags' filter='url(#redtags)' x='250' y='50' fontSize='0.9rem' fill='white'>Invisible top row for checkers about to drop</text>
          </g>
        </svg>
      </div>
    );
  }
}

class Game extends React.Component {
  // The <Game/> component functions as a container component for the
  // <Status/>, <Settings/> and <Grid/> presentational components.
  constructor(props) {
    super(props);
    this.state = {
      rows: 6,
      cols: 7,
      grid: [],
      redIsNext: true,
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

  findBottomCell(col) {
    // Finds the bottom empty cell in a column, where the coin should drop to.
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
    return ((color === a) && (color === b) && (color === c));
  }

  render() {
    return (
      <div id='game'>
        {/* 'game' is a css grid containing the <Status/>, <Settings/> and <Grid/> components */}
        <Status winner={this.checkForWinner()} redIsNext={this.state.redIsNext} />
        <Grid grid={this.state.grid} />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
