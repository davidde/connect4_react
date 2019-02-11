import React from 'react';
import './gridsize.scss';


class Gridsize extends React.Component {

  render() {
    return (
      <form>
        <label className='fontColor'>Gridsize: &nbsp;
          <select name='gridsize' value={this.props.rows} onChange={this.props.setGridRows} >
            <option value='4'>extra small</option>
            <option value='5'>small</option>
            <option value='6'>medium</option>
            <option value='7'>large</option>
            <option value='8'>extra large</option>
            <option value='9'>huge</option>
            <option value='10'>massive</option>
          </select>
        </label>
      </form>
    );
  }
}


export default Gridsize;