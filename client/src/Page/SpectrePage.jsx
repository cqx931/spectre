import React from 'react';
import PropTypes from 'prop-types';

const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

// Allows quick navigation via left-right arrows for dev
class SpectrePage extends React.Component {

  constructor(props, next = '/') {
    super(props);
    this.navigateTo = next;
    this.next = this.next.bind(this);
    this.navigate = this.navigate.bind(this);
    this.previous = this.previous.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', this.navigate);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.navigate);
  }
  // 
  // logUserProperties() {
  //   let s = '{ ';
  //   Object.keys(this.context).forEach(p => {
  //     if (this.context[p]) {
  //       s += p + ':' + this.context[p] + ', ';
  //     }
  //   });
  //   s = s.substring(0, s.length - 2) + ' }';
  //   console.log(s);
  // }

  navigate(event) {
    //console.log('touched', event.keyCode);
    switch (event.keyCode) {
      case LEFT_ARROW:
        this.previous();
        break;
      case RIGHT_ARROW:
        this.next();
        break;
      default:
    }
  }

  previous() {
    this.props.history.goBack();
  }

  next() {
    // track the last page visited and time
    if (typeof this.context.lastPageVisit !== 'undefined') {
      this.context.lastPageVisit = { page: this.navigateTo, time: Date.now() }
      //console.log('[Page]', this.context.lastPageVisit);
    }
    this.props.history.push(this.navigateTo);
  }
}

SpectrePage.propTypes = {
  history: PropTypes.object.isRequired,
  next: PropTypes.string.isRequired,
};

export default SpectrePage;
