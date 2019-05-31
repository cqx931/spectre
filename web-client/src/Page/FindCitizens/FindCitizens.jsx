import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import IconButton from '../../Components/IconButton/IconButton';
import SpectreHeader from '../../Components/SpectreHeader/SpectreHeader';
import FooterLogo from '../../Components/FooterLogo/FooterLogo';

const styles = {

  root: {
    flexGrow: 1,
    width: "100%",
    color: 'black'
  },
};

class FindCitizens extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <SpectreHeader colour="white" progressActive={true} progressNumber="two" />
        <div className={classes.content + " content"}>
            <Typography component="h5" variant="h5">Excellent.</Typography>
            <Typography component="h6" variant="h6">Now you can find all UK citizens with a similar OCEAN profile to {this.context.targetName} that have never voted before!</Typography>
            <Typography component="h6" variant="h6">A silent army that could well tip the balance.</Typography>
            <Link to="/targets-found">
                <IconButton icon="next" text="Find them" />
            </Link>
        </div>
        <FooterLogo />
    </div>
    );
  }
}

FindCitizens.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FindCitizens);
