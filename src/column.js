import React from 'react';
import Checker from './checker';
import './column.scss';


class Column extends React.Component {
  // PROPS: (- key)
  //        - colID
  //        - winner
  //        - p1Next
  //        - p1Color
  //        - p2Color
  //        - onColumnClick: onClick-handler that executes within the Game
  //          component's context, and returns colData when necessary.
  constructor(props) {
    super(props);
    this.state = {
      colData: [],
      isHovered: false,
      fullColumn: false,
    };
  }

  // ES6 Arrow functions are a more concise syntax for writing JavaScript
  // functions; we avoid having to type the 'function' and 'return' keyword.
  // On top of that, arrow functions are anonymous and change the way
  // 'this' binds in functions; this is why we don't need
  // 'this.mouseEnter = this.mouseEnter.bind(this);' in the constructor.
  mouseEnter = () => {
    this.setState({ isHovered: true });
  }
  mouseLeave = () => {
    this.setState({ isHovered: false });
  }

  handleClick = () => {
    // Guard against changing colData after winner or fullColumn:
    if (this.state.fullColumn || this.props.winner)
      return;
    let setGet_colData = this.props.onColumnClick;
    let colData = setGet_colData(this.props.colID);

    this.mouseLeave();

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
    let hoverChecker = false;
    if (this.state.isHovered && !this.state.fullColumn && !this.props.winner) {
      // In these conditions, enable a column to be focussed on,
      // and hovered over with a checker.
      className = 'colInFocus';
      hoverChecker = true;
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
            hoverChecker ? // Hover checker in invisible top row:
                <Checker color={color} rowID={0} /> : null
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
          <rect x='0'
                y='100'
                width='100'
                height='600'
                fill='url(#blackGreyBlack)'
                mask='url(#cell-mask)' />
        </svg>
      </React.Fragment>
    );
  }
}


export default Column;