import React from 'react';

import './app.scss';
import vars from './_variables.scss';

import Status from './status/status';
import Settings from './settings/settings';
import Game from './game/game';

/**
 * The <App/> component functions as a container component for the
 * <Status/>, <Settings/> and <Game/> presenter components.
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // number of rows of the grid; cols = rows + 1
      rows: 6,
      grid: [],
      fullColumns: [],
      p1Next: true,
      p1Color: 'red',
      p2Color: 'yellow',
      winner: null,
      gameOver: false,
      timer: 0,
      // Settings/Sidebar state:
      portraitActive: false, // Sidebar is active in portrait orientation (inactive by default in portrait)
      landscapePassive: false, // Sidebar is inactive in landscape orientation (active by default in landscape)
      clientX: null, // don't need to be in state!?
      clientY: null, // should be: this.clientX and this.clientY
    };

    this.initGrid(this.state.rows);
  }

  /**
   * `initGrid` initialises the 'grid' and 'fullColumns' data structures:
   * - 'grid' keeps track of which grid cells contain checkers of which player/color
   *   NOTE:
   *   'grid' = array of COLUMN arrays!
   *   (NOT row arrays, which seems more intuitive at first sight)
   *   (COLUMN subarrays are algorithmically simpler when dropping checkers)
   * - 'fullColumns' keeps track of which grid columns are full:
   *   each entry corresponds to the equivalent column subarray in 'grid'
   */
  initGrid(rows) {
    let grid = [];
    let fullColumns = [];
    let cols = rows + 1;
    for (let c = 0; c < cols; c++) {
      fullColumns.push(false);
      let column = [];
      for (let r = 0; r < rows; r++) {
        column.push(null);
      }
      grid.push(column);
    }

    // If 'this.state.grid' is already initialised (i.e. non-empty),
    // the call is NOT from inside the constructor, so we use 'setState',
    // and also reset state associated with game-over:
    if (this.state.grid.length !== 0) {
      this.setState({
        rows,
        grid,
        fullColumns,
        winner: null,
        gameOver: false,
        p1Next: true,
      });
    } else {
      // If the grid is empty, this call came from inside the constructor,
      // so we need to set state directly, instead of using 'setState'.
      // We only need to initialise the 'grid' and 'fullColumns' arrays
      // in this case, and we can safely silence the
      // "Do not mutate state directly, Use setState()" warning:
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state = {
        ...this.state,
        grid,
        fullColumns,
      }
    }
  }

  /**
   * This method is called on every click on a column, to modify the grid data
   * structure and related state. It needs to be passed to <Column/> through
   * props, where it will receive its 'colID' argument (the ID of the
   * Column its executing in). It then executes within the <App/>
   * component's context (since this is an ES6 arrow function), and
   * sets the bottom cell of the grid data structure to the relevant
   * color. Finally, it checks if this change results in a winner
   * or a 'fullColumn'.
   */
  updateGridState = (colID) => {
    let bottomCell = this.findBottomCell(colID);

    const grid = this.state.grid.slice();
    grid[colID][bottomCell] = this.state.p1Next ? 'p1:' + this.state.p1Color : 'p2:' + this.state.p2Color;

    let winner = this.checkForWinner(grid);
    let gameOver = (winner !== null);

    // If there is not bottom empty cell AFTER grid update, that column is full:
    bottomCell = this.findBottomCell(colID);
    const fullColumns = this.state.fullColumns.slice();
    if (bottomCell === null) fullColumns[colID] = true;
    if (!fullColumns.includes(false)) gameOver = true;

    this.setState({
      grid,
      fullColumns,
      winner,
      gameOver,
      p1Next: !this.state.p1Next,
    });
  }

  /**
   * Finds the bottom empty cell in a column, where the checker should drop to.
   * @param {array} col - State of a column; bottom of the column = START of the array!
   */
  findBottomCell(col) {
    for (let r = 0; r < this.state.rows; r++) {
      if (this.state.grid[col][r] === null) {
        return r;
      }
    }
    return null;
  }

  /**
   * The idea of this function is to basically limit the checks to those that make sense.
   * For example, when checking cells bottom to top (see the first loop),
   * you only need to check the bottom 3 rows (r = 0, 1, 2) in each column (c = 0, 1, 2, 3, 4, 5, 6).
   * That's because starting higher would run off the top of the board
   * before finding a possible win. In other words, row sets {0,1,2,3}, {1,2,3,4} and {2,3,4,5}
   * would be valid but {3,4,5,6} would not, because the six valid rows are 0-5.
   * @param {array} grid - State of the grid, as an array of COLUMN arrays!
   */
  checkForWinner(grid) {
    let cols = this.state.rows + 1;

    // Check bottom to top
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < this.state.rows - 3; r++) {
        if (grid[c][r] === null)
          // if the bottom of the column is empty, continue with next column ...
          break;
        if (this.checkLine(grid[c][r], grid[c][r+1], grid[c][r+2], grid[c][r+3])) {
          let winColor = grid[c][r].slice(3);
          // Mark winning checkers with 'w' instead of 'p':
          grid[c][r] = 'w' + grid[c][r].slice(1);
          grid[c][r+1] = 'w' + grid[c][r+1].slice(1);
          grid[c][r+2] = 'w' + grid[c][r+2].slice(1);
          grid[c][r+3] = 'w' + grid[c][r+3].slice(1);
          this.setState({ grid });
          return winColor;
        }
      }
    }

    // Check left to right
    for (let c = 0; c < cols - 3; c++) {
      for (let r = 0; r < this.state.rows; r++) {
        if (grid[c][r] === null)
          // if the left of the row is empty, continue with next column ...
          break;
        if (this.checkLine(grid[c][r], grid[c+1][r], grid[c+2][r], grid[c+3][r])) {
          let winColor = grid[c][r].slice(3);
          // Mark winning checkers with 'w' instead of 'p':
          grid[c][r] = 'w' + grid[c][r].slice(1);
          grid[c+1][r] = 'w' + grid[c+1][r].slice(1);
          grid[c+2][r] = 'w' + grid[c+2][r].slice(1);
          grid[c+3][r] = 'w' + grid[c+3][r].slice(1);
          this.setState({ grid });
          return winColor;
        }
      }
    }

    // Check down-left to top-right
    for (let c = 0; c < cols - 3; c++) {
      for (let r = 0; r < this.state.rows - 3; r++) {
        if (grid[c][r] === null)
          // if the left of the line is empty, continue with next column ...
          break;
        if (this.checkLine(grid[c][r], grid[c+1][r+1], grid[c+2][r+2], grid[c+3][r+3])) {
          let winColor = grid[c][r].slice(3);
          // Mark winning checkers with 'w' instead of 'p':
          grid[c][r] = 'w' + grid[c][r].slice(1);
          grid[c+1][r+1] = 'w' + grid[c+1][r+1].slice(1);
          grid[c+2][r+2] = 'w' + grid[c+2][r+2].slice(1);
          grid[c+3][r+3] = 'w' + grid[c+3][r+3].slice(1);
          this.setState({ grid });
          return winColor;
        }
      }
    }
  
    // Check down-right to top-left
    for (let c = cols - 1; c >= 3; c--) {
      for (let r = 0; r < this.state.rows - 3; r++) {
        if (grid[c][r] === null)
          // if the right of the line is empty, continue with next column on the left ...
          break;
        if (this.checkLine(grid[c][r], grid[c-1][r+1], grid[c-2][r+2], grid[c-3][r+3])) {
          let winColor = grid[c][r].slice(3);
          // Mark winning checkers with 'w' instead of 'p':
          grid[c][r] = 'w' + grid[c][r].slice(1);
          grid[c-1][r+1] = 'w' + grid[c-1][r+1].slice(1);
          grid[c-2][r+2] = 'w' + grid[c-2][r+2].slice(1);
          grid[c-3][r+3] = 'w' + grid[c-3][r+3].slice(1);
          this.setState({ grid });
          return winColor;
        }
      }
    }

    return null;
  }

  /**
   * Check if all cells have a checker from the same player
   * @param {null or string} a, b, c, d - Checkers in the grid
   * Each checker string is of the form: 'p1:color' or 'p2:color'
   */
  checkLine(a, b, c, d) {
    // Check if all cells are non-empty:
    if (a && b && c && d) {
      // check if all checkers are from same player:
      // the second letter (index [1]) in a checker string indicates the player
      return ((a[1] === b[1]) && (a[1] === c[1]) && (a[1] === d[1]));
    }
    return false;
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

  // Clicking the Settings icon should activate the sidebar:
  handleClick = () => {
    if ( window.matchMedia("(orientation: landscape)").matches && window.innerWidth > vars.mediaQueryWidth) {
      this.toggleLandscape();
    } else {
      this.togglePortrait();
    }
  }

  // Clicking the small strip of sidebar should also activate sidebar:
  handleSideClick = () => {
    if ( window.matchMedia("(orientation: landscape)").matches && window.innerWidth > vars.mediaQueryWidth) {
      // Clicking the sidestrip should only work when the sidebar is NOT active:
      if (this.state.landscapePassive) {
        this.toggleLandscape();
      }
    } else {
      if (!this.state.portraitActive) {
        this.togglePortrait();
      }
    }
  }
  /////////// END Sidebar Methods ///////////////////////////////////////////////////////

  /**
   * This method should be passed to the Gridsize component inside the Settings component;
   * it takes the number of rows as input to determine the Gridsize and set the app state.
   */
  resetGrid = (event) => {
    let rows = parseInt(event.target.value);
    this.initGrid(rows);
  }

  /**
   * To pass parameters to event handlers while using property initializer syntax, we need to use currying;
   * Passing two parameters to the same function like 'setCheckerColor = (player, event) => {}' would not work,
   * because the onClick event invokes the callback by passing an event object as first and only parameter.
   * Hence if we use '= (player, event) => {}' then the event would be passed in the 'player' parameter and the
   * 'event' parameter would be undefined. By using currying, we are creating a closure which is equivalent to:
   *
   * ```javascript
   * setCheckerColor = (player) => {
   *   return (event) => {
   *     ...
   *   }
   * }
   * ```
   *
   * This method should be passed to the CheckerColor component inside the Settings component;
   * it takes the checker color as input and sets it in app state.
   */
  setCheckerColor = (player) => (event) => {
    let color = event.target.value;
    if (player === 'Player 1:')
      this.setState({p1Color: color});
    else
      this.setState({p2Color: color});
  }

  setTimer = (event) => {
    let timer = parseInt(event.target.value);
    this.setState({timer});
  }

  changeTurn = () => {
    this.setState({p1Next: !this.state.p1Next});
  }

  render() {
    return (
      <div id='app'
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove} >
        {/* 'app' is a css grid containing the <Settings/>, <Status/> and <Game/> components */}

        <Settings
            landscapePassive={this.state.landscapePassive}
            portraitActive={this.state.portraitActive}
            onClick={this.handleClick}
            onSideClick={this.handleSideClick}

            rows={this.state.rows}
            resetGrid={this.resetGrid}
            p1Color={this.state.p1Color}
            p2Color={this.state.p2Color}
            setCheckerColor={this.setCheckerColor}
            timer={this.state.timer}
            setTimer={this.setTimer}
        />

        <Status
            winner={this.state.winner}
            gameOver={this.state.gameOver}
            p1Next={this.state.p1Next}
            p1Color={this.state.p1Color}
            p2Color={this.state.p2Color}
            changeTurn={this.changeTurn}
            timer={this.state.timer}
        />

        <Game
            rows={this.state.rows}
            grid={this.state.grid}
            fullColumns={this.state.fullColumns}
            gameOver={this.state.gameOver}
            p1Next={this.state.p1Next}
            p1Color={this.state.p1Color}
            p2Color={this.state.p2Color}
            onColumnClick={this.updateGridState}
            resetGrid={this.resetGrid}
        />
      </div>
    );
  }
}


export default App;