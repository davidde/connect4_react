import React from 'react';
import Column from './column';
import './grid.scss';


class Grid extends React.Component {
  // This may seem like a nasty wall of code, but it is entirely
  // inline-svg; it does nothing than set the visuals of the grid
  // and its checkers. The magic happens in its <Column/> child
  // components, and its parent component, <Game/>.
  render() {
    let className;
    if (this.props.winner)
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
                          winner={this.props.winner}
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


export default Grid;