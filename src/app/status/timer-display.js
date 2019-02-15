import React from 'react';


class TimerDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: this.props.timer,
    };
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
    if (this.p1Turn === this.props.p1Next && currentCount < 0) {
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
    let timerMessage = seconds + 's';

    // Turn is over because time is up => write message:
    if (seconds < 1) {
      timerMessage = "Quickly now!";
    }

    return (
      <span>
        {timerMessage}
      </span>
    );
  }
}


export default TimerDisplay;