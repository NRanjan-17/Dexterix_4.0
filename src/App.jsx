import {Link,NavLink} from 'react-router-dom'
import './index.css';

function App() {

  return (
    <>
      <div id="workingarea">
                <div id="nav">
                    <div id="nleft">
                        <div className="logo">
                        NERD
                        </div>
                    </div>
                    <div id="nright">
                
                    </div>
                </div>
                <div id="hero">
                    <div id="heroleft">
                        <div class="elem">
                            <h1>Your unique </h1>
                            <h1>Your unique </h1>
                            <h1>Your unique </h1>
                            <h1>Your unique </h1>
                            <h1>Your unique </h1>
                        </div>
                         <div class="elem">
                            <h1>wellness</h1>
                            <h1>david chang </h1>
                            <h1>david chang </h1>
                            <h1>david chang </h1>
                            <h1>david chang </h1>
                        </div>
                        <div class="elem">
                            <h1>map</h1>
                            <h1>david chang </h1>
                            <h1>david chang </h1>
                            <h1>david chang </h1>
                            <h1>david chang </h1>
                        </div>

                        <Link 
      to="/chat">
          <button>Get started</button>
      </Link>

                </div>
      
      </div>
      </div>
    </>
  )
}

export default App
