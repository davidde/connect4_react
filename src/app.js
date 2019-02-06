import React from 'react';

import './app.scss';
import vars from './_variables.scss';

import Status from './status';
import Settings from './settings';
import Grid from './grid';


class App extends React.Component {
  // The <App/> component functions as a container component for the
  // <Status/>, <Settings/> and <Grid/> presenter components.
  constructor(props) {
    super(props);
    this.state = {
      rows: 6,
      cols: 7,
      grid: [],
      winner: null, // also serves as a gameOver boolean
      p1Next: true,
      p1Color: 'red',
      p2Color: 'yellow',
      // Settings/Sidebar state:
      portraitActive: false,
      landscapePassive: false,
      clientX: null,
      clientY: null,
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
    // Column its executing in). It then executes within the <App/>
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

    let winner = this.checkForWinner();
    if (winner) {
      this.setState({ winner });
    }

    bottomCell = this.findBottomCell(colID);
    if (bottomCell === null) return 'fullColumn';

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
    var grid = this.state.grid;

    // Check bottom to top
    for (let c = 0; c < this.state.cols; c++) {
      for (let r = 0; r < this.state.rows - 3; r++) {
        if (grid[c][r] === null)
          // if the bottom of the column is empty, continue with next column ...
          break;
        if (this.checkLine(grid[c][r], grid[c][r+1], grid[c][r+2], grid[c][r+3])) {
          let winColor = grid[c][r];
          // Make winning checkers recognizable in grid data structure:
          grid[c][r] = grid[c][r+1] = grid[c][r+2] = grid[c][r+3] = winColor.toUpperCase();
          this.setState({ grid });
          return winColor;
        }
      }
    }

    // Check left to right
    for (let c = 0; c < this.state.cols - 3; c++) {
      for (let r = 0; r < this.state.rows; r++) {
        if (grid[c][r] === null)
          // if the left of the row is empty, continue with next column ...
          break;
        if (this.checkLine(grid[c][r], grid[c+1][r], grid[c+2][r], grid[c+3][r])) {
          let winColor = grid[c][r];
          grid[c][r] = grid[c+1][r] = grid[c+2][r] = grid[c+3][r] = winColor.toUpperCase();
          this.setState({ grid });
          return winColor;
        }
      }
    }

    // Check down-left to top-right
    for (let c = 0; c < this.state.cols - 3; c++) {
      for (let r = 0; r < this.state.rows - 3; r++) {
        if (grid[c][r] === null)
          // if the left of the line is empty, continue with next column ...
          break;
        if (this.checkLine(grid[c][r], grid[c+1][r+1], grid[c+2][r+2], grid[c+3][r+3])) {
          let winColor = grid[c][r];
          grid[c][r] = grid[c+1][r+1] = grid[c+2][r+2] = grid[c+3][r+3] = winColor.toUpperCase();
          this.setState({ grid });
          return winColor;
        }
      }
    }
  
    // Check down-right to top-left
    for (let c = this.state.cols - 1; c >= 3; c--) {
      for (let r = 0; r < this.state.rows - 3; r++) {
        if (grid[c][r] === null)
          // if the right of the line is empty, continue with next column on the left ...
          break;
        if (this.checkLine(grid[c][r], grid[c-1][r+1], grid[c-2][r+2], grid[c-3][r+3])) {
          let winColor = grid[c][r];
          grid[c][r] = grid[c-1][r+1] = grid[c-2][r+2] = grid[c-3][r+3] = winColor.toUpperCase();
          this.setState({ grid });
          return winColor;
        }
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

  //////////////////////////////////
  //       Sidebar Methods:       //
  //////////////////////////////////
  handleTouchStart = (event) => {
    // 'touches' returns a list of all the touch objects
    // that are currently in contact with the surface;
    // touches[0] indicates that it will only show the
    // coordinates of one finger (the first).
    let clientX = event.touches[0].clientX;
    let clientY = event.touches[0].clientY;
    this.setState({ clientX, clientY });
  }

  handleTouchMove = (event) => {
    // 'clientX' returns the X coordinate of the touch point
    // relative to the left edge of the browser viewport,
    // not including any scroll offset.
    let clientX = this.state.clientX;
    // 'clientY' returns the Y coordinate of the touch point
    // relative to the top edge of the browser viewport,
    // not including any scroll offset.
    let clientY = this.state.clientY;

    if ( !clientX || !clientY ) {
        return;
    }

    if ( Math.abs(clientX) > ((25/100) * (window.screen.width)) ) {
      if ( !this.state.portraitActive ) {
        return;
      }
    }

    let xDelta = event.touches[0].clientX - clientX;
    let yDelta = event.touches[0].clientY - clientY;

    if ( Math.abs(xDelta) > Math.abs(yDelta) ) {
      // if xDelta > 0: right swipe
      if (xDelta > 0) {
        if ( window.matchMedia("(orientation: landscape)").matches && window.innerWidth > vars.mediaQueryWidth) {
          this.setState({ landscapePassive: true });
        } else {
          this.setState({ portraitActive: true });
        }
      } else {
        // if xDelta < 0: left swipe
        if ( window.matchMedia("(orientation: landscape)").matches && window.innerWidth > vars.mediaQueryWidth) {
          this.setState({ landscapePassive: false });
        } else {
          this.setState({ portraitActive: false });
        }
      }
    }

    clientX = null;
    clientY = null;
    this.setState({ clientX, clientY });

    //event.preventDefault();
  }

  toggleLandscape = () => {
    this.setState({ landscapePassive: !this.state.landscapePassive });
  }

  togglePortrait = () => {
    this.setState({ portraitActive: !this.state.portraitActive });
  }

  handleClick = () => {
    if ( window.matchMedia("(orientation: landscape)").matches && window.innerWidth > vars.mediaQueryWidth) {
      this.toggleLandscape();
    } else {
      this.togglePortrait();
    }
  }

  handleSideClick = () => {
    if ( window.matchMedia("(orientation: landscape)").matches && window.innerWidth > vars.mediaQueryWidth) {
      if (this.state.landscapePassive) {
        this.toggleLandscape();
      }
    } else {
      if (!this.state.portraitActive) {
        this.togglePortrait();
      }
    }
  }

  render() {
    return (
      <div id='app'
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove} >
        {/* 'app' is a css grid containing the <Status/>, <Settings/> and <Grid/> components */}

        <Status
            winner={this.state.winner}
            p1Next={this.state.p1Next}
        />

        <Settings
            landscapePassive={this.state.landscapePassive}
            portraitActive={this.state.portraitActive}
            onClick={this.handleClick}
            onSideClick={this.handleSideClick}
        />

        <Grid
            cols={this.state.cols}
            winner={this.state.winner}
            p1Next={this.state.p1Next}
            p1Color={this.state.p1Color}
            p2Color={this.state.p2Color}
            onColumnClick={this.setGet_colData}
        />
      </div>
    );
  }
}


export default App;