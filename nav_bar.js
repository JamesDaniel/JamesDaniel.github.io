'use strict';

const e = React.createElement;

class NavBar extends React.Component {
  render() {
    return  <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
              <div class="container-fluid">
                <a class="navbar-brand" href="javascript:void(0)">Portfolio Website</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="mynavbar">
                  <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                      <a class="nav-link" href="index.html">Home</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="java_patterns.html">Design Patterns in Java</a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
  }
}

const domContainer = document.querySelector('#nav_bar_container');
ReactDOM.render(e(NavBar), domContainer);