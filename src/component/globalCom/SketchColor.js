import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

/* 取色板组件 */
class SketchColor extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    displayColorPicker: false,
    color: 'rgba(241,112,19,1)'
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    let colorPick = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
    this.setState({ color: colorPick });
    this.props.setBgColor(colorPick);
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: '70px',
          height: '14px',
          borderRadius: '2px',
          background: this.state.color
        },
        swatch: {
          padding: '3px',
          background: '#fff',
          borderRadius: '0px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer'
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          right: '0px'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    });

    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker color={this.state.color} onChange={this.handleChange} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default SketchColor;
