import roseLogo from "../images/rose_name.png"


export default function LoginContainer() {

    const openWebsite = () =>
        window.open("https://www.rose-hulman.edu/");

    return (
        <div className="login-container">
            <img id="roseLogo" src={roseLogo} alt=""/>
            <div className="webLink" onClick= {openWebsite}>
                <i className="bi bi-compass"></i>
                <a>rose-hulman.edu</a>
            </div>
        </div>
    )
}
 