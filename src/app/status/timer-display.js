import React from 'react';


class TimerDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: this.props.timer,
    };
    /* STATE vs INSTANCE variables in React:
    Whenever state is updated, React calls render
    and makes any necessary changes to the real DOM.
    Because the value of 'this.p1Turn' and 'this.interval'
    has no effect on the rendering of this component,
    it shouldn't live in state. Putting it there would
    cause unnecessary calls to render. So it is perfectly
    fine to have local component variables that don't
    live in state! */
    this.p1Turn = this.props.p1Next;
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    let currentCount = this.state.currentCount;
    currentCount--;
    this.setState({currentCount});

    // Turn is over because time is up:
    if (this.p1Turn === this.props.p1Next && currentCount < 1) {
      this.props.changeTurn();
      this.setState({currentCount: this.props.timer});
    }
    // Turn is over because a player dropped a checker:
    if (this.p1Turn !== this.props.p1Next) {
      this.p1Turn = this.props.p1Next;
      this.setState({currentCount: this.props.timer});
    }
  }

  render() {
    let seconds = this.state.currentCount;
    let remainingSeconds = seconds + 's';

    // Turn is almost over because time is almost up => write message:
    // if (seconds < 2) {
    //   remainingSeconds = '1s: Quickly now!';
    // }
    // -> Currently disabled, because buggy on mobile (too much text for small screens)

    // Turn is over because a player dropped a checker:
    if (this.p1Turn !== this.props.p1Next) {
      // Prevent displaying the seconds of the previous turn for the
      // fraction of a second untill tick() resets the timer:
      remainingSeconds = '';
    }

    return (
      <span>
        {remainingSeconds}
      </span>
    );
  }
}


export default TimerDisplay;