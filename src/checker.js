import React from 'react';
import TweenMax from 'gsap/TweenMax';
import './checker.scss';


class Checker extends React.Component {
  // PROPS: - color
  //        - rowID: the row of the checker; with '0' being the invisible top row,
  //                 '1' = the top row, '2' the second from the top, etc.
  //        (- key: Each child in an array or iterator should have a unique "key" prop;
  //                this is a requirement because of the Array construct we used to
  //                'loop' the checkers.)
  constructor(props) {
    super(props);
    // Reference to the DOM node:
    this.node = null;
    // Reference to the animation:
    this.tween = null;
  }

  componentDidMount() {
    let cy = (this.props.rowID * 100).toString();
    let duration = (this.props.rowID * 0.1 + 0.2).toString();
    // Use the node ref to create the animation:
    this.tween = TweenMax.fromTo(this.node,
                                duration,
                                {x: '0', y: '0'},
                                {x: '0', y: cy,
                                ease: 'easeOutBounce'});
  }

  render() {
    let color = this.props.color;
    let className = this.props.color;

    if (color === color.toUpperCase()) {
      color = color.toLowerCase();
      className = color + ' winningChecker';
    }

    return <circle
              r ='42'
              cx='50'
              cy='50'
              className={className}
              fill={'url(#' + color + ')'}
              ref={circle => this.node = circle}
            />;
  }
}

export default Checker;