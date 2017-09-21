const hoistNonReactStatic = require('hoist-non-react-statics');
const React = require('react');
const ReactDOM = require('react-dom');

module.exports = function enhanceWithClickOutside(WrappedComponent) {
  const componentName = WrappedComponent.displayName || WrappedComponent.name;

  class EnhancedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
      window.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
      window.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside(e) {
      const domNode = this.__domNode;
      if (
        (!domNode || !domNode.contains(e.target)) &&
        typeof this.__wrappedInstance.handleClickOutside === 'function'
      ) {
        this.__wrappedInstance.handleClickOutside(e);
      }
    }

    render() {
      const { wrappedRef, ...rest } = this.props;

      return (
        <WrappedComponent
          {...rest}
          ref={c => {
            this.__wrappedInstance = c;
            this.__domNode = ReactDOM.findDOMNode(c);
            wrappedRef && wrappedRef(c);
          }}
        />
      );
    }
  }

  EnhancedComponent.displayName = `clickOutside(${componentName})`;

  return hoistNonReactStatic(EnhancedComponent, WrappedComponent);
};
