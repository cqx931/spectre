import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import SpectreHeader from '../../Components/SpectreHeader/SpectreHeader';
import FooterLogo from '../../Components/FooterLogo/FooterLogo';
import UserSession from '../../Components/UserSession/UserSession';

const styles = {
  root: {
    flexGrow: 1,
    width: "100%",
    color: 'black',
  },
  clickToContinue: {
    margin: "20% 0",
  }
};

class PickYourSide extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
          <SpectreHeader colour="white" />
          <div className={classes.content + " content"}>
              <Typography component="h6" variant="h6">What’s your preference?</Typography>
              <Link to="/campaign">
                  <img src="https://i.gyazo.com/1890ddef64e0bde795334a2e8564d3b1.png" alt='leave' onClick={() => { this.context.adIssue = 'leave' }}></img>
              </Link>
              <Link to="/campaign">
                  <img src="https://i.gyazo.com/de4447b86eac589133ad3ae0e399b5d4.png" alt='remain' onClick={() => { this.context.adIssue = 'remain' }}></img>
              </Link>
          </div >
          <FooterLogo />
      </div >
    );
  }
}

PickYourSide.propTypes = {
  classes: PropTypes.object.isRequired,
};
PickYourSide.contextType = UserSession;

export default withStyles(styles)(PickYourSide);
