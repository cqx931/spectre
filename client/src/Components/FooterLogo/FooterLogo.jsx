import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import './FooterLogo.scss';

const styles = {
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center'
  },
};
const imageCount = 10;

class FooterLogo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imageNumber: Math.floor(Math.random() * imageCount) };
  }

  render() {
    const { classes } = this.props;
    const { imageNumber } = this.state;
    return (
      <div>
      <div className={`${classes.root} FooterLogo`}
        style={{ backgroundImage: `url(/imgs/footer-banner-${imageNumber}.png)` }}>
        <svg
          width="150"
          height="150"
          viewBox="0 0 131 142"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M65.5 0C54.8065 0 46 8.42742 46 19C46 29.4194 54.6492 38 65.5 38C76.1935 38 85 29.5726 85 19C85 8.58065 76.3508 0 65.5 0ZM65.5 30.6452C58.8952 30.6452 53.5484 25.4355 53.5484 19C53.5484 12.5645 58.8952 7.35484 65.5 7.35484C72.1048 7.35484 77.4516 12.5645 77.4516 19C77.4516 25.4355 72.1048 30.6452 65.5 30.6452Z"
            fill="#9EA0A2"
          />
          <path
            d="M111.5 24C100.806 24 92 32.6492 92 43.5C92 54.1935 100.649 63 111.5 63C122.194 63 131 54.3508 131 43.5C131 32.8065 122.351 24 111.5 24ZM111.5 55.4516C104.895 55.4516 99.5484 50.1048 99.5484 43.5C99.5484 36.8952 104.895 31.5484 111.5 31.5484C118.105 31.5484 123.452 36.8952 123.452 43.5C123.452 50.1048 118.105 55.4516 111.5 55.4516Z"
            fill="#9EA0A2"
          />
          <path
            d="M19 24C8.58065 24 0 32.6492 0 43.5C0 54.1935 8.42742 63 19 63C29.4194 63 38 54.3508 38 43.5C38 32.8065 29.5726 24 19 24ZM19 55.4516C12.5645 55.4516 7.35484 50.1048 7.35484 43.5C7.35484 36.8952 12.5645 31.5484 19 31.5484C25.4355 31.5484 30.6452 36.8952 30.6452 43.5C30.6452 50.1048 25.4355 55.4516 19 55.4516Z"
            fill="#9EA0A2"
          />
          <path
            d="M65.5 142C76.1935 142 85 133.351 85 122.5C85 111.806 76.3508 103 65.5 103C54.8065 103 46 111.649 46 122.5C46 133.194 54.6492 142 65.5 142ZM65.5 110.548C72.1048 110.548 77.4516 115.895 77.4516 122.5C77.4516 129.105 72.1048 134.452 65.5 134.452C58.8952 134.452 53.5484 129.105 53.5484 122.5C53.5484 115.895 58.8952 110.548 65.5 110.548Z"
            fill="#9EA0A2"
          />
          <path
            d="M19 117C29.4194 117 38 108.351 38 97.5C38 86.8065 29.5726 78 19 78C8.58065 78 0 86.6492 0 97.5C0 108.194 8.42742 117 19 117ZM19 85.5484C25.4355 85.5484 30.6452 90.8952 30.6452 97.5C30.6452 104.105 25.4355 109.452 19 109.452C12.5645 109.452 7.35484 104.105 7.35484 97.5C7.35484 90.8952 12.5645 85.5484 19 85.5484Z"
            fill="#9EA0A2"
          />
          <path
            d="M111.5 117C122.194 117 131 108.351 131 97.5C131 86.8065 122.351 78 111.5 78C100.806 78 92 86.6492 92 97.5C92 108.194 100.649 117 111.5 117ZM111.5 85.5484C118.105 85.5484 123.452 90.8952 123.452 97.5C123.452 104.105 118.105 109.452 111.5 109.452C104.895 109.452 99.5484 104.105 99.5484 97.5C99.5484 90.8952 104.895 85.5484 111.5 85.5484Z"
            fill="#9EA0A2"
          />
          <path
            d="M61 55.5C61 59.1667 58.2308 62 55 62C51.6154 62 49 59 49 55.5C49 51.8333 51.7692 49 55 49C58.3846 49 61 52 61 55.5Z"
            fill="#00BFFF"
          />
          <path
            d="M81 55.5C81 59.1667 78.2308 62 75 62C71.6154 62 69 59 69 55.5C69 51.8333 71.7692 49 75 49C78.3846 49 81 52 81 55.5Z"
            fill="#00BFFF"
          />
          <path
            d="M61 86C61 89.3846 58.2308 92 55 92C51.6154 92 49 89.2308 49 86C49 82.6154 51.7692 80 55 80C58.3846 80 61 82.7692 61 86Z"
            fill="#00BFFF"
          />
          <path
            d="M81 86C81 89.3846 78.2308 92 75 92C71.6154 92 69 89.2308 69 86C69 82.6154 71.7692 80 75 80C78.3846 80 81 82.7692 81 86Z"
            fill="#00BFFF"
          />
          <path
            d="M90 71C90 74.3846 87.2308 77 84 77C80.6154 77 78 74.2308 78 71C78 67.6154 80.7692 65 84 65C87.3846 65 90 67.7692 90 71Z"
            fill="#00BFFF"
          />
          <path
            d="M53 71C53 74.3846 50.2308 77 47 77C43.6154 77 41 74.2308 41 71C41 67.6154 43.7692 65 47 65C50.3846 65 53 67.7692 53 71Z"
            fill="#00BFFF"
          />
        </svg>
      </div></div>
    );
  }
}

FooterLogo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FooterLogo);
