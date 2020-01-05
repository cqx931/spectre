import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import IconButton from '../../Components/IconButton/IconButton';
import UserSession from '../../Components/UserSession/UserSession';

import SpectreHeader from '../../Components/SpectreHeader/SpectreHeader';
import FooterLogo from '../../Components/FooterLogo/FooterLogo';
import IdleChecker from '../../Components/IdleChecker/IdleChecker';

const styles = {
  root: {
    flexGrow: 1,
    width: '100%',
    color: 'black',
  },
  content: {},
  image: {
    width: '160px',
    height: '130px',
    margin: '25px',
  },
  button: {
    borderRadius: '28px',
    margin: '30px',
    border: 'solid 3px #929391',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    color: '#929391',
    width: '330px',
    height: '54px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    padding: 0,
    textTransform: 'initial',
    fontSize: '24px',
    '&:hover': {
      backgroundColor: '#21c0fc',
      color: '#ffffff',
    },
  },
  ad: {
    position: 'relative',
    margin: '0 auto',
    width: '800px',
    height: '570px',
  },
  adImage: {
    width: '800px',
    height: '570px',
  },
  campaignImage: {
    position: 'absolute',
    bottom: '0px',
    right: '0',
    width: '150px',
  },
  adText: {
    position: 'absolute',
    top: '43%',
    fontSize: '45px',
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    width: '100%',
    backgroundColor: 'red',
  },
};

class DarkAd extends React.Component {
  constructor(props) {
    super(props, '/target-ad');
    this.state = {
      text: '',
      issue: '',
      images: [],
      slogans: [],
      defaultImageSelected: true,
      image: '/imgs/darkad-default.png'
    };
  }

  async componentDidMount() {
    const user = await UserSession.ensure(this.context,
      ['_id', 'adIssue', 'target', 'targetImages', 'targetSlogans']);
    this.setState({
      issue: user.adIssue,
      images: user.targetImages,
      slogans: user.targetSlogans
    });
  }

  render() {
    const { classes } = this.props;
    const { issue, images, slogans } = this.state;
    const redimg = UserSession.imageDir + 'darkadred.png';
    const cimage = UserSession.imageDir + 'vote-' + issue + '.png';

    return (
      <div className={classes.root + " darkAd"}>
        <SpectreHeader colour="white" progressActive progressNumber="one" />
        <IdleChecker />
        <div className={`${classes.content} content`}>
          <Typography component="h6" variant="h6"><strong>Create Your Campaign</strong></Typography>
          <div className={classes.ad}>    { /* adIssue should never change after being selected '*/}
            <img className={classes.adImage} src={this.state.image} alt="leave"></img>
            <p className={classes.adText}>{this.state.text}</p>
            {!this.state.defaultImageSelected ? <img className={classes.campaignImage} src={cimage} alt="leave"></img> : ''}
          </div>
          <div>
            {images.map((image, i) => (
              <img className={classes.image} src={image} alt="leave" key={i}
                onClick={() => { this.setState({ image: image, defaultImageSelected: false }) }}></img>
            ))}
          </div>
          <div>
            {slogans.map((slogan, i) => (
              <Button className={classes.button} variant="contained" color="primary" key={i}
                onClick={() => {
                  if (this.state.defaultImageSelected) this.setState({ image: redimg });
                  this.setState({ text: slogan, defaultImageSelected: false })
                }}>
                {slogan.split(' ').slice(0, 2).join(' ') + '...'}
              </Button>
            ))}
          </div>

          <Link to="/target-ad" onClick={() => this.context.targetAd =
            { image: this.state.image, text: this.state.text }}>
            <IconButton icon="next" text="Next" />
          </Link>
        </div>
        <FooterLogo />
      </div>
    );
  }
}

DarkAd.propTypes = {
  classes: PropTypes.object.isRequired,
};
DarkAd.contextType = UserSession;

export default withStyles(styles)(DarkAd);
