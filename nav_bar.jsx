'use strict';

const e = React.createElement;

class NavBar extends React.Component {
  render() {
    return  <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
              <div className="container-fluid">
                <a className="navbar-brand" href="#">Portfolio Website</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mynavbar">
                  <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                      <a className="nav-link" href="index.html">Home</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="java_patterns.html">Design Patterns in Java</a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
  }
}

const domContainer = document.querySelector('#nav_bar_container');
ReactDOM.render(e(NavBar), domContainer);