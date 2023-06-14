import littleSun from '../../assets/images/sun.png';
import littleBird from '../../assets/images/bird.png';
import './Logo.css'

function Logo() {

  return (
    <>
      <div>
        <img src={littleSun} className="logo-rot" alt="Vite logo" />
        <img src={littleBird} className="logo" alt="React logo" />
      </div>
      <h1>SunChirp</h1>
    </>
  )
}

export default Logo
