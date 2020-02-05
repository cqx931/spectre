import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '../../Components/IconButton/IconButton';
import { Link } from 'react-router-dom';
import SpectreHeader from '../../Components/SpectreHeader/SpectreHeader';
import FooterLogo from '../../Components/FooterLogo/FooterLogo';
import UserSession from '../../Components/UserSession/UserSession';
import AvatarComponent from '../../Components/AvatarComponent/AvatarComponent';
//import colours from '../../colors.scss';
import IdleChecker from '../../Components/IdleChecker/IdleChecker';
import ComponentsStyles from '../../App.module.css';

const styles = {


};

class Selected extends React.Component {
  constructor(props) {
    super(props, '/insight-gender');
    this.state = {
      targetName: '',
      targetImage: UserSession.profileDir + 'default.jpg'
    };
  }

  async componentDidMount() {
    const user = await UserSession.ensure(this.context,
      ['_id', 'name', 'login', 'gender', 'virtue', 'target']);
    this.setState({
      targetName: user.target.name,
      targetImage: user.targetImageUrl()
    })
  }

  render() {
    const { classes } = this.props;
    const { targetName, targetImage } = this.state;
    return (
      <div className={`${classes.root} Selected`}>
        <SpectreHeader colour="white" progressActive={true} progressNumber="one" />
        <IdleChecker />
        <div className={`${classes.content} content`}>
          <h1>You selected:</h1>
          <div>
            <AvatarComponent target={{ name: targetName, image: targetImage }} />
          </div>
          <p className="copy">Let&apos;s start by verifying some of the basics to
            unlock insight into <strong>{targetName}</strong>. </p>
          <p className="copy">Don’t worry, only you will see the results. </p>
          <div className="link">
          <Link to="/insight-gender">
            <IconButton enabled={true} className={ComponentsStyles.iconButtonStyle1} icon="tick" text="Dive in" />
          </Link>
          </div>
        </div>
        <FooterLogo />
      </div>
    );
  }
}

Selected.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
Selected.contextType = UserSession;

export default withStyles(styles)(Selected);
