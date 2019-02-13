import React from 'react';





class Counter extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <form>
        <label className='fontColor'>Turn timeout counter: &nbsp;
          <select name='counter' value={this.props.counter} onChange={this.props.setCounter} >
            <option value='0'>none</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
            <option value='11'>11</option>
            <option value='12'>12</option>
            <option value='13'>13</option>
            <option value='14'>14</option>
            <option value='15'>15</option>
            <option value='16'>16</option>
            <option value='17'>17</option>
            <option value='18'>18</option>
            <option value='19'>19</option>
            <option value='20'>20</option>
          </select>
        </label>
      </form>
    );
  }
}


export default Counter;