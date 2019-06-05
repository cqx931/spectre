import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '../../Components/Modal/Modal';
import SocialLogin from '../../Components/SocialLogin/SocialLogin';
import IconButton from '../../Components/IconButton/IconButton';
import SpectreHeader from '../../Components/SpectreHeader/SpectreHeader';
import UserSession from '../../Components/UserSession/UserSession';

import './LoginPage.scss';
import Video from '../../Components/Video/Video';
import NavigationHack from '../NavigationHack';
import grey from '@material-ui/core/colors/grey';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true; // TMP: #138

const styles = {
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundSize: 'cover',
  },
  clickToContinue: {
    margin: '20% 0',
  },
  marginTop: {
    marginBottom: 75,
  },
  border: {
    borderBottomColor: 'white',
  },
  textField: {
    color: grey[50],
    '&:before': {
      borderColor: grey[50],
    },
  },
  cssLabel: {
    transform: 'translate(0,1.5rem)',
    color: grey[50],
    '&$cssFocused': {
      color: grey[50],
    },
  },
  cssFocused: {
    '&:after': {
      borderBottomColor: grey[50],
    },
  },
  cssUnderline: {
    '&:after': {
      borderBottomColor: grey[50],
    },
  },
  cssOutlinedInput: {
    // TMP: removed to silence warning in console
    // '&$cssFocused $notchedOutline': {
    //   borderColor: grey[50],
    // }
  },
};

class LoginPage extends NavigationHack {
  constructor(props) {
    super(props, '/username');
    this.state = { toNext: false, modalOpen: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.modalContent = '';
    this.modalTitle = '';
  }

  handleChange(event) {
    const input = event.target.value;
    this.setState(
      {
        email: input,
      },
      () => {
        this.keyboardRef.keyboard.setInput(input);
      },
    );
    this.context.emailValid = this.validEmail(input);
    this.context.login = event.target.value; // user-prop
  }

  handleSubmit(e) {
    e.preventDefault();

    // get user from current context
    const user = this.context;
    user.lastPageVisit = { page: '/Login', time: Date.now() };
    user.loginType = 'email'; // TMP:

    if (user.login && user.emailValid) {
      const handleSuccess = (json) => {
        Object.assign(user, json);
        this.showVideo();
        console.log('User:', user);
      };

      const handleError = (error) => {
        if (e.error === 'EmailInUse') {
          this.modalTitle = 'Invalid email';
          this.modalContent = 'Email has already been used';
          this.setState({ modalOpen: true });
        } else {
          console.error(e);
          //console.log(UserSession.defaults);
          this.showVideo();
        }
      };
      UserSession.createUser(user, handleSuccess, handleError);
    } else if (user.login && !user.emailValid) {
      this.modalTitle = 'Oops...';
      this.modalContent = 'We couldn\'t find that email, please try again';
      this.setState({ modalOpen: true });
    } else {
      // TMP: should reject without successful User creation
      this.context.login = `test${+new Date()}@test.com`;
      this.showVideo();
    }
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  showVideo() {
    this.video.play();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root + ' LoginPage'}>
        <SpectreHeader />
        <div className={classes.content + ' LoginPage-content content'}>
          <Typography component="h2" variant="h2">Let's Play!</Typography>
          <Modal
            isOpen={this.state.modalOpen}
            title={this.modalTitle}
            content={this.modalContent}
            onClose={() => this.closeModal()}
          />
          <Video
            ref={(el) => { this.video = el; }}
            movie="/video/SpectreIntro.mp4"
            autoPlay={false}
            onComplete={this.next}
          />
          <SocialLogin />
          <IconButton onClick={this.handleSubmit} colour="white" icon="next" text="Next" />
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

LoginPage.contextType = UserSession;

export default withStyles(styles)(LoginPage);
